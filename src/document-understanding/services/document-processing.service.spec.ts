import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DocumentProcessingService } from './document-processing.service';
import { SectionDiscoveryService } from './section-discovery.service';
import { SemanticChunkingService } from './semantic-chunking.service';
import { ChunkClassificationService } from './chunk-classification.service';
import { KnowledgeExtractionService } from './knowledge-extraction.service';
import { DocumentEntity } from '../schemas/document.schema';
import { DocumentChunk } from '../schemas/document-chunk.schema';
import { ChunkType } from '../interfaces';

describe('DocumentProcessingService', () => {
  let service: DocumentProcessingService;
  let sectionDiscoveryService: jest.Mocked<SectionDiscoveryService>;
  let semanticChunkingService: jest.Mocked<SemanticChunkingService>;
  let chunkClassificationService: jest.Mocked<ChunkClassificationService>;
  let knowledgeExtractionService: jest.Mocked<KnowledgeExtractionService>;

  const mockDocumentModel = {
    findOneAndUpdate: jest.fn().mockResolvedValue({}),
  };

  const mockChunkModel = {
    deleteMany: jest.fn().mockResolvedValue({}),
    insertMany: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentProcessingService,
        {
          provide: getModelToken(DocumentEntity.name),
          useValue: mockDocumentModel,
        },
        {
          provide: getModelToken(DocumentChunk.name),
          useValue: mockChunkModel,
        },
        {
          provide: SectionDiscoveryService,
          useValue: {
            discoverSections: jest.fn(),
          },
        },
        {
          provide: SemanticChunkingService,
          useValue: {
            chunkSection: jest.fn(),
          },
        },
        {
          provide: ChunkClassificationService,
          useValue: {
            classifyChunk: jest.fn(),
          },
        },
        {
          provide: KnowledgeExtractionService,
          useValue: {
            extractKnowledge: jest.fn(),
            generateSummary: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentProcessingService>(DocumentProcessingService);
    sectionDiscoveryService = module.get(SectionDiscoveryService);
    semanticChunkingService = module.get(SemanticChunkingService);
    chunkClassificationService = module.get(ChunkClassificationService);
    knowledgeExtractionService = module.get(KnowledgeExtractionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processDocument', () => {
    it('should process a document through the full pipeline', async () => {
      // Setup mocks
      sectionDiscoveryService.discoverSections.mockReturnValue([
        {
          sectionId: 'SEC_001',
          title: 'Requirements',
          content: 'The system shall authenticate users',
          pageRange: { startPage: 1, endPage: 1 },
        },
      ]);

      semanticChunkingService.chunkSection.mockResolvedValue([
        {
          chunkNumber: 1,
          title: 'Authentication Requirement',
          content: 'The system shall authenticate users',
        },
      ]);

      chunkClassificationService.classifyChunk.mockResolvedValue({
        chunkType: ChunkType.REQUIREMENT,
        confidence: 95,
      });

      knowledgeExtractionService.extractKnowledge.mockResolvedValue({
        requirements: [
          {
            requirementId: 'REQ-001',
            title: 'User Auth',
            description: 'The system shall authenticate users',
          },
        ],
      });

      knowledgeExtractionService.generateSummary.mockResolvedValue({
        shortSummary: 'Authentication requirement',
        detailedSummary: 'Describes the authentication mechanism',
        confidence: 92,
      });

      const result = await service.processDocument({
        documentId: 'DOC001',
        markdown: '# Requirements\nThe system shall authenticate users',
      });

      expect(result.totalChunks).toBe(1);
      expect(result.requirementChunks).toBe(1);
      expect(result.testCaseChunks).toBe(0);
      expect(result.unknownChunks).toBe(0);
      expect(result.chunks.length).toBe(1);
      expect(result.chunks[0].chunkType).toBe(ChunkType.REQUIREMENT);
    });

    it('should handle multiple chunk types', async () => {
      sectionDiscoveryService.discoverSections.mockReturnValue([
        {
          sectionId: 'SEC_001',
          title: 'Mixed Content',
          content: 'Mixed content here',
          pageRange: { startPage: 1, endPage: 3 },
        },
      ]);

      semanticChunkingService.chunkSection.mockResolvedValue([
        { chunkNumber: 1, title: 'Req', content: 'System shall...' },
        { chunkNumber: 2, title: 'Test', content: 'Verify that...' },
        { chunkNumber: 3, title: 'Notes', content: 'Meeting notes...' },
      ]);

      chunkClassificationService.classifyChunk
        .mockResolvedValueOnce({ chunkType: ChunkType.REQUIREMENT, confidence: 90 })
        .mockResolvedValueOnce({ chunkType: ChunkType.TEST_CASE, confidence: 88 })
        .mockResolvedValueOnce({ chunkType: ChunkType.UNKNOWN, confidence: 85 });

      knowledgeExtractionService.extractKnowledge
        .mockResolvedValueOnce({
          requirements: [{ requirementId: 'REQ-001', title: 'R', description: 'D' }],
        })
        .mockResolvedValueOnce({
          testCases: [
            {
              testCaseId: 'TC-001',
              scenario: 'S',
              preconditions: [],
              steps: [],
              expectedResults: [],
            },
          ],
        })
        .mockResolvedValueOnce({ category: 'UNKNOWN' });

      knowledgeExtractionService.generateSummary.mockResolvedValue({
        shortSummary: 'Summary',
        detailedSummary: 'Detailed',
        confidence: 80,
      });

      const result = await service.processDocument({
        documentId: 'DOC002',
        markdown: '# Mixed\nContent',
      });

      expect(result.totalChunks).toBe(3);
      expect(result.requirementChunks).toBe(1);
      expect(result.testCaseChunks).toBe(1);
      expect(result.unknownChunks).toBe(1);
    });

    it('should store results in MongoDB', async () => {
      sectionDiscoveryService.discoverSections.mockReturnValue([
        {
          sectionId: 'SEC_001',
          title: 'Section',
          content: 'Content',
          pageRange: { startPage: 1, endPage: 1 },
        },
      ]);

      semanticChunkingService.chunkSection.mockResolvedValue([
        { chunkNumber: 1, title: 'Chunk', content: 'Content' },
      ]);

      chunkClassificationService.classifyChunk.mockResolvedValue({
        chunkType: ChunkType.UNKNOWN,
        confidence: 70,
      });

      knowledgeExtractionService.extractKnowledge.mockResolvedValue({
        category: 'UNKNOWN',
      });

      knowledgeExtractionService.generateSummary.mockResolvedValue({
        shortSummary: 'S',
        detailedSummary: 'D',
        confidence: 70,
      });

      await service.processDocument({
        documentId: 'DOC003',
        markdown: '# Section\nContent',
      });

      expect(mockDocumentModel.findOneAndUpdate).toHaveBeenCalled();
      expect(mockChunkModel.deleteMany).toHaveBeenCalledWith({ documentId: 'DOC003' });
      expect(mockChunkModel.insertMany).toHaveBeenCalled();
    });
  });
});
