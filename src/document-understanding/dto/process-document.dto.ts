import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProcessDocumentDto {
  @ApiProperty({
    description: 'Unique identifier for the project',
    example: 'PRJ_001',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'Unique identifier for the analysis session',
    example: 'SES_101',
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

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

  @ApiPropertyOptional({
    description: 'Optional filename override.',
    example: 'requirements.md',
  })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({
    description: 'Optional file type override.',
    example: 'markdown',
  })
  @IsString()
  @IsOptional()
  fileType?: string;

  @ApiPropertyOptional({
    description: 'Optional uploader user reference.',
    example: 'admin',
  })
  @IsString()
  @IsOptional()
  uploadedBy?: string;
}
