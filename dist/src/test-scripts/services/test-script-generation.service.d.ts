import { Model } from 'mongoose';
import { DocumentChunkDocument } from '../../document-understanding/schemas/document-chunk.schema';
import { LLMService } from '../../document-understanding/services/llm.service';
import { ClarificationRepository } from '../../clarification/repositories/clarification.repository';
import { TestCaseTypeSelectionRepository } from '../../test-case-types/repositories/test-case-type-selection.repository';
import { TestScriptRepository } from '../repositories/test-script.repository';
import { GenerateTestScriptsResponseDto, GetTestScriptsResponseDto, TestScriptsSummaryDto } from '../dto';
export declare class TestScriptGenerationService {
    private readonly chunkModel;
    private readonly llmService;
    private readonly clarificationRepository;
    private readonly typeSelectionRepository;
    private readonly testScriptRepository;
    private readonly logger;
    constructor(chunkModel: Model<DocumentChunkDocument>, llmService: LLMService, clarificationRepository: ClarificationRepository, typeSelectionRepository: TestCaseTypeSelectionRepository, testScriptRepository: TestScriptRepository);
    generateTestScripts(documentId: string): Promise<GenerateTestScriptsResponseDto>;
    getTestScripts(documentId: string): Promise<GetTestScriptsResponseDto>;
    getTestScriptsSummary(documentId: string): Promise<TestScriptsSummaryDto>;
    private toResponseDto;
}
