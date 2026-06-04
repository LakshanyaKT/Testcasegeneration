import {
  Controller,
  Post,
  Get,
  Param,
  Body,
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
} from '@nestjs/swagger';
import { ClarificationService } from '../services/clarification.service';
import {
  RespondClarificationDto,
  GenerateClarificationsResponseDto,
  GetClarificationsResponseDto,
  RespondClarificationResponseDto,
} from '../dto';

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
