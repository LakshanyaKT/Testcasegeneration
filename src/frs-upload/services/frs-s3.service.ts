import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export interface FrsUploadResult {
  documentId: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  s3Bucket: string;
  s3Key: string;
  s3PreSignedUrl: string;
  uploadedAt: string;
}

export interface FrsDocumentUrlResult {
  documentId: string;
  originalFileName: string;
  s3Bucket: string;
  s3Key: string;
  s3PreSignedUrl: string;
  expiresInSeconds: number;
  uploadedAt: string;
}

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/markdown',
  'text/plain',
  'text/x-markdown',
]);

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.md', '.markdown', '.txt']);

const PRESIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour

@Injectable()
export class FrsS3Service {
  private readonly logger = new Logger(FrsS3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly maxFileSizeBytes: number;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.bucket = process.env.FRS_S3_BUCKET || 'mvp-frs-documents';
    this.maxFileSizeBytes = parseInt(
      process.env.MAX_DOCUMENT_BYTES || '209715200', // 200 MB default
      10,
    );

    this.s3Client = new S3Client({ region: this.region });

    this.logger.log(
      `FrsS3Service initialized (bucket: ${this.bucket}, region: ${this.region})`,
    );
  }

  /**
   * Uploads an FRS document buffer to S3.
   * Validates file type, size, and generates a pre-signed URL on success.
   */
  async uploadFrsDocument(
    documentId: string,
    originalFileName: string,
    mimeType: string,
    fileBuffer: Buffer,
    s3KeyOverride?: string,
  ): Promise<FrsUploadResult> {
    this.logger.log(
      `Uploading FRS document: ${originalFileName} for documentId: ${documentId}`,
    );

    // Validate file type
    this.validateFileType(originalFileName, mimeType);

    // Validate file size
    if (fileBuffer.length > this.maxFileSizeBytes) {
      throw new BadRequestException(
        `File size (${fileBuffer.length} bytes) exceeds maximum allowed size of ${this.maxFileSizeBytes} bytes.`,
      );
    }

    if (fileBuffer.length === 0) {
      throw new BadRequestException('Uploaded file is empty.');
    }

    // Build S3 key
    const s3Key =
      s3KeyOverride ??
      `frs-documents/${documentId}/${this.sanitizeFileName(originalFileName)}`;

    // Upload to S3
    const putCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType,
      Metadata: {
        documentId,
        originalFileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    try {
      await this.s3Client.send(putCommand);
      this.logger.log(
        `Successfully uploaded to s3://${this.bucket}/${s3Key} (${fileBuffer.length} bytes)`,
      );
    } catch (error) {
      this.logger.error(`S3 upload failed: ${error.message}`);
      throw new BadRequestException(`Failed to upload document to S3: ${error.message}`);
    }

    // Generate pre-signed URL for immediate verification
    const s3PreSignedUrl = await this.generatePresignedGetUrl(s3Key);

    return {
      documentId,
      originalFileName,
      mimeType,
      fileSizeBytes: fileBuffer.length,
      s3Bucket: this.bucket,
      s3Key,
      s3PreSignedUrl,
      uploadedAt: new Date().toISOString(),
    };
  }

  /**
   * Fetches metadata for a stored FRS document and returns a pre-signed GET URL.
   * The pre-signed URL is ready to be passed into the document parsing pipeline.
   */
  async getFrsDocumentUrl(documentId: string, s3Key: string): Promise<FrsDocumentUrlResult> {
    this.logger.log(
      `Fetching pre-signed URL for documentId: ${documentId}, key: ${s3Key}`,
    );

    // Verify the object exists in S3 via HeadObject
    let uploadedAt: string;
    let originalFileName: string;

    try {
      const headCommand = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
      });

      const headResponse = await this.s3Client.send(headCommand);
      uploadedAt = headResponse.Metadata?.['uploadedat'] ?? headResponse.LastModified?.toISOString() ?? new Date().toISOString();
      originalFileName = headResponse.Metadata?.['originalfilename'] ?? s3Key.split('/').pop() ?? s3Key;
    } catch (error) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        throw new NotFoundException(
          `Document not found in S3: s3://${this.bucket}/${s3Key}. ` +
          `Ensure the document was uploaded first via POST /frs-upload`,
        );
      }

      this.logger.error(`HeadObject failed for key ${s3Key}: ${error.message}`);
      throw new BadRequestException(`Failed to access document in S3: ${error.message}`);
    }

    // Generate pre-signed GET URL
    const s3PreSignedUrl = await this.generatePresignedGetUrl(s3Key);

    this.logger.log(
      `Pre-signed URL generated for s3://${this.bucket}/${s3Key} (expires in ${PRESIGNED_URL_EXPIRY_SECONDS}s)`,
    );

    return {
      documentId,
      originalFileName,
      s3Bucket: this.bucket,
      s3Key,
      s3PreSignedUrl,
      expiresInSeconds: PRESIGNED_URL_EXPIRY_SECONDS,
      uploadedAt,
    };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async generatePresignedGetUrl(s3Key: string): Promise<string> {
    const getCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
    });

    return getSignedUrl(this.s3Client, getCommand, {
      expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
    });
  }

  private validateFileType(fileName: string, mimeType: string): void {
    const ext = this.getExtension(fileName);

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      throw new UnsupportedMediaTypeException(
        `Unsupported file extension "${ext}". Allowed: ${[...ALLOWED_EXTENSIONS].join(', ')}`,
      );
    }

    // Normalize mimeType — browsers sometimes send inconsistent types
    const normalizedMime = mimeType.split(';')[0].trim().toLowerCase();

    if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
      throw new UnsupportedMediaTypeException(
        `Unsupported MIME type "${normalizedMime}". Allowed: ${[...ALLOWED_MIME_TYPES].join(', ')}`,
      );
    }
  }

  private getExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    if (lastDot === -1) return '';
    return fileName.slice(lastDot).toLowerCase();
  }

  private sanitizeFileName(fileName: string): string {
    // Replace spaces and special chars except dot, dash, underscore
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }
}
