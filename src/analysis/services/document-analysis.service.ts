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
import { DocumentAnalysisRepository } from '../repositories/document-analysis.repository';
import {
  DocumentAnalysisResult,
  ChunkAggregation,
} from '../interfaces';
import {
  DOCUMENT_ANALYSIS_SYSTEM_PROMPT,
  DOCUMENT_ANALYSIS_USER_PROMPT,
  DOCUMENT_ANALYSIS_UPDATE_SYSTEM_PROMPT,
  DOCUMENT_ANALYSIS_UPDATE_USER_PROMPT,
} from '../prompts/document-analysis.prompt';
import { AnalyzeDocumentResponseDto } from '../dto';

const DocumentAnalysisResultSchema = z.object({
  documentId: z.string(),
  overallSummary: z.string(),
  identifiedModules: z.array(z.string()),
  dependencies: z.array(z.string()),
  riskAreas: z.array(z.string()),
  missingInformation: z.array(z.string()),
  workflow: z.array(z.string()),
});

@Injectable()
export class DocumentAnalysisService {
  private readonly logger = new Logger(DocumentAnalysisService.name);

  constructor(
    @InjectModel(DocumentChunk.name)
    private readonly chunkModel: Model<DocumentChunkDocument>,
    private readonly llmService: LLMService,
    private readonly analysisRepository: DocumentAnalysisRepository,
  ) {}

  async analyzeDocument(documentId: string): Promise<AnalyzeDocumentResponseDto> {
    this.logger.log(`Starting document analysis for: ${documentId}`);

    this.logger.log(`Fetching chunks from MongoDB for: ${documentId}`);
    const chunks = await this.chunkModel
      .find({ documentId })
      .sort({ chunkNumber: 1 })
      .lean()
      .exec();

    if (!chunks || chunks.length === 0) {
      throw new NotFoundException(
        `No chunks found for document: ${documentId}. Process the document first.`,
      );
    }

    this.logger.log(`Found ${chunks.length} chunks, aggregating and calling Bedrock...`);
    const aggregations = this.aggregateChunks(chunks as any[]);
    const chunksPayload = JSON.stringify(aggregations, null, 2);

    const rawResult = await this.llmService.generateStructuredResponse<DocumentAnalysisResult>({
      systemPrompt: DOCUMENT_ANALYSIS_SYSTEM_PROMPT,
      userPrompt: DOCUMENT_ANALYSIS_USER_PROMPT(documentId, chunksPayload),
      temperature: 0.1,
      maxTokens: 4096,
    });

    const validated = DocumentAnalysisResultSchema.parse(rawResult);

    const requirementChunks = chunks.filter((c: any) => c.chunkType === 'REQUIREMENT').length;
    const testCaseChunks = chunks.filter((c: any) => c.chunkType === 'TEST_CASE').length;

    const metadata = {
      totalChunksAnalyzed: chunks.length,
      requirementChunks,
      testCaseChunks,
      processingVersion: 'v1',
    };

    const saved = await this.analysisRepository.upsert(validated, metadata);

    this.logger.log(
      `Document analysis complete for ${documentId}: ` +
        `${validated.identifiedModules.length} modules, ` +
        `${validated.missingInformation.length} missing items`,
    );

    return this.toResponseDto(saved);
  }

  async getAnalysis(documentId: string): Promise<AnalyzeDocumentResponseDto> {
    const analysis = await this.analysisRepository.findByDocumentId(documentId);

    if (!analysis) {
      throw new NotFoundException(
        `No analysis found for document: ${documentId}. Run analysis first via POST /document-understanding/${documentId}/analyze`,
      );
    }

    return this.toResponseDto(analysis);
  }

  async updateAnalysisWithClarification(
    documentId: string,
    clarificationQuestion: string,
    clarificationAnswer: string,
  ): Promise<AnalyzeDocumentResponseDto> {
    this.logger.log(`Updating analysis for ${documentId} with clarification answer`);

    const existingAnalysis = await this.analysisRepository.findByDocumentId(documentId);

    if (!existingAnalysis) {
      throw new NotFoundException(
        `No analysis found for document: ${documentId}. Run analysis first.`,
      );
    }

    const chunks = await this.chunkModel
      .find({ documentId })
      .sort({ chunkNumber: 1 })
      .lean()
      .exec();

    if (!chunks || chunks.length === 0) {
      throw new BadRequestException(`No chunks found for document: ${documentId}`);
    }

    const aggregations = this.aggregateChunks(chunks as any[]);
    const chunksPayload = JSON.stringify(aggregations, null, 2);
    const existingAnalysisStr = JSON.stringify({
      overallSummary: existingAnalysis.overallSummary,
      identifiedModules: existingAnalysis.identifiedModules,
      dependencies: existingAnalysis.dependencies,
      riskAreas: existingAnalysis.riskAreas,
      missingInformation: existingAnalysis.missingInformation,
      workflow: existingAnalysis.workflow,
    }, null, 2);

    const rawResult = await this.llmService.generateStructuredResponse<DocumentAnalysisResult>({
      systemPrompt: DOCUMENT_ANALYSIS_UPDATE_SYSTEM_PROMPT,
      userPrompt: DOCUMENT_ANALYSIS_UPDATE_USER_PROMPT(
        documentId,
        existingAnalysisStr,
        clarificationQuestion,
        clarificationAnswer,
        chunksPayload,
      ),
      temperature: 0.1,
      maxTokens: 4096,
    });

    const validated = DocumentAnalysisResultSchema.parse(rawResult);

    const metadata = {
      totalChunksAnalyzed: chunks.length,
      requirementChunks: chunks.filter((c: any) => c.chunkType === 'REQUIREMENT').length,
      testCaseChunks: chunks.filter((c: any) => c.chunkType === 'TEST_CASE').length,
      processingVersion: 'v1',
    };

    const saved = await this.analysisRepository.upsert(validated, metadata);

    this.logger.log(`Analysis updated for ${documentId}`);

    return this.toResponseDto(saved);
  }

  private aggregateChunks(chunks: any[]): ChunkAggregation[] {
    return chunks.map((chunk) => {
      const aggregation: ChunkAggregation = {
        chunkId: String(chunk._id),
        title: chunk.title,
        chunkType: chunk.chunkType,
        shortSummary: chunk.summary?.shortSummary ?? '',
        detailedSummary: chunk.summary?.detailedSummary ?? '',
        content: chunk.content,
      };

      if (chunk.chunkType === 'REQUIREMENT' && chunk.extractedData?.requirements) {
        aggregation.requirements = chunk.extractedData.requirements;
      }

      if (chunk.chunkType === 'TEST_CASE' && chunk.extractedData?.testCases) {
        aggregation.testCases = chunk.extractedData.testCases;
      }

      return aggregation;
    });
  }

  private toResponseDto(doc: any): AnalyzeDocumentResponseDto {
    return {
      documentId: doc.documentId,
      overallSummary: doc.overallSummary,
      identifiedModules: doc.identifiedModules,
      dependencies: doc.dependencies,
      riskAreas: doc.riskAreas,
      missingInformation: doc.missingInformation,
      workflow: doc.workflow,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
