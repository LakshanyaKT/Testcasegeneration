import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { z } from 'zod';
import { LLMService } from '../../document-understanding/services/llm.service';
import { DocumentAnalysisRepository } from '../../analysis/repositories/document-analysis.repository';
import { DocumentAnalysisService } from '../../analysis/services/document-analysis.service';
import { ClarificationRepository } from '../repositories/clarification.repository';
import { ClarificationStatus } from '../schemas/clarification.schema';
import { GeneratedClarification } from '../interfaces';
import {
  CLARIFICATION_GENERATION_SYSTEM_PROMPT,
  CLARIFICATION_GENERATION_USER_PROMPT,
  CLARIFICATION_PRIORITY_SYSTEM_PROMPT,
  CLARIFICATION_PRIORITY_USER_PROMPT,
} from '../prompts/clarification.prompt';
import {
  GenerateClarificationsResponseDto,
  GetClarificationsResponseDto,
  ClarificationResponseDto,
  RespondClarificationResponseDto,
  PrioritizeClarificationsResponseDto,
  GetPrioritizedClarificationsResponseDto,
} from '../dto';

const ClarificationItemSchema = z.object({
  question: z.string().min(1),
  reason: z.string().min(1),
});

const ClarificationGenerationResponseSchema = z.object({
  clarifications: z.array(ClarificationItemSchema),
});

const RankedClarificationSchema = z.object({
  clarificationId: z.string(),
  priorityRank: z.number().int().positive(),
  priorityReason: z.string().min(1),
});

const PriorityResponseSchema = z.object({
  rankedClarifications: z.array(RankedClarificationSchema),
});

@Injectable()
export class ClarificationService {
  private readonly logger = new Logger(ClarificationService.name);

  constructor(
    private readonly llmService: LLMService,
    private readonly analysisRepository: DocumentAnalysisRepository,
    private readonly documentAnalysisService: DocumentAnalysisService,
    private readonly clarificationRepository: ClarificationRepository,
  ) {}

  async generateClarifications(
    documentId: string,
  ): Promise<GenerateClarificationsResponseDto> {
    this.logger.log(`Generating clarifications for document: ${documentId}`);

    const analysis = await this.analysisRepository.findByDocumentId(documentId);

    if (!analysis) {
      throw new NotFoundException(
        `No analysis found for document: ${documentId}. Run POST /document-understanding/${documentId}/analyze first.`,
      );
    }

    if (!analysis.missingInformation || analysis.missingInformation.length === 0) {
      this.logger.log(`No missing information found for ${documentId}, returning empty set`);
      return { documentId, totalGenerated: 0, clarifications: [] };
    }

    const rawResult = await this.llmService.generateStructuredResponse<{
      clarifications: GeneratedClarification[];
    }>({
      systemPrompt: CLARIFICATION_GENERATION_SYSTEM_PROMPT,
      userPrompt: CLARIFICATION_GENERATION_USER_PROMPT(
        documentId,
        analysis.overallSummary,
        analysis.missingInformation,
        analysis.riskAreas,
      ),
      temperature: 0.2,
      maxTokens: 4096,
    });

    const validated = ClarificationGenerationResponseSchema.parse(rawResult);
    const saved = await this.clarificationRepository.createMany(documentId, validated.clarifications);

    this.logger.log(`Generated and stored ${saved.length} clarifications for ${documentId}`);

    return {
      documentId,
      totalGenerated: saved.length,
      clarifications: saved.map(this.toResponseDto),
    };
  }

  async prioritizeClarifications(
    documentId: string,
    topK: number = 3,
  ): Promise<PrioritizeClarificationsResponseDto> {
    this.logger.log(`Prioritizing clarifications for document: ${documentId}, topK: ${topK}`);

    const analysis = await this.analysisRepository.findByDocumentId(documentId);
    if (!analysis) {
      throw new NotFoundException(
        `No analysis found for document: ${documentId}. Run analysis first.`,
      );
    }

    const pendingQuestions = await this.clarificationRepository.findPendingByDocumentId(documentId);
    if (pendingQuestions.length === 0) {
      throw new BadRequestException(
        `No PENDING clarification questions found for document: ${documentId}. Generate them first via POST /clarifications/${documentId}/generate`,
      );
    }

    const clampedTopK = Math.min(topK, pendingQuestions.length);

    const questionsPayload = pendingQuestions.map((q) => ({
      clarificationId: q.clarificationId,
      question: q.question,
      reason: q.reason,
    }));

    const rawResult = await this.llmService.generateStructuredResponse<{
      rankedClarifications: Array<{
        clarificationId: string;
        priorityRank: number;
        priorityReason: string;
      }>;
    }>({
      systemPrompt: CLARIFICATION_PRIORITY_SYSTEM_PROMPT,
      userPrompt: CLARIFICATION_PRIORITY_USER_PROMPT(
        documentId,
        analysis.overallSummary,
        analysis.riskAreas,
        analysis.workflow,
        clampedTopK,
        questionsPayload,
      ),
      temperature: 0.1,
      maxTokens: 4096,
    });

    const validated = PriorityResponseSchema.parse(rawResult);

    // Trim to topK in case Claude returned more
    const topRanked = validated.rankedClarifications.slice(0, clampedTopK);

    const batchId = `PRI-${documentId}-${Date.now()}`;

    const rankUpdates = topRanked.map((r) => ({
      clarificationId: r.clarificationId,
      priorityRank: r.priorityRank,
      priorityBatch: batchId,
      priorityReason: r.priorityReason,
    }));

    await this.clarificationRepository.applyPriorityRanks(rankUpdates);

    // Re-fetch the updated records in rank order
    const updated = await this.clarificationRepository.findPrioritizedByDocumentId(
      documentId,
      batchId,
    );

    this.logger.log(
      `Prioritized ${updated.length} of ${pendingQuestions.length} questions (batchId: ${batchId})`,
    );

    return {
      documentId,
      priorityBatchId: batchId,
      topK: clampedTopK,
      totalEvaluated: pendingQuestions.length,
      prioritizedQuestions: updated.map(this.toResponseDto),
    };
  }

  async getPrioritizedClarifications(
    documentId: string,
  ): Promise<GetPrioritizedClarificationsResponseDto> {
    const questions = await this.clarificationRepository.findLatestPrioritizedBatch(documentId);

    if (questions.length === 0) {
      throw new NotFoundException(
        `No prioritized questions found for document: ${documentId}. Run POST /clarifications/${documentId}/prioritize first.`,
      );
    }

    const batchId = questions[0].priorityBatch!;

    return {
      documentId,
      priorityBatchId: batchId,
      total: questions.length,
      questions: questions.map(this.toResponseDto),
    };
  }

  async getClarifications(documentId: string): Promise<GetClarificationsResponseDto> {
    const records = await this.clarificationRepository.findByDocumentId(documentId);
    return {
      documentId,
      total: records.length,
      clarifications: records.map(this.toResponseDto),
    };
  }

  async respondToClarification(
    clarificationId: string,
    answer: string,
  ): Promise<RespondClarificationResponseDto> {
    this.logger.log(`Processing response for clarification: ${clarificationId}`);

    const existing = await this.clarificationRepository.findById(clarificationId);
    if (!existing) {
      throw new NotFoundException(`Clarification not found: ${clarificationId}`);
    }

    if (existing.status === ClarificationStatus.RESOLVED) {
      throw new BadRequestException(`Clarification ${clarificationId} is already RESOLVED.`);
    }

    if (existing.status === ClarificationStatus.REJECTED) {
      throw new BadRequestException(
        `Clarification ${clarificationId} is REJECTED and cannot be answered.`,
      );
    }

    const answered = await this.clarificationRepository.updateAnswer(
      clarificationId,
      answer,
      ClarificationStatus.ANSWERED,
    );

    if (!answered) {
      throw new NotFoundException(`Failed to update clarification: ${clarificationId}`);
    }

    const updatedAnalysis = await this.documentAnalysisService.updateAnalysisWithClarification(
      existing.documentId,
      existing.question,
      answer,
    );

    const resolved = await this.clarificationRepository.markResolved(clarificationId);

    this.logger.log(
      `Clarification ${clarificationId} resolved, analysis updated for ${existing.documentId}`,
    );

    return {
      clarification: this.toResponseDto(resolved!),
      updatedAnalysis,
    };
  }

  private toResponseDto(doc: any): ClarificationResponseDto {
    return {
      clarificationId: doc.clarificationId,
      documentId: doc.documentId,
      question: doc.question,
      reason: doc.reason,
      answer: doc.answer,
      status: doc.status,
      priorityRank: doc.priorityRank ?? null,
      priorityBatch: doc.priorityBatch ?? null,
      priorityReason: doc.priorityReason ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

