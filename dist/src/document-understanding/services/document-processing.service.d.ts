import { Model } from 'mongoose';
import { DocumentEntityDocument } from '../schemas/document.schema';
import { DocumentChunkDocument } from '../schemas/document-chunk.schema';
import { SectionDiscoveryService } from './section-discovery.service';
import { SemanticChunkingService } from './semantic-chunking.service';
import { ChunkClassificationService } from './chunk-classification.service';
import { KnowledgeExtractionService } from './knowledge-extraction.service';
import { S3DocumentService } from './s3-document.service';
import { DocumentParsingService } from './document-parsing.service';
import { ProcessDocumentDto, ProcessLocalDocumentDto, ProcessDocumentResponseDto } from '../dto';
export declare class DocumentProcessingService {
    private readonly documentModel;
    private readonly chunkModel;
    private readonly s3DocumentService;
    private readonly documentParsingService;
    private readonly sectionDiscoveryService;
    private readonly semanticChunkingService;
    private readonly chunkClassificationService;
    private readonly knowledgeExtractionService;
    private readonly logger;
    constructor(documentModel: Model<DocumentEntityDocument>, chunkModel: Model<DocumentChunkDocument>, s3DocumentService: S3DocumentService, documentParsingService: DocumentParsingService, sectionDiscoveryService: SectionDiscoveryService, semanticChunkingService: SemanticChunkingService, chunkClassificationService: ChunkClassificationService, knowledgeExtractionService: KnowledgeExtractionService);
    processDocument(dto: ProcessDocumentDto): Promise<ProcessDocumentResponseDto>;
    processLocalDocument(dto: ProcessLocalDocumentDto): Promise<ProcessDocumentResponseDto>;
    private storeResults;
    private buildResponse;
}
