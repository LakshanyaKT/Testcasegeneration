import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DocumentProcessingService } from './document-processing.service';
import { S3DocumentService } from './s3-document.service';
import { DocumentParsingService } from './document-parsing.service';
import { LLMService } from './llm.service';

import { DocumentEntity } from '../schemas/document.schema';
import { DocumentUnderstanding } from '../schemas/document-understanding.schema';
import { ProjectKnowledge } from '../schemas/project-knowledge.schema';
import { Clarifications } from '../schemas/clarifications.schema';
import { TestCases } from '../schemas/test-cases.schema';
import { AgentRuns } from '../schemas/agent-runs.schema';

describe('DocumentProcessingService', () => {
  let service: DocumentProcessingService;
  let llmService: jest.Mocked<LLMService>;
  let s3DocumentService: jest.Mocked<S3DocumentService>;
  let documentParsingService: jest.Mocked<DocumentParsingService>;

  const createMockModel = () => ({
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
  });

  let documentModel: ReturnType<typeof createMockModel>;
  let documentUnderstandingModel: ReturnType<typeof createMockModel>;
  let projectKnowledgeModel: ReturnType<typeof createMockModel>;
  let clarificationsModel: ReturnType<typeof createMockModel>;
  let testCasesModel: ReturnType<typeof createMockModel>;
  let agentRunsModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    documentModel = createMockModel();
    documentUnderstandingModel = createMockModel();
    projectKnowledgeModel = createMockModel();
    clarificationsModel = createMockModel();
    testCasesModel = createMockModel();
    agentRunsModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentProcessingService,
        {
          provide: getModelToken(DocumentEntity.name),
          useValue: documentModel,
        },
        {
          provide: getModelToken(DocumentUnderstanding.name),
          useValue: documentUnderstandingModel,
        },
        {
          provide: getModelToken(ProjectKnowledge.name),
          useValue: projectKnowledgeModel,
        },
        {
          provide: getModelToken(Clarifications.name),
          useValue: clarificationsModel,
        },
        {
          provide: getModelToken(TestCases.name),
          useValue: testCasesModel,
        },
        {
          provide: getModelToken(AgentRuns.name),
          useValue: agentRunsModel,
        },
        {
          provide: S3DocumentService,
          useValue: {
            downloadDocumentBuffer: jest.fn().mockResolvedValue(Buffer.from('doc')),
          },
        },
        {
          provide: DocumentParsingService,
          useValue: {
            parseToMarkdown: jest.fn().mockResolvedValue('parsed-markdown'),
          },
        },
        {
          provide: LLMService,
          useValue: {
            generateStructuredResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentProcessingService>(DocumentProcessingService);
    llmService = module.get(LLMService);
    s3DocumentService = module.get(S3DocumentService);
    documentParsingService = module.get(DocumentParsingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processDocument with READY status', () => {
    it('should run Decision Engine, update project knowledge and save test cases', async () => {
      // Mock existing project knowledge
      projectKnowledgeModel.findOne.mockResolvedValue({
        projectId: 'PRJ_001',
        entities: [],
        businessRules: [],
        validations: [],
        processFlows: [],
        workflows: [],
        testPatterns: [],
        domainKnowledge: [],
        reusableScenarios: [],
      });

      // Mock LLM response with no questions (READY status)
      llmService.generateStructuredResponse.mockResolvedValue({
        status: 'READY',
        analysis: {
          confidence: 90,
          completenessScore: 85,
          coverageScore: 90,
          documentType: 'FRS',
          summary: 'Summary description',
        },
        knowledgeBase: {
          projectKnowledge: {
            entities: [{ name: 'User', description: 'Represents a user', attributes: ['id', 'email'] }],
            businessRules: [],
            validations: [],
            processFlows: [],
            workflows: [],
            testPatterns: [],
            domainKnowledge: [],
          },
          sessionKnowledge: {
            requirements: [],
            entities: [],
            businessRules: [],
            validations: [],
            processFlows: [],
            workflows: [],
          },
        },
        requirements: [
          {
            requirementId: 'REQ-001',
            module: 'Auth',
            title: 'User Login',
            description: 'User must login',
            priority: 'HIGH',
            category: 'Functional',
          },
        ],
        entities: [],
        businessRules: [],
        validations: [],
        processFlows: [],
        workflows: [],
        missingInformation: [],
        questions: [], // Zero questions
        testCases: [
          {
            testCaseId: 'TC-001',
            title: 'Login positive scenario',
            priority: 'HIGH',
            type: 'Positive',
            requirementIds: ['REQ-001'],
            preConditions: [],
            steps: ['Step 1'],
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
      });

      const result = await service.processDocument({
        projectId: 'PRJ_001',
        sessionId: 'SES_001',
        documentId: 'DOC_001',
        s3Bucket: 'bucket',
        s3Key: 'key',
      });

      expect(result.status).toBe('READY');
      expect(result.testCases!.length).toBe(1);
      expect(result.questions).toBeUndefined(); // Filtered/omitted or empty in READY
      
      expect(documentModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(documentUnderstandingModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(testCasesModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(projectKnowledgeModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(agentRunsModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('processDocument with NEEDS_CLARIFICATION status', () => {
    it('should run Decision Engine, save clarifications and return questions', async () => {
      // Mock existing project knowledge
      projectKnowledgeModel.findOne.mockResolvedValue(null); // create a default project knowledge entry

      // Mock LLM response with questions (NEEDS_CLARIFICATION status)
      llmService.generateStructuredResponse.mockResolvedValue({
        status: 'NEEDS_CLARIFICATION',
        analysis: {
          confidence: 70,
          completenessScore: 50,
          coverageScore: 30,
          documentType: 'FRS',
          summary: 'Summary with gaps',
        },
        requirements: [],
        entities: [],
        businessRules: [],
        validations: [],
        processFlows: [],
        workflows: [],
        missingInformation: [
          {
            id: 'GAP-001',
            category: 'Auth',
            description: 'Authentication server address is missing',
            severity: 'HIGH',
          },
        ],
        questions: [
          {
            questionId: 'Q-001',
            question: 'What is the authentication server URL?',
            category: 'Auth',
            priority: 'HIGH',
          },
        ],
        testCases: [],
        coverage: {
          requirementsCovered: 0,
          requirementsTotal: 0,
          coveragePercentage: 0,
        },
        nextAction: 'Await clarifications',
      });

      const result = await service.processDocument({
        projectId: 'PRJ_002',
        sessionId: 'SES_002',
        documentId: 'DOC_002',
        s3Bucket: 'bucket',
        s3Key: 'key',
      });

      expect(result.status).toBe('NEEDS_CLARIFICATION');
      expect(result.questions!.length).toBe(1);
      expect(result.testCases).toBeUndefined(); // Omitted in response dto for NEEDS_CLARIFICATION
      
      expect(projectKnowledgeModel.create).toHaveBeenCalledTimes(1);
      expect(documentModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(documentUnderstandingModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(clarificationsModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(agentRunsModel.create).toHaveBeenCalledTimes(1);
    });
  });
});
