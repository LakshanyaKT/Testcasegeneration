import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFrsDocumentDto {
  @ApiProperty({
    description:
      'Unique identifier for the document. Used as the S3 key prefix and document reference.',
    example: 'DOC001',
  })
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiPropertyOptional({
    description:
      'Optional custom S3 key (path) to store the file under. ' +
      'If omitted, defaults to: frs-documents/<documentId>/<originalFileName>.',
    example: 'frs-documents/DOC001/Sales_Order_FRS.pdf',
  })
  @IsString()
  @IsOptional()
  s3KeyOverride?: string;
}
