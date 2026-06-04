"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessDocumentResponseDto = exports.CoverageDto = exports.TestCaseDto = exports.ClarificationQuestionDto = exports.MissingInformationDto = exports.WorkflowDto = exports.WorkflowTransitionDto = exports.ProcessFlowDto = exports.ValidationDto = exports.BusinessRuleDto = exports.EntityDto = exports.RequirementDto = exports.DocumentAnalysisDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DocumentAnalysisDto {
}
exports.DocumentAnalysisDto = DocumentAnalysisDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 95 }),
    __metadata("design:type", Number)
], DocumentAnalysisDto.prototype, "confidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 85 }),
    __metadata("design:type", Number)
], DocumentAnalysisDto.prototype, "completenessScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 90 }),
    __metadata("design:type", Number)
], DocumentAnalysisDto.prototype, "coverageScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FRS' }),
    __metadata("design:type", String)
], DocumentAnalysisDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Summary of the functional requirements document.' }),
    __metadata("design:type", String)
], DocumentAnalysisDto.prototype, "summary", void 0);
class RequirementDto {
}
exports.RequirementDto = RequirementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'REQ_AUTO_001' }),
    __metadata("design:type", String)
], RequirementDto.prototype, "requirementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Authentication' }),
    __metadata("design:type", String)
], RequirementDto.prototype, "module", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'User Login' }),
    __metadata("design:type", String)
], RequirementDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'The system must authenticate users via credentials.' }),
    __metadata("design:type", String)
], RequirementDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HIGH' }),
    __metadata("design:type", String)
], RequirementDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Functional' }),
    __metadata("design:type", String)
], RequirementDto.prototype, "category", void 0);
class EntityDto {
}
exports.EntityDto = EntityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ENT_001' }),
    __metadata("design:type", String)
], EntityDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'User' }),
    __metadata("design:type", String)
], EntityDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Represents a system user' }),
    __metadata("design:type", String)
], EntityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['email', 'passwordHash', 'role'] }),
    __metadata("design:type", Array)
], EntityDto.prototype, "attributes", void 0);
class BusinessRuleDto {
}
exports.BusinessRuleDto = BusinessRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BR_001' }),
    __metadata("design:type", String)
], BusinessRuleDto.prototype, "ruleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Only admins can approve user registrations.' }),
    __metadata("design:type", String)
], BusinessRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HIGH' }),
    __metadata("design:type", String)
], BusinessRuleDto.prototype, "priority", void 0);
class ValidationDto {
}
exports.ValidationDto = ValidationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'VAL_001' }),
    __metadata("design:type", String)
], ValidationDto.prototype, "validationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'email' }),
    __metadata("design:type", String)
], ValidationDto.prototype, "field", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Must be a valid email format.' }),
    __metadata("design:type", String)
], ValidationDto.prototype, "rule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Invalid email address.' }),
    __metadata("design:type", String)
], ValidationDto.prototype, "errorMessage", void 0);
class ProcessFlowDto {
}
exports.ProcessFlowDto = ProcessFlowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PRC_001' }),
    __metadata("design:type", String)
], ProcessFlowDto.prototype, "processId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Checkout Flow' }),
    __metadata("design:type", String)
], ProcessFlowDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Add to Cart', 'Submit Payment', 'Receive Confirmation'] }),
    __metadata("design:type", Array)
], ProcessFlowDto.prototype, "steps", void 0);
class WorkflowTransitionDto {
}
exports.WorkflowTransitionDto = WorkflowTransitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DRAFT' }),
    __metadata("design:type", String)
], WorkflowTransitionDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PUBLISHED' }),
    __metadata("design:type", String)
], WorkflowTransitionDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'admin approval' }),
    __metadata("design:type", String)
], WorkflowTransitionDto.prototype, "trigger", void 0);
class WorkflowDto {
}
exports.WorkflowDto = WorkflowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'WF_001' }),
    __metadata("design:type", String)
], WorkflowDto.prototype, "workflowId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Document Approval State Machine' }),
    __metadata("design:type", String)
], WorkflowDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED'] }),
    __metadata("design:type", Array)
], WorkflowDto.prototype, "states", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [WorkflowTransitionDto] }),
    __metadata("design:type", Array)
], WorkflowDto.prototype, "transitions", void 0);
class MissingInformationDto {
}
exports.MissingInformationDto = MissingInformationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'GAP_001' }),
    __metadata("design:type", String)
], MissingInformationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Authentication' }),
    __metadata("design:type", String)
], MissingInformationDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OIDC scope specifications are not defined.' }),
    __metadata("design:type", String)
], MissingInformationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HIGH' }),
    __metadata("design:type", String)
], MissingInformationDto.prototype, "severity", void 0);
class ClarificationQuestionDto {
}
exports.ClarificationQuestionDto = ClarificationQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Q_001' }),
    __metadata("design:type", String)
], ClarificationQuestionDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What OIDC provider scopes should be authorized?' }),
    __metadata("design:type", String)
], ClarificationQuestionDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Authentication' }),
    __metadata("design:type", String)
], ClarificationQuestionDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HIGH' }),
    __metadata("design:type", String)
], ClarificationQuestionDto.prototype, "priority", void 0);
class TestCaseDto {
}
exports.TestCaseDto = TestCaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TC_AUTO_001' }),
    __metadata("design:type", String)
], TestCaseDto.prototype, "testCaseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Verify admin authentication' }),
    __metadata("design:type", String)
], TestCaseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HIGH' }),
    __metadata("design:type", String)
], TestCaseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Positive' }),
    __metadata("design:type", String)
], TestCaseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['REQ_AUTO_001'] }),
    __metadata("design:type", Array)
], TestCaseDto.prototype, "requirementIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['User exists with admin role'] }),
    __metadata("design:type", Array)
], TestCaseDto.prototype, "preConditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Navigate to Login', 'Enter admin credentials', 'Click Login'] }),
    __metadata("design:type", Array)
], TestCaseDto.prototype, "steps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Admin dashboard loads successfully'] }),
    __metadata("design:type", Array)
], TestCaseDto.prototype, "expectedResults", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: [] }),
    __metadata("design:type", Array)
], TestCaseDto.prototype, "testData", void 0);
class CoverageDto {
}
exports.CoverageDto = CoverageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], CoverageDto.prototype, "requirementsCovered", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], CoverageDto.prototype, "requirementsTotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 80 }),
    __metadata("design:type", Number)
], CoverageDto.prototype, "coveragePercentage", void 0);
class ProcessDocumentResponseDto {
}
exports.ProcessDocumentResponseDto = ProcessDocumentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['READY', 'NEEDS_CLARIFICATION'], example: 'READY' }),
    __metadata("design:type", String)
], ProcessDocumentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], ProcessDocumentResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PRJ_001' }),
    __metadata("design:type", String)
], ProcessDocumentResponseDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SES_101' }),
    __metadata("design:type", String)
], ProcessDocumentResponseDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: DocumentAnalysisDto }),
    __metadata("design:type", DocumentAnalysisDto)
], ProcessDocumentResponseDto.prototype, "analysis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [RequirementDto] }),
    __metadata("design:type", Array)
], ProcessDocumentResponseDto.prototype, "requirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [EntityDto] }),
    __metadata("design:type", Array)
], ProcessDocumentResponseDto.prototype, "entities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [BusinessRuleDto] }),
    __metadata("design:type", Array)
], ProcessDocumentResponseDto.prototype, "businessRules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ValidationDto] }),
    __metadata("design:type", Array)
], ProcessDocumentResponseDto.prototype, "validations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ProcessFlowDto] }),
    __metadata("design:type", Array)
], ProcessDocumentResponseDto.prototype, "processFlows", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [WorkflowDto] }),
    __metadata("design:type", Array)
], ProcessDocumentResponseDto.prototype, "workflows", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [MissingInformationDto] }),
    __metadata("design:type", Array)
], ProcessDocumentResponseDto.prototype, "missingInformation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ClarificationQuestionDto] }),
    __metadata("design:type", Array)
], ProcessDocumentResponseDto.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [TestCaseDto] }),
    __metadata("design:type", Array)
], ProcessDocumentResponseDto.prototype, "testCases", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CoverageDto }),
    __metadata("design:type", CoverageDto)
], ProcessDocumentResponseDto.prototype, "coverage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Proceed to test execution' }),
    __metadata("design:type", String)
], ProcessDocumentResponseDto.prototype, "nextAction", void 0);
//# sourceMappingURL=process-document-response.dto.js.map