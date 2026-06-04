import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentAnalysisDto {
  @ApiProperty({ example: 95 })
  confidence: number;

  @ApiProperty({ example: 85 })
  completenessScore: number;

  @ApiProperty({ example: 90 })
  coverageScore: number;

  @ApiProperty({ example: 'FRS' })
  documentType: string;

  @ApiPropertyOptional({ example: 'Summary of the functional requirements document.' })
  summary?: string;
}

export class RequirementDto {
  @ApiProperty({ example: 'REQ_AUTO_001' })
  requirementId: string;

  @ApiProperty({ example: 'Authentication' })
  module: string;

  @ApiProperty({ example: 'User Login' })
  title: string;

  @ApiProperty({ example: 'The system must authenticate users via credentials.' })
  description: string;

  @ApiProperty({ example: 'HIGH' })
  priority: string;

  @ApiProperty({ example: 'Functional' })
  category: string;
}

export class EntityDto {
  @ApiProperty({ example: 'ENT_001' })
  entityId: string;

  @ApiProperty({ example: 'User' })
  name: string;

  @ApiProperty({ example: 'Represents a system user' })
  description: string;

  @ApiProperty({ example: ['email', 'passwordHash', 'role'] })
  attributes: string[];
}

export class BusinessRuleDto {
  @ApiProperty({ example: 'BR_001' })
  ruleId: string;

  @ApiProperty({ example: 'Only admins can approve user registrations.' })
  description: string;

  @ApiProperty({ example: 'HIGH' })
  priority: string;
}

export class ValidationDto {
  @ApiProperty({ example: 'VAL_001' })
  validationId: string;

  @ApiProperty({ example: 'email' })
  field: string;

  @ApiProperty({ example: 'Must be a valid email format.' })
  rule: string;

  @ApiProperty({ example: 'Invalid email address.' })
  errorMessage: string;
}

export class ProcessFlowDto {
  @ApiProperty({ example: 'PRC_001' })
  processId: string;

  @ApiProperty({ example: 'Checkout Flow' })
  name: string;

  @ApiProperty({ example: ['Add to Cart', 'Submit Payment', 'Receive Confirmation'] })
  steps: string[];
}

export class WorkflowTransitionDto {
  @ApiProperty({ example: 'DRAFT' })
  from: string;

  @ApiProperty({ example: 'PUBLISHED' })
  to: string;

  @ApiPropertyOptional({ example: 'admin approval' })
  trigger?: string;
}

export class WorkflowDto {
  @ApiProperty({ example: 'WF_001' })
  workflowId: string;

  @ApiProperty({ example: 'Document Approval State Machine' })
  name: string;

  @ApiProperty({ example: ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED'] })
  states: string[];

  @ApiProperty({ type: [WorkflowTransitionDto] })
  transitions: WorkflowTransitionDto[];
}

export class MissingInformationDto {
  @ApiProperty({ example: 'GAP_001' })
  id: string;

  @ApiProperty({ example: 'Authentication' })
  category: string;

  @ApiProperty({ example: 'OIDC scope specifications are not defined.' })
  description: string;

  @ApiProperty({ example: 'HIGH' })
  severity: string;
}

export class ClarificationQuestionDto {
  @ApiProperty({ example: 'Q_001' })
  questionId: string;

  @ApiProperty({ example: 'What OIDC provider scopes should be authorized?' })
  question: string;

  @ApiProperty({ example: 'Authentication' })
  category: string;

  @ApiProperty({ example: 'HIGH' })
  priority: string;
}

export class TestCaseDto {
  @ApiProperty({ example: 'TC_AUTO_001' })
  testCaseId: string;

  @ApiProperty({ example: 'Verify admin authentication' })
  title: string;

  @ApiProperty({ example: 'HIGH' })
  priority: string;

  @ApiProperty({ example: 'Positive' })
  type: string;

  @ApiProperty({ example: ['REQ_AUTO_001'] })
  requirementIds: string[];

  @ApiProperty({ example: ['User exists with admin role'] })
  preConditions: string[];

  @ApiProperty({ example: ['Navigate to Login', 'Enter admin credentials', 'Click Login'] })
  steps: string[];

  @ApiProperty({ example: ['Admin dashboard loads successfully'] })
  expectedResults: string[];

  @ApiProperty({ example: [] })
  testData: any[];
}

export class CoverageDto {
  @ApiProperty({ example: 4 })
  requirementsCovered: number;

  @ApiProperty({ example: 5 })
  requirementsTotal: number;

  @ApiProperty({ example: 80 })
  coveragePercentage: number;
}

export class ProcessDocumentResponseDto {
  @ApiProperty({ enum: ['READY', 'NEEDS_CLARIFICATION'], example: 'READY' })
  status: 'READY' | 'NEEDS_CLARIFICATION';

  @ApiProperty({ example: 'DOC001' })
  documentId: string;

  @ApiProperty({ example: 'PRJ_001' })
  projectId: string;

  @ApiProperty({ example: 'SES_101' })
  sessionId: string;

  @ApiPropertyOptional({ type: DocumentAnalysisDto })
  analysis?: DocumentAnalysisDto;

  @ApiPropertyOptional({ type: [RequirementDto] })
  requirements?: RequirementDto[];

  @ApiPropertyOptional({ type: [EntityDto] })
  entities?: EntityDto[];

  @ApiPropertyOptional({ type: [BusinessRuleDto] })
  businessRules?: BusinessRuleDto[];

  @ApiPropertyOptional({ type: [ValidationDto] })
  validations?: ValidationDto[];

  @ApiPropertyOptional({ type: [ProcessFlowDto] })
  processFlows?: ProcessFlowDto[];

  @ApiPropertyOptional({ type: [WorkflowDto] })
  workflows?: WorkflowDto[];

  @ApiPropertyOptional({ type: [MissingInformationDto] })
  missingInformation?: MissingInformationDto[];

  @ApiPropertyOptional({ type: [ClarificationQuestionDto] })
  questions?: ClarificationQuestionDto[];

  @ApiPropertyOptional({ type: [TestCaseDto] })
  testCases?: TestCaseDto[];

  @ApiPropertyOptional({ type: CoverageDto })
  coverage?: CoverageDto;

  @ApiPropertyOptional({ example: 'Proceed to test execution' })
  nextAction?: string;
}
