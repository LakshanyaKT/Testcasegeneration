import { Model } from 'mongoose';
import { DocumentChunkDocument } from '../../document-understanding/schemas/document-chunk.schema';
import { LLMService } from '../../document-understanding/services/llm.service';
import { DocumentAnalysisRepository } from '../../analysis/repositories/document-analysis.repository';
import { ClarificationRepository } from '../../clarification/repositories/clarification.repository';
import { TestCaseTypeSelectionRepository } from '../repositories/test-case-type-selection.repository';
import { TestCaseTypeSelectionResponseDto } from '../dto';
export declare class TestCaseTypeDiscoveryService {
    private readonly chunkModel;
    private readonly llmService;
    private readonly analysisRepository;
    private readonly clarificationRepository;
    private readonly selectionRepository;
    private readonly logger;
    constructor(chunkModel: Model<DocumentChunkDocument>, llmService: LLMService, analysisRepository: DocumentAnalysisRepository, clarificationRepository: ClarificationRepository, selectionRepository: TestCaseTypeSelectionRepository);
    discoverTestCaseTypes(documentId: string): Promise<TestCaseTypeSelectionResponseDto>;
    getTypeSelection(documentId: string): Promise<TestCaseTypeSelectionResponseDto>;
    approveTypes(documentId: string, approvedTypes: string[]): Promise<TestCaseTypeSelectionResponseDto>;
    private buildSample;
    private toResponseDto;
}
