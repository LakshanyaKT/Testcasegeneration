import { Document, HydratedDocument } from 'mongoose';
export type DocumentAnalysisDocument = HydratedDocument<DocumentAnalysis>;
export declare class DocumentAnalysis extends Document {
    documentId: string;
    overallSummary: string;
    identifiedModules: string[];
    dependencies: string[];
    riskAreas: string[];
    missingInformation: string[];
    workflow: string[];
    metadata: {
        totalChunksAnalyzed: number;
        requirementChunks: number;
        testCaseChunks: number;
        processingVersion: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const DocumentAnalysisSchema: import("mongoose").Schema<DocumentAnalysis, import("mongoose").Model<DocumentAnalysis, any, any, any, Document<unknown, any, DocumentAnalysis, any, {}> & DocumentAnalysis & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DocumentAnalysis, Document<unknown, {}, import("mongoose").FlatRecord<DocumentAnalysis>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<DocumentAnalysis> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
