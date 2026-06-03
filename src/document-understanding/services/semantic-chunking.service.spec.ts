import { Test, TestingModule } from '@nestjs/testing';
import { SemanticChunkingService } from './semantic-chunking.service';
import { LLMService } from './llm.service';
import { Section } from '../interfaces';

describe('SemanticChunkingService', () => {
  let service: SemanticChunkingService;
  let llmService: jest.Mocked<LLMService>;

  beforeEach(async () => {
    const mockLLMService = {
      generateStructuredResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SemanticChunkingService,
        { provide: LLMService, useValue: mockLLMService },
      ],
    }).compile();

    service = module.get<SemanticChunkingService>(SemanticChunkingService);
    llmService = module.get(LLMService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chunkSection', () => {
    it('should return single chunk for small sections', async () => {
      const section: Section = {
        sectionId: 'SEC_001',
        title: 'Small Section',
        content: 'Short content',
        pageRange: { startPage: 1, endPage: 1 },
      };

      const chunks = await service.chunkSection(section);

      expect(chunks.length).toBe(1);
      expect(chunks[0].title).toBe('Small Section');
      expect(chunks[0].content).toBe('Short content');
      expect(llmService.generateStructuredResponse).not.toHaveBeenCalled();
    });

    it('should call LLM for larger sections', async () => {
      const section: Section = {
        sectionId: 'SEC_001',
        title: 'Large Section',
        content: 'A'.repeat(200),
        pageRange: { startPage: 1, endPage: 2 },
      };

      llmService.generateStructuredResponse.mockResolvedValue({
        chunks: [
          { chunkNumber: 1, title: 'Part 1', content: 'A'.repeat(100) },
          { chunkNumber: 2, title: 'Part 2', content: 'A'.repeat(100) },
        ],
      });

      const chunks = await service.chunkSection(section);

      expect(chunks.length).toBe(2);
      expect(llmService.generateStructuredResponse).toHaveBeenCalledTimes(1);
    });

    it('should use fallback chunking on LLM failure', async () => {
      const section: Section = {
        sectionId: 'SEC_001',
        title: 'Failing Section',
        content: 'Paragraph one content here.\n\nParagraph two content here.',
        pageRange: { startPage: 1, endPage: 1 },
      };

      // Content is too short (<100 chars), so it won't hit the LLM
      // Let's make it longer
      const longSection: Section = {
        ...section,
        content: 'First paragraph with enough content to pass the threshold.\n\nSecond paragraph with enough content to pass the threshold as well.',
      };

      llmService.generateStructuredResponse.mockRejectedValue(
        new Error('LLM failure'),
      );

      const chunks = await service.chunkSection(longSection);

      expect(chunks.length).toBeGreaterThan(0);
    });

    it('should use fallback when LLM returns empty chunks', async () => {
      const section: Section = {
        sectionId: 'SEC_001',
        title: 'Empty Response Section',
        content: 'Content that is long enough to trigger the LLM call for processing.',
        pageRange: { startPage: 1, endPage: 1 },
      };

      // Extend content to > 100 chars
      const longSection: Section = {
        ...section,
        content: 'A'.repeat(150),
      };

      llmService.generateStructuredResponse.mockResolvedValue({
        chunks: [],
      });

      const chunks = await service.chunkSection(longSection);

      expect(chunks.length).toBeGreaterThan(0);
    });
  });
});
