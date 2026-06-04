import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ description: 'Display name of the agent', example: 'MM Invoice Validator Agent' })
  @IsString()
  @IsNotEmpty()
  display_name: string;

  @ApiProperty({ description: 'Module (e.g., MM, HR, FI, SD)', example: 'MM' })
  @IsString()
  @IsNotEmpty()
  module: string;

  @ApiProperty({ description: 'User ID of the creator', example: 'USER001' })
  @IsString()
  @IsNotEmpty()
  created_by: string;

  @ApiProperty({ description: 'FRS document file name', example: 'FRS_MM_Invoice.docx' })
  @IsString()
  @IsNotEmpty()
  document_name: string;

  @ApiPropertyOptional({ description: 'Document type', example: 'FRS', default: 'FRS' })
  @IsString()
  @IsOptional()
  document_type?: string;

  @ApiPropertyOptional({ description: 'S3 bucket', example: 'my-docs-bucket' })
  @IsString()
  @IsOptional()
  s3_bucket?: string;

  @ApiPropertyOptional({ description: 'S3 key of the document', example: 'uploads/FRS_MM_Invoice.docx' })
  @IsString()
  @IsOptional()
  s3_key?: string;
}
