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
exports.ApproveTestCaseTypesDto = exports.TestCaseTypeSelectionResponseDto = exports.SuggestedTypeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const test_case_type_selection_schema_1 = require("../schemas/test-case-type-selection.schema");
class SuggestedTypeDto {
}
exports.SuggestedTypeDto = SuggestedTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Security' }),
    __metadata("design:type", String)
], SuggestedTypeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Risk areas include unvalidated input fields that could expose injection vulnerabilities.' }),
    __metadata("design:type", String)
], SuggestedTypeDto.prototype, "reason", void 0);
class TestCaseTypeSelectionResponseDto {
}
exports.TestCaseTypeSelectionResponseDto = TestCaseTypeSelectionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], TestCaseTypeSelectionResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['Functional', 'Boundary Value', 'Negative', 'Integration'] }),
    __metadata("design:type", Array)
], TestCaseTypeSelectionResponseDto.prototype, "detectedTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SuggestedTypeDto] }),
    __metadata("design:type", Array)
], TestCaseTypeSelectionResponseDto.prototype, "suggestedTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: [], description: 'Empty until user approves via POST /test-case-types/:documentId/approve' }),
    __metadata("design:type", Array)
], TestCaseTypeSelectionResponseDto.prototype, "finalTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: test_case_type_selection_schema_1.TestCaseTypeSelectionStatus, example: test_case_type_selection_schema_1.TestCaseTypeSelectionStatus.PENDING_APPROVAL }),
    __metadata("design:type", String)
], TestCaseTypeSelectionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-04T10:00:00.000Z' }),
    __metadata("design:type", Date)
], TestCaseTypeSelectionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-04T10:00:00.000Z' }),
    __metadata("design:type", Date)
], TestCaseTypeSelectionResponseDto.prototype, "updatedAt", void 0);
class ApproveTestCaseTypesDto {
}
exports.ApproveTestCaseTypesDto = ApproveTestCaseTypesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Final list of test case types approved by the user. Must be a subset of detectedTypes ∪ suggestedTypes.',
        example: ['Functional', 'Boundary Value', 'Security'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    __metadata("design:type", Array)
], ApproveTestCaseTypesDto.prototype, "approvedTypes", void 0);
//# sourceMappingURL=test-case-type-selection.dto.js.map