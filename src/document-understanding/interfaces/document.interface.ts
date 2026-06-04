export interface DocumentAnalysis {
  confidence: number;
  completenessScore: number;
  coverageScore: number;
  documentType: string;
  moduleCount?: number;
  requirementCount?: number;
  summary?: string;
}

export interface ExtractedRequirement {
  requirementId: string;
  module: string;
  title: string;
  description: string;
  priority: string;
  category: string;
}

export interface ExtractedEntity {
  entityId: string;
  name: string;
  description: string;
  attributes: string[];
}

export interface ExtractedBusinessRule {
  ruleId: string;
  description: string;
  priority: string;
}

export interface ExtractedValidation {
  validationId: string;
  field: string;
  rule: string;
  errorMessage: string;
}

export interface ExtractedProcessFlow {
  processId: string;
  name: string;
  steps: string[];
}

export interface ExtractedWorkflowTransition {
  from: string;
  to: string;
  trigger?: string;
}

export interface ExtractedWorkflow {
  workflowId: string;
  name: string;
  states: string[];
  transitions: ExtractedWorkflowTransition[];
}

export interface MissingInformation {
  id: string;
  category: string;
  description: string;
  severity: string;
}

export interface ClarificationQuestion {
  questionId: string;
  question: string;
  category: string;
  priority: string;
}

export interface ClarificationAnswer {
  questionId: string;
  answer: string;
}

export interface TestCase {
  testCaseId: string;
  title: string;
  priority: string;
  type: string;
  requirementIds: string[];
  preConditions: string[];
  steps: string[];
  expectedResults: string[];
  testData: any[];
}

export interface TestCaseCoverage {
  requirementsCovered: number;
  requirementsTotal: number;
  coveragePercentage: number;
}

export interface ProjectKnowledgeData {
  entities: any[];
  businessRules: any[];
  validations: any[];
  processFlows: any[];
  workflows: any[];
  testPatterns: any[];
  domainKnowledge?: any[];
  reusableScenarios?: any[];
}

export interface SessionKnowledgeData {
  requirements: ExtractedRequirement[];
  entities: ExtractedEntity[];
  businessRules: ExtractedBusinessRule[];
  validations: ExtractedValidation[];
  processFlows: ExtractedProcessFlow[];
  workflows: ExtractedWorkflow[];
}

export interface BedrockRequestContract {
  projectId: string;
  sessionId: string;
  documentText: string;
  projectKnowledge: ProjectKnowledgeData;
  task: {
    analyzeDocument: boolean;
    extractRequirements: boolean;
    extractEntities: boolean;
    extractBusinessRules: boolean;
    extractValidations: boolean;
    extractProcessFlows: boolean;
    extractWorkflows: boolean;
    identifyMissingInformation: boolean;
    generateQuestions: boolean;
    generateTestCases: boolean;
    generateKnowledgeUpdates: boolean;
  };
}

export interface BedrockResponseContract {
  status: 'READY' | 'NEEDS_CLARIFICATION';
  analysis: DocumentAnalysis;
  knowledgeBase: {
    projectKnowledge: ProjectKnowledgeData;
    sessionKnowledge: SessionKnowledgeData;
  };
  requirements: ExtractedRequirement[];
  entities: ExtractedEntity[];
  businessRules: ExtractedBusinessRule[];
  validations: ExtractedValidation[];
  processFlows: ExtractedProcessFlow[];
  workflows: ExtractedWorkflow[];
  missingInformation: MissingInformation[];
  questions: ClarificationQuestion[];
  testCases: TestCase[];
  coverage: TestCaseCoverage;
  nextAction: string;
}
