import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3DocumentService {
  private readonly logger = new Logger(S3DocumentService.name);
  private readonly s3Client: S3Client;
  private readonly maxDocumentBytes: number;

  constructor() {
    const region = process.env.AWS_REGION || 'us-east-1';
    this.maxDocumentBytes = parseInt(
      process.env.MAX_DOCUMENT_BYTES || '209715200',
      10,
    );

    this.s3Client = new S3Client({ region });
    this.logger.log(`S3 Document Service initialized (region: ${region})`);
  }

  /**
   * Downloads a document from S3 and returns the raw Buffer.
   * Works for any file type: PDF, DOCX, Markdown, etc.
   */
  async downloadDocumentBuffer(bucket: string, key: string): Promise<Buffer> {
    this.logger.log(`Downloading document from s3://${bucket}/${key}`);

    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      // Check content length
      if (response.ContentLength && response.ContentLength > this.maxDocumentBytes) {
        throw new BadRequestException(
          `Document size (${response.ContentLength} bytes) exceeds maximum allowed size (${this.maxDocumentBytes} bytes)`,
        );
      }

      if (!response.Body) {
        throw new Error(`Empty response body for s3://${bucket}/${key}`);
      }

      // Convert stream to Buffer
      const byteArray = await response.Body.transformToByteArray();
      const buffer = Buffer.from(byteArray);

      this.logger.log(
        `Downloaded document from s3://${bucket}/${key} (${buffer.length} bytes)`,
      );

      return buffer;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(
        `Failed to download document from s3://${bucket}/${key}: ${error.message}`,
      );
      throw new BadRequestException(
        `Failed to download document from S3: ${error.message}`,
      );
    }
  }
}
