import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FrsS3Service } from '../services/frs-s3.service';
import {
  UploadFrsDocumentResponseDto,
  GetFrsDocumentUrlResponseDto,
} from '../dto';

@ApiTags('FRS Document Upload')
@Controller('frs-upload')
export class FrsUploadController {
  private readonly logger = new Logger(FrsUploadController.name);

  constructor(private readonly frsS3Service: FrsS3Service) {}

  // ---------------------------------------------------------------------------
  // POST /frs-upload/:documentId
  // Upload an FRS document into the S3 bucket
  // ---------------------------------------------------------------------------

  @Post(':documentId')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload an FRS document to S3',
    description:
      'Accepts a PDF, DOCX, Markdown, or TXT file via multipart form upload. ' +
      'Validates file type and size, stores the file in the configured S3 bucket under ' +
      'frs-documents/<documentId>/<fileName>, and returns the S3 key and a pre-signed URL ' +
      'valid for 1 hour. The returned s3Key and s3Bucket are the values to pass into the ' +
      'document parsing pipeline (POST /documents/process).',
  })
  @ApiParam({
    name: 'documentId',
    description: 'Unique identifier for this document. Used as the S3 path prefix.',
    example: 'DOC001',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The FRS document file (PDF, DOCX, .md, .txt). Max 200 MB.',
        },
        s3KeyOverride: {
          type: 'string',
          description: 'Optional custom S3 key. Defaults to frs-documents/<documentId>/<fileName>.',
          example: 'frs-documents/DOC001/Sales_Order_FRS.pdf',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully. Returns S3 location and pre-signed URL.',
    type: UploadFrsDocumentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'No file provided, file is empty, or file exceeds size limit.',
  })
  @ApiResponse({
    status: 415,
    description: 'Unsupported file type. Only PDF, DOCX, MD, TXT are accepted.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error or S3 failure.' })
  async uploadFrsDocument(
    @Param('documentId') documentId: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('s3KeyOverride') s3KeyOverride?: string,
  ): Promise<UploadFrsDocumentResponseDto> {
    if (!file) {
      throw new BadRequestException(
        'No file provided. Send the document as multipart/form-data with field name "file".',
      );
    }

    this.logger.log(
      `Upload request — documentId: ${documentId}, ` +
        `file: ${file.originalname} (${file.size} bytes, ${file.mimetype})`,
    );

    const result = await this.frsS3Service.uploadFrsDocument(
      documentId,
      file.originalname,
      file.mimetype,
      file.buffer,
      s3KeyOverride,
    );

    return result;
  }

  // ---------------------------------------------------------------------------
  // GET /frs-upload/:documentId/url?s3Key=...
  // Fetch a pre-signed URL for an already-uploaded FRS document
  // ---------------------------------------------------------------------------

  @Get(':documentId/url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a pre-signed URL for an uploaded FRS document',
    description:
      'Looks up the FRS document in S3 using the provided s3Key, verifies it exists, ' +
      'and returns a pre-signed GET URL valid for 1 hour. ' +
      'This URL can be passed directly into the document parsing pipeline ' +
      '(POST /documents/process) as the document source. ' +
      'Also returns the s3Bucket and s3Key needed for the parsing API.',
  })
  @ApiParam({
    name: 'documentId',
    description: 'The document ID this S3 object belongs to.',
    example: 'DOC001',
  })
  @ApiQuery({
    name: 's3Key',
    description:
      'The S3 object key of the uploaded document. ' +
      'Obtained from the upload response (s3Key field).',
    example: 'frs-documents/DOC001/Sales_Order_FRS.pdf',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Pre-signed URL generated. Use s3PreSignedUrl, s3Bucket, and s3Key to call the parsing pipeline.',
    type: GetFrsDocumentUrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Missing or invalid s3Key query parameter.',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found in S3. Upload the document first via POST /frs-upload/:documentId.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error or S3 failure.' })
  async getFrsDocumentUrl(
    @Param('documentId') documentId: string,
    @Query('s3Key') s3Key: string,
  ): Promise<GetFrsDocumentUrlResponseDto> {
    if (!s3Key || s3Key.trim().length === 0) {
      throw new BadRequestException(
        'Query parameter "s3Key" is required. ' +
        'Use the s3Key value returned from POST /frs-upload/:documentId.',
      );
    }

    this.logger.log(
      `URL fetch request — documentId: ${documentId}, s3Key: ${s3Key}`,
    );

    return this.frsS3Service.getFrsDocumentUrl(documentId, s3Key.trim());
  }
}
