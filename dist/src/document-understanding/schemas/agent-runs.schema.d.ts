import { Document, HydratedDocument } from 'mongoose';
export type AgentRunsDocument = HydratedDocument<AgentRuns>;
export declare class AgentRuns extends Document {
    projectId: string;
    sessionId: string;
    documentId: string;
    status: string;
    startedAt: Date;
    completedAt: Date;
    bedrockCalls: number;
    executionTime: number;
}
export declare const AgentRunsSchema: import("mongoose").Schema<AgentRuns, import("mongoose").Model<AgentRuns, any, any, any, Document<unknown, any, AgentRuns, any, {}> & AgentRuns & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AgentRuns, Document<unknown, {}, import("mongoose").FlatRecord<AgentRuns>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<AgentRuns> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
