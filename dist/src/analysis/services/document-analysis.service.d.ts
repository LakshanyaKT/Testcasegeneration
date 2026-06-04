import { Model } from 'mongoose';
import { DocumentChunkDocument } from '../../document-understanding/schemas/document-chunk.schema';
import { LLMService } from '../../document-understanding/services/llm.service';
import { DocumentAnalysisRepository } from '../repositories/document-analysis.repository';
import { AnalyzeDocumentResponseDto } from '../dto';
export declare class DocumentAnalysisService {
    private readonly chunkModel;
    private readonly llmService;
    private readonly analysisRepository;
    private readonly logger;
    constructor(chunkModel: Model<DocumentChunkDocument>, llmService: LLMService, analysisRepository: DocumentAnalysisRepository);
    analyzeDocument(documentId: string): Promise<AnalyzeDocumentResponseDto>;
    getAnalysis(documentId: string): Promise<AnalyzeDocumentResponseDto>;
    updateAnalysisWithClarification(documentId: string, clarificationQuestion: string, clarificationAnswer: string): Promise<AnalyzeDocumentResponseDto>;
    private aggregateChunks;
    private toResponseDto;
}
