import { Document, HydratedDocument } from 'mongoose';
export type DocumentEntityDocument = HydratedDocument<DocumentEntity>;
export declare class DocumentEntity extends Document {
    documentId: string;
    originalMarkdown: string;
    status: string;
    totalChunks: number;
    requirementChunks: number;
    testCaseChunks: number;
    unknownChunks: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DocumentSchema: import("mongoose").Schema<DocumentEntity, import("mongoose").Model<DocumentEntity, any, any, any, Document<unknown, any, DocumentEntity, any, {}> & DocumentEntity & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DocumentEntity, Document<unknown, {}, import("mongoose").FlatRecord<DocumentEntity>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<DocumentEntity> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
