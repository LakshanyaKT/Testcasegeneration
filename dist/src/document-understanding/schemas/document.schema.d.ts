import { Document, HydratedDocument } from 'mongoose';
export type DocumentEntityDocument = HydratedDocument<DocumentEntity>;
export declare class DocumentEntity extends Document {
    projectId: string;
    sessionId: string;
    fileName: string;
    fileType: string;
    rawText: string;
    uploadedBy: string;
    uploadedAt: Date;
    status: string;
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
