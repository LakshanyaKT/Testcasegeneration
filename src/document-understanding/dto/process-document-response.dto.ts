import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChunkType, PageRange, ChunkSummary, ExtractedData, ProcessingMetadata } from '../interfaces';

export class PageRangeDto {
  @ApiProperty({ example: 1 })
  startPage: number;

  @ApiProperty({ example: 3 })
  endPage: number;
}

export class ChunkSummaryDto {
  @ApiProperty({ example: 'Authentication requirement for OAuth 2.0' })
  shortSummary: string;

  @ApiProperty({ example: 'This chunk describes the requirement for implementing OAuth 2.0 based authentication for all system users.' })
  detailedSummary: string;

  @ApiProperty({ example: 94 })
  confidence: number;
}

export class ClassificationDto {
  @ApiProperty({ example: 95 })
  confidence: number;
}

export class ProcessingDto {
  @ApiProperty({ example: 'AI_SEMANTIC' })
  chunkingStrategy: string;

  @ApiProperty({ example: true })
  summaryGenerated: boolean;

  @ApiProperty({ example: true })
  extractionCompleted: boolean;
}

export class ChunkResponseDto {
  @ApiPropertyOptional({ example: '6651a2f3e4b0a1234567890a' })
  _id: string;

  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 1 })
  chunkNumber: number;

  @ApiProperty({ enum: ChunkType, example: ChunkType.REQUIREMENT })
  chunkType: ChunkType;

  @ApiProperty({ example: 'User Authentication' })
  title: string;

  @ApiProperty({ type: PageRangeDto })
  pageRange: PageRange;

  @ApiProperty({ example: 'The system shall authenticate users via OAuth 2.0.' })
  content: string;

  @ApiProperty({ type: ChunkSummaryDto })
  summary: ChunkSummary;

  @ApiProperty({ type: ClassificationDto })
  classification: { confidence: number };

  @ApiProperty({
    description: 'Extracted structured data depending on chunk type',
    example: { requirements: [{ requirementId: 'REQ_AUTO_001', title: 'OAuth Auth', description: 'The system shall authenticate users via OAuth 2.0.' }] },
  })
  extractedData: ExtractedData;

  @ApiProperty({ type: ProcessingDto })
  processing: ProcessingMetadata;

  @ApiProperty({ example: '2025-06-03T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-03T10:00:00.000Z' })
  updatedAt: Date;
}

export class ProcessDocumentResponseDto {
  @ApiProperty({ description: 'Total number of chunks extracted', example: 12 })
  totalChunks: number;

  @ApiProperty({ description: 'Number of chunks classified as REQUIREMENT', example: 5 })
  requirementChunks: number;

  @ApiProperty({ description: 'Number of chunks classified as TEST_CASE', example: 4 })
  testCaseChunks: number;

  @ApiProperty({ description: 'Number of chunks classified as UNKNOWN', example: 3 })
  unknownChunks: number;

  @ApiProperty({ description: 'Array of all processed chunks', type: [ChunkResponseDto] })
  chunks: ChunkResponseDto[];
}
