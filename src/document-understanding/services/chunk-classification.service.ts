import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { ChunkType, ChunkClassification, SemanticChunk } from '../interfaces';
import { LLMService } from './llm.service';
import {
  CHUNK_CLASSIFICATION_SYSTEM_PROMPT,
  CHUNK_CLASSIFICATION_USER_PROMPT,
} from '../prompts/chunk-classification.prompt';

const ClassificationResponseSchema = z.object({
  chunkType: z.enum(['REQUIREMENT', 'TEST_CASE', 'UNKNOWN']),
  confidence: z.number().min(0).max(100),
  reasoning: z.string().optional(),
});

type ClassificationResponse = z.infer<typeof ClassificationResponseSchema>;

@Injectable()
export class ChunkClassificationService {
  private readonly logger = new Logger(ChunkClassificationService.name);

  constructor(private readonly llmService: LLMService) {}

  /**
   * Classifies a semantic chunk as REQUIREMENT, TEST_CASE, or UNKNOWN.
   * Uses AI-based classification with confidence scoring.
   */
  async classifyChunk(chunk: SemanticChunk): Promise<ChunkClassification> {
    this.logger.log(`Classifying chunk: ${chunk.title}`);

    try {
      const response = await this.llmService.generateStructuredResponse<ClassificationResponse>({
        systemPrompt: CHUNK_CLASSIFICATION_SYSTEM_PROMPT,
        userPrompt: CHUNK_CLASSIFICATION_USER_PROMPT(chunk.title, chunk.content),
        temperature: 0.05,
        maxTokens: 256,
      });

      const validated = ClassificationResponseSchema.parse(response);

      this.logger.log(
        `Chunk "${chunk.title}" classified as ${validated.chunkType} (confidence: ${validated.confidence}%)`,
      );

      return {
        chunkType: validated.chunkType as ChunkType,
        confidence: validated.confidence,
      };
    } catch (error) {
      this.logger.error(
        `Failed to classify chunk "${chunk.title}": ${error.message}`,
      );

      // Default to UNKNOWN on classification failure
      return {
        chunkType: ChunkType.UNKNOWN,
        confidence: 0,
      };
    }
  }
}
