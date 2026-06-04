import { ApiProperty } from '@nestjs/swagger';

export class AnalysisMetadataDto {
  @ApiProperty({ example: 18 })
  totalChunksAnalyzed: number;

  @ApiProperty({ example: 10 })
  requirementChunks: number;

  @ApiProperty({ example: 8 })
  testCaseChunks: number;

  @ApiProperty({ example: 'v1' })
  processingVersion: string;
}

export class AnalyzeDocumentResponseDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 'Sales Order Management system with customer validation and approval workflows.' })
  overallSummary: string;

  @ApiProperty({
    type: [String],
    example: ['Customer Validation', 'Pricing', 'Approval Workflow'],
  })
  identifiedModules: string[];

  @ApiProperty({
    type: [String],
    example: ['Customer Validation must complete before Pricing'],
  })
  dependencies: string[];

  @ApiProperty({
    type: [String],
    example: ['Missing Credit Check Rules', 'Undefined rejection workflow'],
  })
  riskAreas: string[];

  @ApiProperty({
    type: [String],
    example: ['Definition of Active Customer', 'Approval timeout behavior'],
  })
  missingInformation: string[];

  @ApiProperty({
    type: [String],
    example: ['Customer Validation', 'Pricing', 'Approval'],
  })
  workflow: string[];

  @ApiProperty({ type: AnalysisMetadataDto })
  metadata: AnalysisMetadataDto;

  @ApiProperty({ example: '2025-06-03T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-03T10:00:00.000Z' })
  updatedAt: Date;
}
