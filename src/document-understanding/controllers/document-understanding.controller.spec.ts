import { Test, TestingModule } from '@nestjs/testing';
import { DocumentUnderstandingController } from './document-understanding.controller';
import { DocumentProcessingService } from '../services/document-processing.service';
import { ChunkType } from '../interfaces';

describe('DocumentUnderstandingController', () => {
  let controller: DocumentUnderstandingController;
  let processingService: jest.Mocked<DocumentProcessingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentUnderstandingController],
      providers: [
        {
          provide: DocumentProcessingService,
          useValue: {
            processDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentUnderstandingController>(
      DocumentUnderstandingController,
    );
    processingService = module.get(DocumentProcessingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /documents/process', () => {
    it('should process a document and return response', async () => {
      const mockResponse = {
        totalChunks: 3,
        requirementChunks: 1,
        testCaseChunks: 1,
        unknownChunks: 1,
        chunks: [
          {
            _id: 'id1',
            documentId: 'DOC001',
            chunkNumber: 1,
            chunkType: ChunkType.REQUIREMENT,
            title: 'Auth Requirement',
            pageRange: { startPage: 1, endPage: 1 },
            content: 'System shall...',
            summary: {
              shortSummary: 'Auth',
              detailedSummary: 'Authentication requirement',
              confidence: 90,
            },
            classification: { confidence: 95 },
            extractedData: {
              requirements: [
                {
                  requirementId: 'REQ-001',
                  title: 'Auth',
                  description: 'System shall...',
                },
              ],
            },
            processing: {
              chunkingStrategy: 'AI_SEMANTIC' as const,
              summaryGenerated: true,
              extractionCompleted: true,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      processingService.processDocument.mockResolvedValue(mockResponse);

      const result = await controller.processDocument({
        documentId: 'DOC001',
        markdown: '# Test\nContent',
      });

      expect(result.totalChunks).toBe(3);
      expect(result.requirementChunks).toBe(1);
      expect(processingService.processDocument).toHaveBeenCalledWith({
        documentId: 'DOC001',
        markdown: '# Test\nContent',
      });
    });
  });
});
