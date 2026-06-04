import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AgentsService } from '../services/agents.service';
import { CreateAgentDto } from '../dto/create-agent.dto';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  private readonly logger = new Logger(AgentsController.name);

  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all agents',
    description:
      'Returns paginated list of agents with stats. Supports filtering by status and search.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: ['all', 'active', 'draft', 'pending_review'] })
  @ApiQuery({ name: 'search', required: false, example: 'invoice' })
  @ApiResponse({ status: 200, description: 'Agents retrieved successfully' })
  async getAllAgents(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    this.logger.log(`GET /agents (page=${page}, status=${status}, search=${search})`);
    return this.agentsService.getAllAgents({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      status,
      search,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new agent',
    description:
      'Creates a new agent record in DRAFT status linked to an FRS document.',
  })
  @ApiBody({ type: CreateAgentDto })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  async createAgent(@Body() dto: CreateAgentDto) {
    this.logger.log(`POST /agents — creating: ${dto.display_name}`);
    return this.agentsService.createAgent(dto);
  }
}
