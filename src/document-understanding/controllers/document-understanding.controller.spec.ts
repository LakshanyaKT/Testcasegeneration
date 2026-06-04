import { Test, TestingModule } from '@nestjs/testing';
import { DocumentUnderstandingController } from './document-understanding.controller';
import { DocumentProcessingService } from '../services/document-processing.service';
import { ProcessDocumentResponseDto } from '../dto/process-document-response.dto';

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
            processLocalDocument: jest.fn(),
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
    it('should process a document and return response with READY status', async () => {
      const mockResponse: ProcessDocumentResponseDto = {
        status: 'READY',
        documentId: 'DOC001',
        projectId: 'PRJ_001',
        sessionId: 'SES_101',
        analysis: {
          confidence: 90,
          completenessScore: 85,
          coverageScore: 90,
          documentType: 'FRS',
          summary: 'Auth module specs',
        },
        testCases: [
          {
            testCaseId: 'TC_AUTO_001',
            title: 'Verify credentials login',
            priority: 'HIGH',
            type: 'Positive',
            requirementIds: ['REQ_001'],
            preConditions: [],
            steps: ['Navigate to login page'],
            expectedResults: ['Login success'],
            testData: [],
          },
        ],
        coverage: {
          requirementsCovered: 1,
          requirementsTotal: 1,
          coveragePercentage: 100,
        },
        nextAction: 'Proceed to test execution',
      };

      processingService.processDocument.mockResolvedValue(mockResponse);

      const result = await controller.processDocument({
        projectId: 'PRJ_001',
        sessionId: 'SES_101',
        documentId: 'DOC001',
        s3Bucket: 'bucket',
        s3Key: 'key',
        markdown: '# Test\nContent',
      });

      expect(result.status).toBe('READY');
      expect(result.testCases!.length).toBe(1);
      expect(processingService.processDocument).toHaveBeenCalledWith({
        projectId: 'PRJ_001',
        sessionId: 'SES_101',
        documentId: 'DOC001',
        s3Bucket: 'bucket',
        s3Key: 'key',
        markdown: '# Test\nContent',
      });
    });
  });
});
