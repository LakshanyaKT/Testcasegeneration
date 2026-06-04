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
