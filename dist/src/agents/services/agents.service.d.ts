import { Model } from 'mongoose';
import { Agent, AgentDocument } from '../schemas/agent.schema';
import { CreateAgentDto } from '../dto/create-agent.dto';
export declare class AgentsService {
    private readonly agentModel;
    private readonly logger;
    constructor(agentModel: Model<AgentDocument>);
    getAllAgents(query: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }): Promise<{
        total: number;
        page: number;
        limit: number;
        stats: {
            totalAgents: number;
            activeAgents: number;
            draftAgents: number;
            pendingReview: number;
        };
        data: (import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Agent, {}, {}> & Agent & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    createAgent(dto: CreateAgentDto): Promise<any>;
}
