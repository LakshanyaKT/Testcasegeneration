import { TestCaseTypeDiscoveryService } from '../services/test-case-type-discovery.service';
import { TestCaseTypeSelectionResponseDto, ApproveTestCaseTypesDto } from '../dto';
export declare class TestCaseTypesController {
    private readonly discoveryService;
    private readonly logger;
    constructor(discoveryService: TestCaseTypeDiscoveryService);
    discoverTestCaseTypes(documentId: string): Promise<TestCaseTypeSelectionResponseDto>;
    getTypeSelection(documentId: string): Promise<TestCaseTypeSelectionResponseDto>;
    approveTypes(documentId: string, dto: ApproveTestCaseTypesDto): Promise<TestCaseTypeSelectionResponseDto>;
}
