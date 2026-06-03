import { DocumentProcessingService } from '../services/document-processing.service';
import { ProcessDocumentDto } from '../dto/process-document.dto';
import { ProcessLocalDocumentDto } from '../dto/process-local-document.dto';
import { ProcessDocumentResponseDto } from '../dto/process-document-response.dto';
export declare class DocumentUnderstandingController {
    private readonly documentProcessingService;
    private readonly logger;
    constructor(documentProcessingService: DocumentProcessingService);
    processDocument(dto: ProcessDocumentDto): Promise<ProcessDocumentResponseDto>;
    processLocalDocument(dto: ProcessLocalDocumentDto): Promise<ProcessDocumentResponseDto>;
}
