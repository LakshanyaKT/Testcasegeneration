import { TestScriptGenerationService } from '../services/test-script-generation.service';
import { GenerateTestScriptsResponseDto, GetTestScriptsResponseDto, TestScriptsSummaryDto } from '../dto';
export declare class TestScriptsController {
    private readonly generationService;
    private readonly logger;
    constructor(generationService: TestScriptGenerationService);
    generateTestScripts(documentId: string): Promise<GenerateTestScriptsResponseDto>;
    getTestScripts(documentId: string): Promise<GetTestScriptsResponseDto>;
    getTestScriptsSummary(documentId: string): Promise<TestScriptsSummaryDto>;
}
