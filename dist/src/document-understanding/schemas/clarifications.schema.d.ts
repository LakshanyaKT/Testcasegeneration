import { Document, HydratedDocument } from 'mongoose';
export type ClarificationsDocument = HydratedDocument<Clarifications>;
export declare class Clarifications extends Document {
    documentId: string;
    projectId: string;
    sessionId: string;
    questions: Array<{
        questionId: string;
        question: string;
        category: string;
        priority: string;
    }>;
    answers: Array<{
        questionId: string;
        answer: string;
    }>;
    status: string;
}
export declare const ClarificationsSchema: import("mongoose").Schema<Clarifications, import("mongoose").Model<Clarifications, any, any, any, Document<unknown, any, Clarifications, any, {}> & Clarifications & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Clarifications, Document<unknown, {}, import("mongoose").FlatRecord<Clarifications>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Clarifications> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
