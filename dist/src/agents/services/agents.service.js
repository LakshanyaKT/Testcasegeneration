"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AgentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const agent_schema_1 = require("../schemas/agent.schema");
let AgentsService = AgentsService_1 = class AgentsService {
    constructor(agentModel) {
        this.agentModel = agentModel;
        this.logger = new common_1.Logger(AgentsService_1.name);
    }
    async getAllAgents(query) {
        const { page = 1, limit = 10, status, search } = query;
        const skip = (page - 1) * limit;
        const filter = { active: true };
        if (status && status !== 'all') {
            filter['about.status'] = status.toUpperCase();
        }
        if (search) {
            filter.$or = [
                { 'about.display_name': { $regex: search, $options: 'i' } },
                { 'about.module': { $regex: search, $options: 'i' } },
                { 'document.document_name': { $regex: search, $options: 'i' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.agentModel
                .find(filter)
                .sort({ 'about.created_on': -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            this.agentModel.countDocuments(filter).exec(),
        ]);
        const [activeAgents, draftAgents, pendingReview] = await Promise.all([
            this.agentModel.countDocuments({ active: true, 'about.status': 'ACTIVE' }).exec(),
            this.agentModel.countDocuments({ active: true, 'about.status': 'DRAFT' }).exec(),
            this.agentModel.countDocuments({ active: true, 'about.status': 'PENDING_REVIEW' }).exec(),
        ]);
        return {
            total,
            page,
            limit,
            stats: {
                totalAgents: total,
                activeAgents,
                draftAgents,
                pendingReview,
            },
            data,
        };
    }
    async createAgent(dto) {
        this.logger.log(`Creating new agent: ${dto.display_name}`);
        const agentKey = `${dto.module}_${dto.display_name.replace(/\s+/g, '_').toUpperCase()}`;
        const documentId = `DOC_${Date.now()}`;
        const agent = await this.agentModel.create({
            about: {
                agent_key: agentKey,
                display_name: dto.display_name,
                module: dto.module,
                mode: 'FRS_DRIVEN',
                status: 'DRAFT',
                review_status: 'DRAFT',
                created_by: dto.created_by,
                created_on: new Date(),
                started_on: null,
                completed_on: null,
            },
            document: {
                document_id: documentId,
                document_name: dto.document_name,
                document_type: dto.document_type || 'FRS',
            },
            metrics: {
                total_chunks: 0,
                requirement_chunks: 0,
                testcase_chunks: 0,
                generated_testcases: 0,
                clarifications: 0,
            },
            progress: {
                percentage: 0,
                current_phase: 'NOT_STARTED',
            },
            output: {
                document_understanding_id: '',
                generated_script_count: 0,
            },
            active: true,
        });
        this.logger.log(`Agent created: ${agent._id} (documentId: ${documentId})`);
        return agent.toObject();
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = AgentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(agent_schema_1.Agent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AgentsService);
//# sourceMappingURL=agents.service.js.map