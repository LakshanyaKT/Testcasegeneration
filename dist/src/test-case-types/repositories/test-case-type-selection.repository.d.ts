import { Model } from 'mongoose';
import { TestCaseTypeSelectionDocument, SuggestedTestCaseType } from '../schemas/test-case-type-selection.schema';
export declare class TestCaseTypeSelectionRepository {
    private readonly model;
    private readonly logger;
    constructor(model: Model<TestCaseTypeSelectionDocument>);
    upsertDiscovery(documentId: string, detectedTypes: string[], suggestedTypes: SuggestedTestCaseType[]): Promise<TestCaseTypeSelectionDocument>;
    approve(documentId: string, finalTypes: string[]): Promise<TestCaseTypeSelectionDocument | null>;
    findByDocumentId(documentId: string): Promise<TestCaseTypeSelectionDocument | null>;
}
