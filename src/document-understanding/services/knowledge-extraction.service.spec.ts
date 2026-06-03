import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeExtractionService } from './knowledge-extraction.service';
import { LLMService } from './llm.service';
import { ChunkType, SemanticChunk } from '../interfaces';

describe('KnowledgeExtractionService', () => {
  let service: KnowledgeExtractionService;
  let llmService: jest.Mocked<LLMService>;

  beforeEach(async () => {
    const mockLLMService = {
      generateStructuredResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KnowledgeExtractionService,
        { provide: LLMService, useValue: mockLLMService },
      ],
    }).compile();

    service = module.get<KnowledgeExtractionService>(KnowledgeExtractionService);
    llmService = module.get(LLMService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractKnowledge', () => {
    const chunk: SemanticChunk = {
      chunkNumber: 1,
      title: 'User Authentication',
      content: 'The system shall support OAuth 2.0 authentication',
    };

    it('should extract requirements for REQUIREMENT type', async () => {
      llmService.generateStructuredResponse.mockResolvedValue({
        requirements: [
          {
            requirementId: 'REQ-001',
            title: 'OAuth Support',
            description: 'The system shall support OAuth 2.0 authentication',
          },
        ],
      });

      const result = await service.extractKnowledge(chunk, ChunkType.REQUIREMENT);

      expect('requirements' in result).toBe(true);
      if ('requirements' in result) {
        expect(result.requirements.length).toBe(1);
        expect(result.requirements[0].requirementId).toBe('REQ-001');
      }
    });

    it('should generate requirement IDs when missing', async () => {
      llmService.generateStructuredResponse.mockResolvedValue({
        requirements: [
          {
            title: 'No ID Requirement',
            description: 'A requirement without an ID',
          },
        ],
      });

      const result = await service.extractKnowledge(chunk, ChunkType.REQUIREMENT);

      if ('requirements' in result) {
        expect(result.requirements[0].requirementId).toMatch(/REQ_AUTO_\d+/);
      }
    });

    it('should extract test cases for TEST_CASE type', async () => {
      const testChunk: SemanticChunk = {
        chunkNumber: 2,
        title: 'Login Test',
        content: 'Test login with valid credentials',
      };

      llmService.generateStructuredResponse.mockResolvedValue({
        testCases: [
          {
            testCaseId: 'TC-001',
            scenario: 'Verify valid login',
            preconditions: ['User exists'],
            steps: ['Enter credentials', 'Click login'],
            expectedResults: ['User is logged in'],
          },
        ],
      });

      const result = await service.extractKnowledge(testChunk, ChunkType.TEST_CASE);

      expect('testCases' in result).toBe(true);
      if ('testCases' in result) {
        expect(result.testCases.length).toBe(1);
        expect(result.testCases[0].testCaseId).toBe('TC-001');
      }
    });

    it('should generate test case IDs when missing', async () => {
      const testChunk: SemanticChunk = {
        chunkNumber: 2,
        title: 'Login Test',
        content: 'Test login',
      };

      llmService.generateStructuredResponse.mockResolvedValue({
        testCases: [
          {
            scenario: 'Test without ID',
            preconditions: [],
            steps: ['Step 1'],
            expectedResults: ['Result 1'],
          },
        ],
      });

      const result = await service.extractKnowledge(testChunk, ChunkType.TEST_CASE);

      if ('testCases' in result) {
        expect(result.testCases[0].testCaseId).toMatch(/TC_AUTO_\d+/);
      }
    });

    it('should return UNKNOWN category for UNKNOWN type', async () => {
      const result = await service.extractKnowledge(chunk, ChunkType.UNKNOWN);

      expect('category' in result).toBe(true);
      if ('category' in result) {
        expect(result.category).toBe('UNKNOWN');
      }
    });

    it('should handle LLM failure gracefully for requirements', async () => {
      llmService.generateStructuredResponse.mockRejectedValue(
        new Error('LLM error'),
      );

      const result = await service.extractKnowledge(chunk, ChunkType.REQUIREMENT);

      expect('requirements' in result).toBe(true);
      if ('requirements' in result) {
        expect(result.requirements.length).toBe(1);
        expect(result.requirements[0].requirementId).toMatch(/REQ_AUTO_/);
      }
    });
  });

  describe('generateSummary', () => {
    it('should generate summary successfully', async () => {
      const chunk: SemanticChunk = {
        chunkNumber: 1,
        title: 'Test Chunk',
        content: 'Some content to summarize',
      };

      llmService.generateStructuredResponse.mockResolvedValue({
        shortSummary: 'Brief summary',
        detailedSummary: 'A more detailed summary of the content.',
        confidence: 90,
      });

      const result = await service.generateSummary(chunk);

      expect(result.shortSummary).toBe('Brief summary');
      expect(result.detailedSummary).toBe('A more detailed summary of the content.');
      expect(result.confidence).toBe(90);
    });

    it('should provide fallback summary on failure', async () => {
      const chunk: SemanticChunk = {
        chunkNumber: 1,
        title: 'Failing Chunk',
        content: 'Content that fails to summarize',
      };

      llmService.generateStructuredResponse.mockRejectedValue(
        new Error('LLM error'),
      );

      const result = await service.generateSummary(chunk);

      expect(result.shortSummary).toBe('Failing Chunk');
      expect(result.confidence).toBe(0);
    });
  });
});
