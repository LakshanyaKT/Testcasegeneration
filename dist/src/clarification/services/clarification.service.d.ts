import { LLMService } from '../../document-understanding/services/llm.service';
import { DocumentAnalysisRepository } from '../../analysis/repositories/document-analysis.repository';
import { DocumentAnalysisService } from '../../analysis/services/document-analysis.service';
import { ClarificationRepository } from '../repositories/clarification.repository';
import { GenerateClarificationsResponseDto, GetClarificationsResponseDto, RespondClarificationResponseDto } from '../dto';
export declare class ClarificationService {
    private readonly llmService;
    private readonly analysisRepository;
    private readonly documentAnalysisService;
    private readonly clarificationRepository;
    private readonly logger;
    constructor(llmService: LLMService, analysisRepository: DocumentAnalysisRepository, documentAnalysisService: DocumentAnalysisService, clarificationRepository: ClarificationRepository);
    generateClarifications(documentId: string): Promise<GenerateClarificationsResponseDto>;
    getClarifications(documentId: string): Promise<GetClarificationsResponseDto>;
    respondToClarification(clarificationId: string, answer: string): Promise<RespondClarificationResponseDto>;
    private toResponseDto;
}
