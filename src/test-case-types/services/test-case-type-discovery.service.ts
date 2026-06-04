import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { z } from 'zod';
import { DocumentChunk, DocumentChunkDocument } from '../../document-understanding/schemas/document-chunk.schema';
import { LLMService } from '../../document-understanding/services/llm.service';
import { DocumentAnalysisRepository } from '../../analysis/repositories/document-analysis.repository';
import { ClarificationRepository } from '../../clarification/repositories/clarification.repository';
import { TestCaseTypeSelectionRepository } from '../repositories/test-case-type-selection.repository';
import {
  TEST_CASE_TYPE_DISCOVERY_SYSTEM_PROMPT,
  TEST_CASE_TYPE_DISCOVERY_USER_PROMPT,
} from '../prompts/test-case-type-discovery.prompt';
import { TestCaseTypeSelectionResponseDto } from '../dto';

const DiscoveryResultSchema = z.object({
  detectedTypes: z.array(z.string().min(1)),
  suggestedTypes: z.array(
    z.object({
      type: z.string().min(1),
      reason: z.string().min(1),
    }),
  ).min(2).max(3),
});

@Injectable()
export class TestCaseTypeDiscoveryService {
  private readonly logger = new Logger(TestCaseTypeDiscoveryService.name);

  constructor(
    @InjectModel(DocumentChunk.name)
    private readonly chunkModel: Model<DocumentChunkDocument>,
    private readonly llmService: LLMService,
    private readonly analysisRepository: DocumentAnalysisRepository,
    private readonly clarificationRepository: ClarificationRepository,
    private readonly selectionRepository: TestCaseTypeSelectionRepository,
  ) {}

  async discoverTestCaseTypes(documentId: string): Promise<TestCaseTypeSelectionResponseDto> {
    this.logger.log(`Discovering test case types for: ${documentId}`);

    const analysis = await this.analysisRepository.findByDocumentId(documentId);
    if (!analysis) {
      throw new NotFoundException(
        `No analysis found for document: ${documentId}. Run POST /document-understanding/${documentId}/analyze first.`,
      );
    }

    const chunks = await this.chunkModel.find({ documentId }).lean().exec();
    if (!chunks || chunks.length === 0) {
      throw new BadRequestException(`No chunks found for document: ${documentId}.`);
    }

    const resolvedClarifications = await this.clarificationRepository.findResolvedByDocumentId(documentId);

    // Build requirement and test case samples for the prompt (cap at 3000 chars each)
    const requirementsSample = this.buildSample(
      chunks.filter((c: any) => c.chunkType === 'REQUIREMENT'),
      'requirements',
      3000,
    );

    const testCasesSample = this.buildSample(
      chunks.filter((c: any) => c.chunkType === 'TEST_CASE'),
      'testCases',
      3000,
    );

    const clarificationsPayload = resolvedClarifications.map((c) => ({
      question: c.question,
      answer: c.answer ?? '',
    }));

    const rawResult = await this.llmService.generateStructuredResponse<{
      detectedTypes: string[];
      suggestedTypes: Array<{ type: string; reason: string }>;
    }>({
      systemPrompt: TEST_CASE_TYPE_DISCOVERY_SYSTEM_PROMPT,
      userPrompt: TEST_CASE_TYPE_DISCOVERY_USER_PROMPT(
        documentId,
        analysis.overallSummary,
        analysis.identifiedModules,
        analysis.riskAreas,
        analysis.workflow,
        clarificationsPayload,
        requirementsSample,
        testCasesSample,
      ),
      temperature: 0.2,
      maxTokens: 4096,
    });

    const validated = DiscoveryResultSchema.parse(rawResult);

    const saved = await this.selectionRepository.upsertDiscovery(
      documentId,
      validated.detectedTypes,
      validated.suggestedTypes,
    );

    this.logger.log(
      `Discovered ${validated.detectedTypes.length} types, suggested ${validated.suggestedTypes.length} for ${documentId}`,
    );

    return this.toResponseDto(saved);
  }

  async getTypeSelection(documentId: string): Promise<TestCaseTypeSelectionResponseDto> {
    const record = await this.selectionRepository.findByDocumentId(documentId);
    if (!record) {
      throw new NotFoundException(
        `No type selection found for document: ${documentId}. Run POST /test-case-types/${documentId}/discover first.`,
      );
    }
    return this.toResponseDto(record);
  }

  async approveTypes(
    documentId: string,
    approvedTypes: string[],
  ): Promise<TestCaseTypeSelectionResponseDto> {
    this.logger.log(`Approving test case types for: ${documentId}`);

    const record = await this.selectionRepository.findByDocumentId(documentId);
    if (!record) {
      throw new NotFoundException(
        `No type selection found for document: ${documentId}. Run discover first.`,
      );
    }

    // Validate all approved types exist in the allowed pool
    const allowedTypes = new Set([
      ...record.detectedTypes,
      ...record.suggestedTypes.map((s) => s.type),
    ]);

    const invalidTypes = approvedTypes.filter((t) => !allowedTypes.has(t));
    if (invalidTypes.length > 0) {
      throw new BadRequestException(
        `Invalid types submitted: [${invalidTypes.join(', ')}]. ` +
        `Allowed types are: [${[...allowedTypes].join(', ')}]`,
      );
    }

    const updated = await this.selectionRepository.approve(documentId, approvedTypes);
    if (!updated) {
      throw new NotFoundException(`Failed to update type selection for: ${documentId}`);
    }

    this.logger.log(`Types approved for ${documentId}: [${approvedTypes.join(', ')}]`);

    return this.toResponseDto(updated);
  }

  private buildSample(chunks: any[], dataKey: string, maxChars: number): string {
    let result = '';
    for (const chunk of chunks) {
      const items = chunk.extractedData?.[dataKey];
      if (!items || items.length === 0) continue;
      const chunkText = `[${chunk.title}]\n${JSON.stringify(items, null, 2)}\n\n`;
      if (result.length + chunkText.length > maxChars) break;
      result += chunkText;
    }
    return result || 'None available.';
  }

  private toResponseDto(doc: any): TestCaseTypeSelectionResponseDto {
    return {
      documentId: doc.documentId,
      detectedTypes: doc.detectedTypes,
      suggestedTypes: doc.suggestedTypes,
      finalTypes: doc.finalTypes,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
