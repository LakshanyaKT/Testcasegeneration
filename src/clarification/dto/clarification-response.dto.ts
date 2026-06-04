import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClarificationStatus } from '../schemas/clarification.schema';

export class ClarificationResponseDto {
  @ApiProperty({ example: 'CLR001' })
  clarificationId: string;

  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 'What defines an active customer?' })
  question: string;

  @ApiProperty({ example: 'Customer validation requirement is ambiguous.' })
  reason: string;

  @ApiPropertyOptional({ example: 'Customer status must equal ACTIVE in the CRM system.', nullable: true })
  answer: string | null;

  @ApiProperty({ enum: ClarificationStatus, example: ClarificationStatus.PENDING })
  status: ClarificationStatus;

  @ApiPropertyOptional({ example: 1, nullable: true })
  priorityRank: number | null;

  @ApiPropertyOptional({ example: 'PRI-DOC001-1717406400000', nullable: true })
  priorityBatch: string | null;

  @ApiPropertyOptional({ example: 'Blocks test case generation for Customer Validation module.', nullable: true })
  priorityReason: string | null;

  @ApiProperty({ example: '2025-06-03T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-03T10:00:00.000Z' })
  updatedAt: Date;
}

export class GenerateClarificationsResponseDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 3 })
  totalGenerated: number;

  @ApiProperty({ type: [ClarificationResponseDto] })
  clarifications: ClarificationResponseDto[];
}

export class GetClarificationsResponseDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 3 })
  total: number;

  @ApiProperty({ type: [ClarificationResponseDto] })
  clarifications: ClarificationResponseDto[];
}

export class PrioritizeClarificationsResponseDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 'PRI-DOC001-1717406400000' })
  priorityBatchId: string;

  @ApiProperty({ example: 3 })
  topK: number;

  @ApiProperty({ example: 8, description: 'Total PENDING questions that were ranked' })
  totalEvaluated: number;

  @ApiProperty({
    type: [ClarificationResponseDto],
    description: 'Top-K questions in priority order (rank 1 = most critical)',
  })
  prioritizedQuestions: ClarificationResponseDto[];
}

export class GetPrioritizedClarificationsResponseDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 'PRI-DOC001-1717406400000' })
  priorityBatchId: string;

  @ApiProperty({ example: 3 })
  total: number;

  @ApiProperty({ type: [ClarificationResponseDto] })
  questions: ClarificationResponseDto[];
}
