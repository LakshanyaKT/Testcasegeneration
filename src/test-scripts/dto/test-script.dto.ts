import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestScriptPriority, TestScriptSourceTrack } from '../schemas/test-script.schema';

export class TestScriptResponseDto {
  @ApiProperty({ example: 'TS-DOC001-1717406400000-0' })
  testScriptId: string;

  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: '665a2f3e4b0a1234567890ab' })
  chunkId: string;

  @ApiProperty({ example: 'Customer Validation' })
  chunkTitle: string;

  @ApiProperty({ enum: TestScriptSourceTrack, example: TestScriptSourceTrack.REQUIREMENT })
  sourceTrack: TestScriptSourceTrack;

  @ApiProperty({ example: 'Boundary Value Analysis' })
  testCaseType: string;

  @ApiProperty({ example: 'BVA — Minimum Order Amount Validation' })
  title: string;

  @ApiPropertyOptional({ example: 'REQ_AUTO_001', nullable: true })
  sourceRequirementId: string | null;

  @ApiPropertyOptional({ example: 'TC_AUTO_003', nullable: true })
  sourceTestCaseId: string | null;

  @ApiProperty({ type: [String], example: ['User is logged in', 'Order form is open'] })
  preconditions: string[];

  @ApiProperty({ type: [String], example: ['Enter order amount as 0', 'Click Submit'] })
  steps: string[];

  @ApiProperty({ type: [String], example: ['Error message "Minimum order is $1" is displayed'] })
  expectedResults: string[];

  @ApiProperty({ enum: TestScriptPriority, example: TestScriptPriority.HIGH })
  priority: TestScriptPriority;

  @ApiProperty({ example: '2025-06-04T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-04T10:00:00.000Z' })
  updatedAt: Date;
}

export class GenerateTestScriptsResponseDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 42 })
  totalGenerated: number;

  @ApiProperty({ example: 30, description: 'Scripts generated from REQUIREMENT chunks' })
  fromRequirementTrack: number;

  @ApiProperty({ example: 12, description: 'Scripts generated from TEST_CASE chunks' })
  fromTestCaseTrack: number;

  @ApiProperty({ type: [String], example: ['Functional', 'Boundary Value Analysis', 'Security'] })
  testCaseTypes: string[];

  @ApiProperty({ type: [TestScriptResponseDto] })
  testScripts: TestScriptResponseDto[];
}

export class TestScriptsByTypeDto {
  @ApiProperty({ example: 'Functional' })
  testCaseType: string;

  @ApiProperty({ example: 14 })
  count: number;

  @ApiProperty({ type: [TestScriptResponseDto] })
  scripts: TestScriptResponseDto[];
}

export class GetTestScriptsResponseDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ type: [TestScriptsByTypeDto] })
  byType: TestScriptsByTypeDto[];
}

export class TestScriptsSummaryDto {
  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 42 })
  totalScripts: number;

  @ApiProperty({ example: { 'Functional': 14, 'Boundary Value Analysis': 10, 'Security': 18 } })
  byType: Record<string, number>;

  @ApiProperty({ example: { 'REQUIREMENT': 30, 'TEST_CASE': 12 } })
  byTrack: Record<string, number>;

  @ApiProperty({ example: { 'HIGH': 20, 'MEDIUM': 15, 'LOW': 7 } })
  byPriority: Record<string, number>;

  @ApiProperty({ type: [String], example: ['Functional', 'Boundary Value Analysis', 'Security'] })
  testCaseTypes: string[];
}
