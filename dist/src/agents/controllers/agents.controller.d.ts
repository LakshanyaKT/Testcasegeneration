import { AgentsService } from '../services/agents.service';
import { CreateAgentDto } from '../dto/create-agent.dto';
export declare class AgentsController {
    private readonly agentsService;
    private readonly logger;
    constructor(agentsService: AgentsService);
    getAllAgents(page?: number, limit?: number, status?: string, search?: string): Promise<{
        total: number;
        page: number;
        limit: number;
        stats: {
            totalAgents: number;
            activeAgents: number;
            draftAgents: number;
            pendingReview: number;
        };
        data: (import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/agent.schema").Agent, {}, {}> & import("../schemas/agent.schema").Agent & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    createAgent(dto: CreateAgentDto): Promise<any>;
}
