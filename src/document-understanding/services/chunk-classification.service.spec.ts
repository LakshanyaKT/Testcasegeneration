import { Test, TestingModule } from '@nestjs/testing';
import { ChunkClassificationService } from './chunk-classification.service';
import { LLMService } from './llm.service';
import { ChunkType, SemanticChunk } from '../interfaces';

describe('ChunkClassificationService', () => {
  let service: ChunkClassificationService;
  let llmService: jest.Mocked<LLMService>;

  beforeEach(async () => {
    const mockLLMService = {
      generateStructuredResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChunkClassificationService,
        { provide: LLMService, useValue: mockLLMService },
      ],
    }).compile();

    service = module.get<ChunkClassificationService>(ChunkClassificationService);
    llmService = module.get(LLMService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('classifyChunk', () => {
    it('should classify a requirement chunk', async () => {
      const chunk: SemanticChunk = {
        chunkNumber: 1,
        title: 'Login Requirements',
        content: 'The system shall authenticate users via OAuth 2.0',
      };

      llmService.generateStructuredResponse.mockResolvedValue({
        chunkType: 'REQUIREMENT',
        confidence: 95,
        reasoning: 'Contains "shall" and describes system behavior',
      });

      const result = await service.classifyChunk(chunk);

      expect(result.chunkType).toBe(ChunkType.REQUIREMENT);
      expect(result.confidence).toBe(95);
    });

    it('should classify a test case chunk', async () => {
      const chunk: SemanticChunk = {
        chunkNumber: 2,
        title: 'Login Test',
        content: 'Verify that the user can log in with valid credentials. Steps: 1. Navigate to login page 2. Enter credentials',
      };

      llmService.generateStructuredResponse.mockResolvedValue({
        chunkType: 'TEST_CASE',
        confidence: 92,
        reasoning: 'Contains test steps and verification',
      });

      const result = await service.classifyChunk(chunk);

      expect(result.chunkType).toBe(ChunkType.TEST_CASE);
      expect(result.confidence).toBe(92);
    });

    it('should classify unknown content', async () => {
      const chunk: SemanticChunk = {
        chunkNumber: 3,
        title: 'Meeting Notes',
        content: 'Discussed timeline for Q3. Action items assigned.',
      };

      llmService.generateStructuredResponse.mockResolvedValue({
        chunkType: 'UNKNOWN',
        confidence: 88,
        reasoning: 'Meeting notes, not a requirement or test case',
      });

      const result = await service.classifyChunk(chunk);

      expect(result.chunkType).toBe(ChunkType.UNKNOWN);
      expect(result.confidence).toBe(88);
    });

    it('should default to UNKNOWN on LLM failure', async () => {
      const chunk: SemanticChunk = {
        chunkNumber: 4,
        title: 'Error Case',
        content: 'Some content',
      };

      llmService.generateStructuredResponse.mockRejectedValue(
        new Error('LLM failure'),
      );

      const result = await service.classifyChunk(chunk);

      expect(result.chunkType).toBe(ChunkType.UNKNOWN);
      expect(result.confidence).toBe(0);
    });
  });
});
