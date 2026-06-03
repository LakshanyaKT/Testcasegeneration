import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DocumentProcessingService } from '../services/document-processing.service';
import { ProcessDocumentDto } from '../dto/process-document.dto';
import { ProcessLocalDocumentDto } from '../dto/process-local-document.dto';
import { ProcessDocumentResponseDto } from '../dto/process-document-response.dto';

@ApiTags('Documents')
@Controller('documents')
export class DocumentUnderstandingController {
  private readonly logger = new Logger(DocumentUnderstandingController.name);

  constructor(
    private readonly documentProcessingService: DocumentProcessingService,
  ) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Process a document from S3',
    description:
      'Downloads a markdown document from S3, performs AI-based semantic chunking, classifies each chunk as REQUIREMENT, TEST_CASE, or UNKNOWN, extracts structured knowledge, and stores results in MongoDB.',
  })
  @ApiBody({ type: ProcessDocumentDto })
  @ApiResponse({
    status: 200,
    description: 'Document processed successfully',
    type: ProcessDocumentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or failed to download document from S3',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during processing',
  })
  async processDocument(
    @Body() dto: ProcessDocumentDto,
  ): Promise<ProcessDocumentResponseDto> {
    this.logger.log(
      `Received document processing request: ${dto.documentId} (s3://${dto.s3Bucket}/${dto.s3Key})`,
    );
    return this.documentProcessingService.processDocument(dto);
  }

  @Post('process-local')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Process a local document (test workflow)',
    description:
      'Reads a markdown document from the local filesystem and runs the full processing pipeline: semantic chunking, classification, knowledge extraction, and MongoDB storage.',
  })
  @ApiBody({ type: ProcessLocalDocumentDto })
  @ApiResponse({
    status: 200,
    description: 'Document processed successfully',
    type: ProcessDocumentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or file not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during processing',
  })
  async processLocalDocument(
    @Body() dto: ProcessLocalDocumentDto,
  ): Promise<ProcessDocumentResponseDto> {
    this.logger.log(
      `Received local document processing request: ${dto.documentId} (${dto.filePath})`,
    );
    return this.documentProcessingService.processLocalDocument(dto);
  }
}
