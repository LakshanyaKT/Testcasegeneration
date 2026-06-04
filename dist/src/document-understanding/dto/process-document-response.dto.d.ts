export declare class DocumentAnalysisDto {
    confidence: number;
    completenessScore: number;
    coverageScore: number;
    documentType: string;
    summary?: string;
}
export declare class RequirementDto {
    requirementId: string;
    module: string;
    title: string;
    description: string;
    priority: string;
    category: string;
}
export declare class EntityDto {
    entityId: string;
    name: string;
    description: string;
    attributes: string[];
}
export declare class BusinessRuleDto {
    ruleId: string;
    description: string;
    priority: string;
}
export declare class ValidationDto {
    validationId: string;
    field: string;
    rule: string;
    errorMessage: string;
}
export declare class ProcessFlowDto {
    processId: string;
    name: string;
    steps: string[];
}
export declare class WorkflowTransitionDto {
    from: string;
    to: string;
    trigger?: string;
}
export declare class WorkflowDto {
    workflowId: string;
    name: string;
    states: string[];
    transitions: WorkflowTransitionDto[];
}
export declare class MissingInformationDto {
    id: string;
    category: string;
    description: string;
    severity: string;
}
export declare class ClarificationQuestionDto {
    questionId: string;
    question: string;
    category: string;
    priority: string;
}
export declare class TestCaseDto {
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
export declare class CoverageDto {
    requirementsCovered: number;
    requirementsTotal: number;
    coveragePercentage: number;
}
export declare class ProcessDocumentResponseDto {
    status: 'READY' | 'NEEDS_CLARIFICATION';
    documentId: string;
    projectId: string;
    sessionId: string;
    analysis?: DocumentAnalysisDto;
    requirements?: RequirementDto[];
    entities?: EntityDto[];
    businessRules?: BusinessRuleDto[];
    validations?: ValidationDto[];
    processFlows?: ProcessFlowDto[];
    workflows?: WorkflowDto[];
    missingInformation?: MissingInformationDto[];
    questions?: ClarificationQuestionDto[];
    testCases?: TestCaseDto[];
    coverage?: CoverageDto;
    nextAction?: string;
}
