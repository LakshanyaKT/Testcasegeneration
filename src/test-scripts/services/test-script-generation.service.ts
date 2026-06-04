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
import { ClarificationRepository } from '../../clarification/repositories/clarification.repository';
import { TestCaseTypeSelectionRepository } from '../../test-case-types/repositories/test-case-type-selection.repository';
import { TestCaseTypeSelectionStatus } from '../../test-case-types/schemas/test-case-type-selection.schema';
import { TestScriptRepository } from '../repositories/test-script.repository';
import { TestScriptSourceTrack, TestScriptPriority } from '../schemas/test-script.schema';
import {
  REQUIREMENT_TRACK_SYSTEM_PROMPT,
  REQUIREMENT_TRACK_USER_PROMPT,
  TEST_CASE_TRACK_SYSTEM_PROMPT,
  TEST_CASE_TRACK_USER_PROMPT,
} from '../prompts/test-script-generation.prompt';
import {
  GenerateTestScriptsResponseDto,
  GetTestScriptsResponseDto,
  TestScriptsSummaryDto,
  TestScriptResponseDto,
} from '../dto';

const GeneratedScriptSchema = z.object({
  testCaseType: z.string().min(1),
  title: z.string().min(1),
  sourceRequirementId: z.string().nullable().optional(),
  sourceTestCaseId: z.string().nullable().optional(),
  preconditions: z.array(z.string()).default([]),
  steps: z.array(z.string()).min(1),
  expectedResults: z.array(z.string()).min(1),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
});

const GenerationResponseSchema = z.object({
  testScripts: z.array(GeneratedScriptSchema),
});

@Injectable()
export class TestScriptGenerationService {
  private readonly logger = new Logger(TestScriptGenerationService.name);

  constructor(
    @InjectModel(DocumentChunk.name)
    private readonly chunkModel: Model<DocumentChunkDocument>,
    private readonly llmService: LLMService,
    private readonly clarificationRepository: ClarificationRepository,
    private readonly typeSelectionRepository: TestCaseTypeSelectionRepository,
    private readonly testScriptRepository: TestScriptRepository,
  ) {}

  async generateTestScripts(documentId: string): Promise<GenerateTestScriptsResponseDto> {
    this.logger.log(`Starting test script generation for: ${documentId}`);

    // Gate: must have approved types
    const typeSelection = await this.typeSelectionRepository.findByDocumentId(documentId);
    if (!typeSelection) {
      throw new NotFoundException(
        `No test case type selection found for document: ${documentId}. Run POST /test-case-types/${documentId}/discover first.`,
      );
    }
    if (typeSelection.status !== TestCaseTypeSelectionStatus.APPROVED) {
      throw new BadRequestException(
        `Test case types for document ${documentId} are not yet approved. ` +
        `Run POST /test-case-types/${documentId}/approve to freeze the types before generating scripts.`,
      );
    }

    const finalTypes = typeSelection.finalTypes;
    if (!finalTypes || finalTypes.length === 0) {
      throw new BadRequestException(`No finalTypes found for document: ${documentId}.`);
    }

    // Fetch all chunks
    const chunks = await this.chunkModel.find({ documentId }).lean().exec() as any[];
    if (!chunks || chunks.length === 0) {
      throw new NotFoundException(`No chunks found for document: ${documentId}.`);
    }

    // Fetch resolved clarifications
    const resolvedClarifications = await this.clarificationRepository.findResolvedByDocumentId(documentId);
    const clarificationsPayload = resolvedClarifications.map((c) => ({
      question: c.question,
      answer: c.answer ?? '',
    }));

    // Clear any previously generated scripts for this document
    await this.testScriptRepository.deleteByDocumentId(documentId);

    const requirementChunks = chunks.filter((c) => c.chunkType === 'REQUIREMENT');
    const testCaseChunks = chunks.filter((c) => c.chunkType === 'TEST_CASE');

    const allScripts: any[] = [];
    let scriptIndex = 0;

    // ── Track A: REQUIREMENT chunks ─────────────────────────────────────────
    for (const chunk of requirementChunks) {
      const requirements = chunk.extractedData?.requirements;
      if (!requirements || requirements.length === 0) continue;

      this.logger.log(`Track A — generating scripts for chunk: ${chunk.title}`);

      try {
        const rawResult = await this.llmService.generateStructuredResponse<{
          testScripts: any[];
        }>({
          systemPrompt: REQUIREMENT_TRACK_SYSTEM_PROMPT,
          userPrompt: REQUIREMENT_TRACK_USER_PROMPT(
            chunk.title,
            finalTypes,
            requirements,
            clarificationsPayload,
          ),
          temperature: 0.2,
          maxTokens: 8192,
        });

        const validated = GenerationResponseSchema.parse(rawResult);

        for (const script of validated.testScripts) {
          allScripts.push({
            testScriptId: `TS-${documentId}-${Date.now()}-${scriptIndex++}`,
            documentId,
            chunkId: String(chunk._id),
            chunkTitle: chunk.title,
            sourceTrack: TestScriptSourceTrack.REQUIREMENT,
            testCaseType: script.testCaseType,
            title: script.title,
            sourceRequirementId: script.sourceRequirementId ?? null,
            sourceTestCaseId: null,
            preconditions: script.preconditions,
            steps: script.steps,
            expectedResults: script.expectedResults,
            priority: script.priority as TestScriptPriority,
          });
        }

        this.logger.log(`Track A — ${validated.testScripts.length} scripts from "${chunk.title}"`);
      } catch (error) {
        this.logger.error(`Track A failed for chunk "${chunk.title}": ${error.message}`);
      }
    }

    const fromRequirementTrack = allScripts.length;

    // ── Track B: TEST_CASE chunks ────────────────────────────────────────────
    for (const chunk of testCaseChunks) {
      const existingTestCases = chunk.extractedData?.testCases;
      if (!existingTestCases || existingTestCases.length === 0) continue;

      this.logger.log(`Track B — enriching scripts for chunk: ${chunk.title}`);

      try {
        const rawResult = await this.llmService.generateStructuredResponse<{
          testScripts: any[];
        }>({
          systemPrompt: TEST_CASE_TRACK_SYSTEM_PROMPT,
          userPrompt: TEST_CASE_TRACK_USER_PROMPT(
            chunk.title,
            finalTypes,
            existingTestCases,
            clarificationsPayload,
          ),
          temperature: 0.2,
          maxTokens: 8192,
        });

        const validated = GenerationResponseSchema.parse(rawResult);

        for (const script of validated.testScripts) {
          allScripts.push({
            testScriptId: `TS-${documentId}-${Date.now()}-${scriptIndex++}`,
            documentId,
            chunkId: String(chunk._id),
            chunkTitle: chunk.title,
            sourceTrack: TestScriptSourceTrack.TEST_CASE,
            testCaseType: script.testCaseType,
            title: script.title,
            sourceRequirementId: null,
            sourceTestCaseId: script.sourceTestCaseId ?? null,
            preconditions: script.preconditions,
            steps: script.steps,
            expectedResults: script.expectedResults,
            priority: script.priority as TestScriptPriority,
          });
        }

        this.logger.log(`Track B — ${validated.testScripts.length} scripts from "${chunk.title}"`);
      } catch (error) {
        this.logger.error(`Track B failed for chunk "${chunk.title}": ${error.message}`);
      }
    }

    const fromTestCaseTrack = allScripts.length - fromRequirementTrack;

    // Persist all scripts
    if (allScripts.length > 0) {
      await this.testScriptRepository.insertMany(allScripts);
    }

    this.logger.log(
      `Generation complete for ${documentId}: ${allScripts.length} scripts ` +
      `(Track A: ${fromRequirementTrack}, Track B: ${fromTestCaseTrack})`,
    );

    return {
      documentId,
      totalGenerated: allScripts.length,
      fromRequirementTrack,
      fromTestCaseTrack,
      testCaseTypes: finalTypes,
      testScripts: allScripts.map(this.toResponseDto),
    };
  }

  async getTestScripts(documentId: string): Promise<GetTestScriptsResponseDto> {
    const scripts = await this.testScriptRepository.findByDocumentId(documentId);

    // Group by testCaseType
    const grouped = new Map<string, TestScriptResponseDto[]>();
    for (const s of scripts) {
      const dto = this.toResponseDto(s);
      if (!grouped.has(s.testCaseType)) grouped.set(s.testCaseType, []);
      grouped.get(s.testCaseType)!.push(dto);
    }

    return {
      documentId,
      total: scripts.length,
      byType: [...grouped.entries()].map(([type, items]) => ({
        testCaseType: type,
        count: items.length,
        scripts: items,
      })),
    };
  }

  async getTestScriptsSummary(documentId: string): Promise<TestScriptsSummaryDto> {
    const total = await this.testScriptRepository.countByDocumentId(documentId);
    if (total === 0) {
      throw new NotFoundException(
        `No test scripts found for document: ${documentId}. Run POST /test-scripts/${documentId}/generate first.`,
      );
    }

    const { byType, byTrack, byPriority } =
      await this.testScriptRepository.aggregateSummary(documentId);

    return {
      documentId,
      totalScripts: total,
      byType,
      byTrack,
      byPriority,
      testCaseTypes: Object.keys(byType),
    };
  }

  private toResponseDto(doc: any): TestScriptResponseDto {
    return {
      testScriptId: doc.testScriptId,
      documentId: doc.documentId,
      chunkId: doc.chunkId,
      chunkTitle: doc.chunkTitle,
      sourceTrack: doc.sourceTrack,
      testCaseType: doc.testCaseType,
      title: doc.title,
      sourceRequirementId: doc.sourceRequirementId ?? null,
      sourceTestCaseId: doc.sourceTestCaseId ?? null,
      preconditions: doc.preconditions,
      steps: doc.steps,
      expectedResults: doc.expectedResults,
      priority: doc.priority,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
