import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessLocalDocumentDto {
  @ApiProperty({
    description: 'Unique identifier for the project',
    example: 'PRJ_LOCAL_001',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'Unique identifier for the analysis session',
    example: 'SES_LOCAL_101',
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

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
