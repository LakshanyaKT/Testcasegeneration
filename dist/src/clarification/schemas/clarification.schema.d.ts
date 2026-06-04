import { Document, HydratedDocument } from 'mongoose';
export type ClarificationDocument = HydratedDocument<Clarification>;
export declare enum ClarificationStatus {
    PENDING = "PENDING",
    ANSWERED = "ANSWERED",
    RESOLVED = "RESOLVED",
    REJECTED = "REJECTED"
}
export declare class Clarification extends Document {
    clarificationId: string;
    documentId: string;
    question: string;
    reason: string;
    answer: string | null;
    status: ClarificationStatus;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ClarificationSchema: import("mongoose").Schema<Clarification, import("mongoose").Model<Clarification, any, any, any, Document<unknown, any, Clarification, any, {}> & Clarification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Clarification, Document<unknown, {}, import("mongoose").FlatRecord<Clarification>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Clarification> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
