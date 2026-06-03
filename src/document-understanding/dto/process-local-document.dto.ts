import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProcessLocalDocumentDto {
  @ApiProperty({
    description: 'Unique identifier for the document',
    example: 'DOC_LOCAL_001',
  })
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({
    description: 'Absolute or relative file path to the local markdown document',
    example: './test-documents/sample-frs.md',
  })
  @IsString()
  @IsNotEmpty()
  filePath: string;
}
