import { Document, HydratedDocument } from 'mongoose';
export type AgentDocument = HydratedDocument<Agent>;
export declare class Agent extends Document {
    about: {
        agent_key: string;
        display_name: string;
        module: string;
        mode: string;
        status: string;
        review_status: string;
        created_by: string;
        created_on: Date;
        started_on: Date | null;
        completed_on: Date | null;
    };
    document: {
        document_id: string;
        document_name: string;
        document_type: string;
    };
    metrics: {
        total_chunks: number;
        requirement_chunks: number;
        testcase_chunks: number;
        generated_testcases: number;
        clarifications: number;
    };
    progress: {
        percentage: number;
        current_phase: string;
    };
    output: {
        document_understanding_id: string;
        generated_script_count: number;
    };
    active: boolean;
}
export declare const AgentSchema: import("mongoose").Schema<Agent, import("mongoose").Model<Agent, any, any, any, Document<unknown, any, Agent, any, {}> & Agent & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Agent, Document<unknown, {}, import("mongoose").FlatRecord<Agent>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Agent> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
