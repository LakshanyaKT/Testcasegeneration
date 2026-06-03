import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import {
  ChunkType,
  SemanticChunk,
  ExtractedData,
  RequirementExtractedData,
  TestCaseExtractedData,
  UnknownExtractedData,
  ChunkSummary,
} from '../interfaces';
import { LLMService } from './llm.service';
import {
  REQUIREMENT_EXTRACTION_SYSTEM_PROMPT,
  REQUIREMENT_EXTRACTION_USER_PROMPT,
  TEST_CASE_EXTRACTION_SYSTEM_PROMPT,
  TEST_CASE_EXTRACTION_USER_PROMPT,
  SUMMARY_GENERATION_SYSTEM_PROMPT,
  SUMMARY_GENERATION_USER_PROMPT,
} from '../prompts/knowledge-extraction.prompt';
import { generateRequirementId, generateTestCaseId } from '../utils/id-generator.util';

const RequirementSchema = z.object({
  requirementId: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

const RequirementExtractionResponseSchema = z.object({
  requirements: z.array(RequirementSchema),
});

const TestCaseSchema = z.object({
  testCaseId: z.string().optional(),
  scenario: z.string(),
  preconditions: z.array(z.string()).default([]),
  steps: z.array(z.string()).default([]),
  expectedResults: z.array(z.string()).default([]),
});

const TestCaseExtractionResponseSchema = z.object({
  testCases: z.array(TestCaseSchema),
});

const SummaryResponseSchema = z.object({
  shortSummary: z.string(),
  detailedSummary: z.string(),
  confidence: z.number().min(0).max(100),
});

type RequirementExtractionResponse = z.infer<typeof RequirementExtractionResponseSchema>;
type TestCaseExtractionResponse = z.infer<typeof TestCaseExtractionResponseSchema>;
type SummaryResponse = z.infer<typeof SummaryResponseSchema>;

@Injectable()
export class KnowledgeExtractionService {
  private readonly logger = new Logger(KnowledgeExtractionService.name);

  constructor(private readonly llmService: LLMService) {}

  /**
   * Extracts structured knowledge from a classified chunk.
   */
  async extractKnowledge(
    chunk: SemanticChunk,
    chunkType: ChunkType,
  ): Promise<ExtractedData> {
    this.logger.log(`Extracting knowledge from chunk: ${chunk.title} (type: ${chunkType})`);

    switch (chunkType) {
      case ChunkType.REQUIREMENT:
        return this.extractRequirements(chunk);
      case ChunkType.TEST_CASE:
        return this.extractTestCases(chunk);
      case ChunkType.UNKNOWN:
      default:
        return this.extractUnknown();
    }
  }

  /**
   * Generates a summary for any chunk regardless of type.
   */
  async generateSummary(chunk: SemanticChunk): Promise<ChunkSummary> {
    this.logger.log(`Generating summary for chunk: ${chunk.title}`);

    try {
      const response = await this.llmService.generateStructuredResponse<SummaryResponse>({
        systemPrompt: SUMMARY_GENERATION_SYSTEM_PROMPT,
        userPrompt: SUMMARY_GENERATION_USER_PROMPT(chunk.title, chunk.content),
        temperature: 0.2,
      });

      const validated = SummaryResponseSchema.parse(response);

      return {
        shortSummary: validated.shortSummary,
        detailedSummary: validated.detailedSummary,
        confidence: validated.confidence,
      };
    } catch (error) {
      this.logger.error(`Failed to generate summary for "${chunk.title}": ${error.message}`);
      return {
        shortSummary: chunk.title,
        detailedSummary: chunk.content.substring(0, 200),
        confidence: 0,
      };
    }
  }

  private async extractRequirements(chunk: SemanticChunk): Promise<RequirementExtractedData> {
    try {
      const response =
        await this.llmService.generateStructuredResponse<RequirementExtractionResponse>({
          systemPrompt: REQUIREMENT_EXTRACTION_SYSTEM_PROMPT,
          userPrompt: REQUIREMENT_EXTRACTION_USER_PROMPT(chunk.title, chunk.content),
          temperature: 0.1,
        });

      const validated = RequirementExtractionResponseSchema.parse(response);

      // Ensure all requirements have IDs
      const requirements = validated.requirements.map((req, index) => ({
        requirementId: req.requirementId || generateRequirementId(index),
        title: req.title,
        description: req.description,
      }));

      this.logger.log(
        `Extracted ${requirements.length} requirements from chunk: ${chunk.title}`,
      );

      return { requirements };
    } catch (error) {
      this.logger.error(
        `Failed to extract requirements from "${chunk.title}": ${error.message}`,
      );
      return {
        requirements: [
          {
            requirementId: generateRequirementId(0),
            title: chunk.title,
            description: chunk.content,
          },
        ],
      };
    }
  }

  private async extractTestCases(chunk: SemanticChunk): Promise<TestCaseExtractedData> {
    try {
      const response =
        await this.llmService.generateStructuredResponse<TestCaseExtractionResponse>({
          systemPrompt: TEST_CASE_EXTRACTION_SYSTEM_PROMPT,
          userPrompt: TEST_CASE_EXTRACTION_USER_PROMPT(chunk.title, chunk.content),
          temperature: 0.1,
        });

      const validated = TestCaseExtractionResponseSchema.parse(response);

      // Ensure all test cases have IDs
      const testCases = validated.testCases.map((tc, index) => ({
        testCaseId: tc.testCaseId || generateTestCaseId(index),
        scenario: tc.scenario,
        preconditions: tc.preconditions,
        steps: tc.steps,
        expectedResults: tc.expectedResults,
      }));

      this.logger.log(
        `Extracted ${testCases.length} test cases from chunk: ${chunk.title}`,
      );

      return { testCases };
    } catch (error) {
      this.logger.error(
        `Failed to extract test cases from "${chunk.title}": ${error.message}`,
      );
      return {
        testCases: [
          {
            testCaseId: generateTestCaseId(0),
            scenario: chunk.title,
            preconditions: [],
            steps: [chunk.content],
            expectedResults: [],
          },
        ],
      };
    }
  }

  private extractUnknown(): UnknownExtractedData {
    return { category: 'UNKNOWN' };
  }
}
