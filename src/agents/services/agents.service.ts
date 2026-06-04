import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent, AgentDocument } from '../schemas/agent.schema';
import { CreateAgentDto } from '../dto/create-agent.dto';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  constructor(
    @InjectModel(Agent.name)
    private readonly agentModel: Model<AgentDocument>,
  ) {}

  async getAllAgents(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const filter: any = { active: true };

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

    // Compute stats
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

  async createAgent(dto: CreateAgentDto): Promise<any> {
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
}
