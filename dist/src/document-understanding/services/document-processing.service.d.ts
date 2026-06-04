import { Model } from 'mongoose';
import { DocumentEntity } from '../schemas/document.schema';
import { DocumentUnderstanding } from '../schemas/document-understanding.schema';
import { ProjectKnowledge } from '../schemas/project-knowledge.schema';
import { Clarifications } from '../schemas/clarifications.schema';
import { TestCases } from '../schemas/test-cases.schema';
import { AgentRuns } from '../schemas/agent-runs.schema';
import { LLMService } from './llm.service';
import { S3DocumentService } from './s3-document.service';
import { DocumentParsingService } from './document-parsing.service';
import { ProcessDocumentDto, ProcessLocalDocumentDto, ProcessDocumentResponseDto } from '../dto';
export declare class DocumentProcessingService {
    private readonly documentModel;
    private readonly documentUnderstandingModel;
    private readonly projectKnowledgeModel;
    private readonly clarificationsModel;
    private readonly testCasesModel;
    private readonly agentRunsModel;
    private readonly s3DocumentService;
    private readonly documentParsingService;
    private readonly llmService;
    private readonly logger;
    constructor(documentModel: Model<DocumentEntity>, documentUnderstandingModel: Model<DocumentUnderstanding>, projectKnowledgeModel: Model<ProjectKnowledge>, clarificationsModel: Model<Clarifications>, testCasesModel: Model<TestCases>, agentRunsModel: Model<AgentRuns>, s3DocumentService: S3DocumentService, documentParsingService: DocumentParsingService, llmService: LLMService);
    processDocument(dto: ProcessDocumentDto): Promise<ProcessDocumentResponseDto>;
    processLocalDocument(dto: ProcessLocalDocumentDto): Promise<ProcessDocumentResponseDto>;
}
