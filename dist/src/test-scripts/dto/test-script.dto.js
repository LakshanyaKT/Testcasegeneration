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
exports.TestScriptsSummaryDto = exports.GetTestScriptsResponseDto = exports.TestScriptsByTypeDto = exports.GenerateTestScriptsResponseDto = exports.TestScriptResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const test_script_schema_1 = require("../schemas/test-script.schema");
class TestScriptResponseDto {
}
exports.TestScriptResponseDto = TestScriptResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TS-DOC001-1717406400000-0' }),
    __metadata("design:type", String)
], TestScriptResponseDto.prototype, "testScriptId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], TestScriptResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '665a2f3e4b0a1234567890ab' }),
    __metadata("design:type", String)
], TestScriptResponseDto.prototype, "chunkId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Customer Validation' }),
    __metadata("design:type", String)
], TestScriptResponseDto.prototype, "chunkTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: test_script_schema_1.TestScriptSourceTrack, example: test_script_schema_1.TestScriptSourceTrack.REQUIREMENT }),
    __metadata("design:type", String)
], TestScriptResponseDto.prototype, "sourceTrack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Boundary Value Analysis' }),
    __metadata("design:type", String)
], TestScriptResponseDto.prototype, "testCaseType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BVA — Minimum Order Amount Validation' }),
    __metadata("design:type", String)
], TestScriptResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'REQ_AUTO_001', nullable: true }),
    __metadata("design:type", Object)
], TestScriptResponseDto.prototype, "sourceRequirementId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'TC_AUTO_003', nullable: true }),
    __metadata("design:type", Object)
], TestScriptResponseDto.prototype, "sourceTestCaseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['User is logged in', 'Order form is open'] }),
    __metadata("design:type", Array)
], TestScriptResponseDto.prototype, "preconditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['Enter order amount as 0', 'Click Submit'] }),
    __metadata("design:type", Array)
], TestScriptResponseDto.prototype, "steps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['Error message "Minimum order is $1" is displayed'] }),
    __metadata("design:type", Array)
], TestScriptResponseDto.prototype, "expectedResults", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: test_script_schema_1.TestScriptPriority, example: test_script_schema_1.TestScriptPriority.HIGH }),
    __metadata("design:type", String)
], TestScriptResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-04T10:00:00.000Z' }),
    __metadata("design:type", Date)
], TestScriptResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-04T10:00:00.000Z' }),
    __metadata("design:type", Date)
], TestScriptResponseDto.prototype, "updatedAt", void 0);
class GenerateTestScriptsResponseDto {
}
exports.GenerateTestScriptsResponseDto = GenerateTestScriptsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], GenerateTestScriptsResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42 }),
    __metadata("design:type", Number)
], GenerateTestScriptsResponseDto.prototype, "totalGenerated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30, description: 'Scripts generated from REQUIREMENT chunks' }),
    __metadata("design:type", Number)
], GenerateTestScriptsResponseDto.prototype, "fromRequirementTrack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, description: 'Scripts generated from TEST_CASE chunks' }),
    __metadata("design:type", Number)
], GenerateTestScriptsResponseDto.prototype, "fromTestCaseTrack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['Functional', 'Boundary Value Analysis', 'Security'] }),
    __metadata("design:type", Array)
], GenerateTestScriptsResponseDto.prototype, "testCaseTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TestScriptResponseDto] }),
    __metadata("design:type", Array)
], GenerateTestScriptsResponseDto.prototype, "testScripts", void 0);
class TestScriptsByTypeDto {
}
exports.TestScriptsByTypeDto = TestScriptsByTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Functional' }),
    __metadata("design:type", String)
], TestScriptsByTypeDto.prototype, "testCaseType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 14 }),
    __metadata("design:type", Number)
], TestScriptsByTypeDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TestScriptResponseDto] }),
    __metadata("design:type", Array)
], TestScriptsByTypeDto.prototype, "scripts", void 0);
class GetTestScriptsResponseDto {
}
exports.GetTestScriptsResponseDto = GetTestScriptsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], GetTestScriptsResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42 }),
    __metadata("design:type", Number)
], GetTestScriptsResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TestScriptsByTypeDto] }),
    __metadata("design:type", Array)
], GetTestScriptsResponseDto.prototype, "byType", void 0);
class TestScriptsSummaryDto {
}
exports.TestScriptsSummaryDto = TestScriptsSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], TestScriptsSummaryDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42 }),
    __metadata("design:type", Number)
], TestScriptsSummaryDto.prototype, "totalScripts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { 'Functional': 14, 'Boundary Value Analysis': 10, 'Security': 18 } }),
    __metadata("design:type", Object)
], TestScriptsSummaryDto.prototype, "byType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { 'REQUIREMENT': 30, 'TEST_CASE': 12 } }),
    __metadata("design:type", Object)
], TestScriptsSummaryDto.prototype, "byTrack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { 'HIGH': 20, 'MEDIUM': 15, 'LOW': 7 } }),
    __metadata("design:type", Object)
], TestScriptsSummaryDto.prototype, "byPriority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['Functional', 'Boundary Value Analysis', 'Security'] }),
    __metadata("design:type", Array)
], TestScriptsSummaryDto.prototype, "testCaseTypes", void 0);
//# sourceMappingURL=test-script.dto.js.map