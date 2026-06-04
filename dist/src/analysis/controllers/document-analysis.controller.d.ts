import { DocumentAnalysisService } from '../services/document-analysis.service';
import { AnalyzeDocumentResponseDto } from '../dto';
export declare class DocumentAnalysisController {
    private readonly documentAnalysisService;
    private readonly logger;
    constructor(documentAnalysisService: DocumentAnalysisService);
    analyzeDocument(documentId: string): Promise<AnalyzeDocumentResponseDto>;
    getAnalysis(documentId: string): Promise<AnalyzeDocumentResponseDto>;
}
