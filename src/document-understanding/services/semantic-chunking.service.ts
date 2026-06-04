import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { Section, SemanticChunk } from '../interfaces';
import { LLMService } from './llm.service';
import {
  SEMANTIC_CHUNKING_SYSTEM_PROMPT,
  SEMANTIC_CHUNKING_USER_PROMPT,
} from '../prompts/semantic-chunking.prompt';

const SemanticChunkSchema = z.object({
  chunkNumber: z.number(),
  title: z.string(),
  content: z.string(),
});

const SemanticChunkingResponseSchema = z.object({
  chunks: z.array(SemanticChunkSchema),
});

type SemanticChunkingResponse = z.infer<typeof SemanticChunkingResponseSchema>;

@Injectable()
export class SemanticChunkingService {
  private readonly logger = new Logger(SemanticChunkingService.name);

  constructor(private readonly llmService: LLMService) {}

  /**
   * Performs AI-based semantic chunking on a section.
   * Splits large sections into meaningful semantic chunks while keeping related information together.
   */
  async chunkSection(section: Section): Promise<SemanticChunk[]> {
    this.logger.log(`Chunking section: ${section.title}`);

    // For very small sections, skip LLM call
    if (section.content.length < 100) {
      return [
        {
          chunkNumber: 1,
          title: section.title,
          content: section.content,
        },
      ];
    }

    try {
      const response = await this.llmService.generateStructuredResponse<SemanticChunkingResponse>({
        systemPrompt: SEMANTIC_CHUNKING_SYSTEM_PROMPT,
        userPrompt: SEMANTIC_CHUNKING_USER_PROMPT(section.title, section.content),
        temperature: 0.1,
        maxTokens: 4096,
      });

      const validated = SemanticChunkingResponseSchema.parse(response);

      if (!validated.chunks || validated.chunks.length === 0) {
        this.logger.warn(`No chunks returned for section: ${section.title}, using fallback`);
        return this.fallbackChunking(section);
      }

      this.logger.log(
        `Section "${section.title}" split into ${validated.chunks.length} chunks`,
      );

      return validated.chunks;
    } catch (error) {
      this.logger.error(
        `Failed to chunk section "${section.title}": ${error.message}`,
      );
      return this.fallbackChunking(section);
    }
  }

  /**
   * Fallback chunking when AI chunking fails.
   * Uses simple paragraph-based splitting.
   */
  private fallbackChunking(section: Section): SemanticChunk[] {
    this.logger.warn(`Using fallback chunking for section: ${section.title}`);

    const paragraphs = section.content
      .split(/\n\n+/)
      .filter((p) => p.trim().length > 0);

    if (paragraphs.length <= 1) {
      return [
        {
          chunkNumber: 1,
          title: section.title,
          content: section.content,
        },
      ];
    }

    return paragraphs.map((paragraph, index) => ({
      chunkNumber: index + 1,
      title: `${section.title} - Part ${index + 1}`,
      content: paragraph.trim(),
    }));
  }
}
