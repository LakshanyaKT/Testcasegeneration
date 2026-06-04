import { IsArray, IsString, IsNotEmpty, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TestCaseTypeSelectionStatus } from '../schemas/test-case-type-selection.schema';

export class SuggestedTypeDto {
  @ApiProperty({ example: 'Security' })
  type: string;

  @ApiProperty({ example: 'Risk areas include unvalidated input fields that could expose injection vulnerabilities.' })
  reason: string;
}

export class TestCaseTypeSelectionResponseDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ type: [String], example: ['Functional', 'Boundary Value', 'Negative', 'Integration'] })
  detectedTypes: string[];

  @ApiProperty({ type: [SuggestedTypeDto] })
  suggestedTypes: SuggestedTypeDto[];

  @ApiProperty({ type: [String], example: [], description: 'Empty until user approves via POST /test-case-types/:documentId/approve' })
  finalTypes: string[];

  @ApiProperty({ enum: TestCaseTypeSelectionStatus, example: TestCaseTypeSelectionStatus.PENDING_APPROVAL })
  status: TestCaseTypeSelectionStatus;

  @ApiProperty({ example: '2025-06-04T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-04T10:00:00.000Z' })
  updatedAt: Date;
}

export class ApproveTestCaseTypesDto {
  @ApiProperty({
    type: [String],
    description: 'Final list of test case types approved by the user. Must be a subset of detectedTypes ∪ suggestedTypes.',
    example: ['Functional', 'Boundary Value', 'Security'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  approvedTypes: string[];
}
