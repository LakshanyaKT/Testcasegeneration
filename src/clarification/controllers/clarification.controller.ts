import {
  Controller,
  Post,
  Get,
  Param,
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
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ClarificationService } from '../services/clarification.service';
import {
  RespondClarificationDto,
  GenerateClarificationsResponseDto,
  GetClarificationsResponseDto,
  RespondClarificationResponseDto,
  PrioritizeClarificationsResponseDto,
  GetPrioritizedClarificationsResponseDto,
} from '../dto';

@ApiTags('Clarifications')
@Controller('clarifications')
export class ClarificationController {
  private readonly logger = new Logger(ClarificationController.name);

  constructor(private readonly clarificationService: ClarificationService) {}

  @Post(':documentId/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate clarification questions',
    description: 'Reads missingInformation from document_understanding, calls Claude, stores all as PENDING.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({ status: 200, type: GenerateClarificationsResponseDto })
  @ApiResponse({ status: 404, description: 'Analysis not found' })
  async generateClarifications(
    @Param('documentId') documentId: string,
  ): Promise<GenerateClarificationsResponseDto> {
    return this.clarificationService.generateClarifications(documentId);
  }

  @Post(':documentId/prioritize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'AI-rank and select top-K clarification questions',
    description:
      'Claude scores ALL PENDING questions against document risk areas and workflow, ' +
      'selects the top-K most critical, tags them with priorityRank/priorityBatch/priorityReason. ' +
      'Default topK=3. Use GET /clarifications/:documentId/prioritized to retrieve them.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiQuery({ name: 'topK', required: false, example: 3, description: 'How many top questions to surface (default 3)' })
  @ApiResponse({ status: 200, type: PrioritizeClarificationsResponseDto })
  @ApiResponse({ status: 400, description: 'No PENDING questions found' })
  @ApiResponse({ status: 404, description: 'Analysis not found' })
  async prioritizeClarifications(
    @Param('documentId') documentId: string,
    @Query('topK') topK?: string,
  ): Promise<PrioritizeClarificationsResponseDto> {
    const k = topK ? parseInt(topK, 10) : 3;
    this.logger.log(`Prioritize clarifications for: ${documentId}, topK: ${k}`);
    return this.clarificationService.prioritizeClarifications(documentId, k);
  }

  @Get(':documentId/prioritized')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get top-priority clarification questions',
    description: 'Returns the most recent priority batch — the questions to present to the user.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({ status: 200, type: GetPrioritizedClarificationsResponseDto })
  @ApiResponse({ status: 404, description: 'No prioritized batch found — run prioritize first' })
  async getPrioritizedClarifications(
    @Param('documentId') documentId: string,
  ): Promise<GetPrioritizedClarificationsResponseDto> {
    return this.clarificationService.getPrioritizedClarifications(documentId);
  }

  @Get(':documentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all clarifications for a document',
    description: 'Returns all records across all statuses.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({ status: 200, type: GetClarificationsResponseDto })
  async getClarifications(
    @Param('documentId') documentId: string,
  ): Promise<GetClarificationsResponseDto> {
    return this.clarificationService.getClarifications(documentId);
  }

  @Post(':clarificationId/respond')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Answer a clarification question',
    description:
      'Saves answer (ANSWERED), re-runs Claude to update document_understanding, marks RESOLVED. Returns resolved clarification + updated analysis.',
  })
  @ApiParam({ name: 'clarificationId', example: 'CLR-DOC001-1717406400000-0' })
  @ApiBody({ type: RespondClarificationDto })
  @ApiResponse({ status: 200, type: RespondClarificationResponseDto })
  @ApiResponse({ status: 400, description: 'Already RESOLVED or REJECTED' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async respondToClarification(
    @Param('clarificationId') clarificationId: string,
    @Body() dto: RespondClarificationDto,
  ): Promise<RespondClarificationResponseDto> {
    this.logger.log(`Respond to clarification: ${clarificationId}`);
    return this.clarificationService.respondToClarification(clarificationId, dto.answer);
  }
}

@ApiTags('Clarifications')
@Controller('clarifications')
export class ClarificationController {
  private readonly logger = new Logger(ClarificationController.name);

  constructor(private readonly clarificationService: ClarificationService) {}

  @Post(':documentId/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate clarification questions for a document',
    description:
      'Reads the document understanding analysis, extracts missing information items, and uses Claude to generate targeted clarification questions. Questions are stored as PENDING in MongoDB.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({
    status: 200,
    description: 'Clarification questions generated and stored',
    type: GenerateClarificationsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No analysis found — run document analysis first',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async generateClarifications(
    @Param('documentId') documentId: string,
  ): Promise<GenerateClarificationsResponseDto> {
    this.logger.log(`Generating clarifications for document: ${documentId}`);
    return this.clarificationService.generateClarifications(documentId);
  }

  @Get(':documentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all clarifications for a document',
    description: 'Retrieves all clarification questions (PENDING, ANSWERED, RESOLVED, REJECTED) for the given document ID.',
  })
  @ApiParam({ name: 'documentId', example: 'DOC001' })
  @ApiResponse({
    status: 200,
    description: 'Clarifications retrieved successfully',
    type: GetClarificationsResponseDto,
  })
  async getClarifications(
    @Param('documentId') documentId: string,
  ): Promise<GetClarificationsResponseDto> {
    return this.clarificationService.getClarifications(documentId);
  }

  @Post(':clarificationId/respond')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Answer a clarification question',
    description:
      'Submits an answer to a clarification question. After saving the answer, re-runs Claude document understanding to update the analysis incorporating the new information. Marks the clarification as RESOLVED.',
  })
  @ApiParam({
    name: 'clarificationId',
    example: 'CLR-DOC001-1717406400000-0',
    description: 'The clarificationId field of the clarification record',
  })
  @ApiBody({ type: RespondClarificationDto })
  @ApiResponse({
    status: 200,
    description: 'Answer recorded and document analysis updated',
    type: RespondClarificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Clarification is already RESOLVED or REJECTED',
  })
  @ApiResponse({ status: 404, description: 'Clarification not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async respondToClarification(
    @Param('clarificationId') clarificationId: string,
    @Body() dto: RespondClarificationDto,
  ): Promise<RespondClarificationResponseDto> {
    this.logger.log(`Processing answer for clarification: ${clarificationId}`);
    return this.clarificationService.respondToClarification(
      clarificationId,
      dto.answer,
    );
  }
}
