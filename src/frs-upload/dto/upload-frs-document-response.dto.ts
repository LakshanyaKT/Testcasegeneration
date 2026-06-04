import { ApiProperty } from '@nestjs/swagger';

export class UploadFrsDocumentResponseDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 'Sales_Order_FRS.pdf' })
  originalFileName: string;

  @ApiProperty({ example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ example: 204800, description: 'File size in bytes' })
  fileSizeBytes: number;

  @ApiProperty({ example: 'mvp-frs-documents' })
  s3Bucket: string;

  @ApiProperty({ example: 'frs-documents/DOC001/Sales_Order_FRS.pdf' })
  s3Key: string;

  @ApiProperty({
    example: 'https://mvp-frs-documents.s3.us-east-1.amazonaws.com/frs-documents/DOC001/Sales_Order_FRS.pdf',
    description: 'Pre-signed URL valid for 1 hour for immediate verification',
  })
  s3PreSignedUrl: string;

  @ApiProperty({ example: '2025-06-04T10:00:00.000Z' })
  uploadedAt: string;
}
