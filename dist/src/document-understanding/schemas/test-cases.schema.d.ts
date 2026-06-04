import { Document, HydratedDocument } from 'mongoose';
export type TestCasesDocument = HydratedDocument<TestCases>;
export declare class TestCases extends Document {
    documentId: string;
    projectId: string;
    sessionId: string;
    testCases: Array<{
        testCaseId: string;
        title: string;
        priority: string;
        type: string;
        requirementIds: string[];
        preConditions: string[];
        steps: string[];
        expectedResults: string[];
        testData: any[];
    }>;
    coverage: {
        requirementsCovered: number;
        requirementsTotal: number;
        coveragePercentage: number;
    };
}
export declare const TestCasesSchema: import("mongoose").Schema<TestCases, import("mongoose").Model<TestCases, any, any, any, Document<unknown, any, TestCases, any, {}> & TestCases & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TestCases, Document<unknown, {}, import("mongoose").FlatRecord<TestCases>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<TestCases> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
