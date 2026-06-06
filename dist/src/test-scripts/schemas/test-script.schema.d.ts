import { Document, HydratedDocument } from 'mongoose';
export type TestScriptDocument = HydratedDocument<TestScript>;
export declare enum TestScriptPriority {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
export declare enum TestScriptSourceTrack {
    REQUIREMENT = "REQUIREMENT",
    TEST_CASE = "TEST_CASE"
}
export declare class TestScript extends Document {
    testScriptId: string;
    documentId: string;
    chunkId: string;
    chunkTitle: string;
    sourceTrack: TestScriptSourceTrack;
    testCaseType: string;
    title: string;
    sourceRequirementId: string | null;
    sourceTestCaseId: string | null;
    preconditions: string[];
    steps: string[];
    expectedResults: string[];
    priority: TestScriptPriority;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TestScriptSchema: import("mongoose").Schema<TestScript, import("mongoose").Model<TestScript, any, any, any, Document<unknown, any, TestScript, any, {}> & TestScript & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TestScript, Document<unknown, {}, import("mongoose").FlatRecord<TestScript>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<TestScript> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
