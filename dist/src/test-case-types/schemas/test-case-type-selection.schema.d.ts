import { Document, HydratedDocument } from 'mongoose';
export type TestCaseTypeSelectionDocument = HydratedDocument<TestCaseTypeSelection>;
export declare enum TestCaseTypeSelectionStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED"
}
export interface SuggestedTestCaseType {
    type: string;
    reason: string;
}
export declare class TestCaseTypeSelection extends Document {
    documentId: string;
    detectedTypes: string[];
    suggestedTypes: SuggestedTestCaseType[];
    finalTypes: string[];
    status: TestCaseTypeSelectionStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TestCaseTypeSelectionSchema: import("mongoose").Schema<TestCaseTypeSelection, import("mongoose").Model<TestCaseTypeSelection, any, any, any, Document<unknown, any, TestCaseTypeSelection, any, {}> & TestCaseTypeSelection & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TestCaseTypeSelection, Document<unknown, {}, import("mongoose").FlatRecord<TestCaseTypeSelection>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<TestCaseTypeSelection> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
