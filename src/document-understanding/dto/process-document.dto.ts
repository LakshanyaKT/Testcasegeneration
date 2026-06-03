import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProcessDocumentDto {
  @ApiProperty({
    description: 'Unique identifier for the document',
    example: 'DOC001',
  })
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({
    description: 'S3 bucket name where the document is stored',
    example: 'my-documents-bucket',
  })
  @IsString()
  @IsNotEmpty()
  s3Bucket: string;

  @ApiProperty({
    description: 'S3 object key (path) of the markdown document',
    example: 'uploads/documents/requirements-spec.md',
  })
  @IsString()
  @IsNotEmpty()
  s3Key: string;

  @ApiPropertyOptional({
    description: 'Optional raw markdown content. If provided, S3 download is skipped.',
    example: '# Requirements\n\nThe system shall authenticate users via OAuth 2.0.',
  })
  @IsString()
  @IsOptional()
  markdown?: string;
}
