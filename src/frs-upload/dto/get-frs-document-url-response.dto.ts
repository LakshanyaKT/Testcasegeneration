import { ApiProperty } from '@nestjs/swagger';

export class GetFrsDocumentUrlResponseDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 'Sales_Order_FRS.pdf' })
  originalFileName: string;

  @ApiProperty({ example: 'mvp-frs-documents' })
  s3Bucket: string;

  @ApiProperty({ example: 'frs-documents/DOC001/Sales_Order_FRS.pdf' })
  s3Key: string;

  @ApiProperty({
    example: 'https://mvp-frs-documents.s3.us-east-1.amazonaws.com/frs-documents/DOC001/Sales_Order_FRS.pdf',
    description:
      'Pre-signed GET URL valid for 1 hour. Pass this to the document parsing pipeline.',
  })
  s3PreSignedUrl: string;

  @ApiProperty({
    example: 3600,
    description: 'Pre-signed URL expiry in seconds',
  })
  expiresInSeconds: number;

  @ApiProperty({ example: '2025-06-04T10:00:00.000Z' })
  uploadedAt: string;
}
