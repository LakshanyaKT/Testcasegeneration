import { TestCaseTypeSelectionStatus } from '../schemas/test-case-type-selection.schema';
export declare class SuggestedTypeDto {
    type: string;
    reason: string;
}
export declare class TestCaseTypeSelectionResponseDto {
    documentId: string;
    detectedTypes: string[];
    suggestedTypes: SuggestedTypeDto[];
    finalTypes: string[];
    status: TestCaseTypeSelectionStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ApproveTestCaseTypesDto {
    approvedTypes: string[];
}
