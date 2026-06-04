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
exports.AnalyzeDocumentResponseDto = exports.AnalysisMetadataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AnalysisMetadataDto {
}
exports.AnalysisMetadataDto = AnalysisMetadataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 18 }),
    __metadata("design:type", Number)
], AnalysisMetadataDto.prototype, "totalChunksAnalyzed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], AnalysisMetadataDto.prototype, "requirementChunks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], AnalysisMetadataDto.prototype, "testCaseChunks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'v1' }),
    __metadata("design:type", String)
], AnalysisMetadataDto.prototype, "processingVersion", void 0);
class AnalyzeDocumentResponseDto {
}
exports.AnalyzeDocumentResponseDto = AnalyzeDocumentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], AnalyzeDocumentResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sales Order Management system with customer validation and approval workflows.' }),
    __metadata("design:type", String)
], AnalyzeDocumentResponseDto.prototype, "overallSummary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['Customer Validation', 'Pricing', 'Approval Workflow'],
    }),
    __metadata("design:type", Array)
], AnalyzeDocumentResponseDto.prototype, "identifiedModules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['Customer Validation must complete before Pricing'],
    }),
    __metadata("design:type", Array)
], AnalyzeDocumentResponseDto.prototype, "dependencies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['Missing Credit Check Rules', 'Undefined rejection workflow'],
    }),
    __metadata("design:type", Array)
], AnalyzeDocumentResponseDto.prototype, "riskAreas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['Definition of Active Customer', 'Approval timeout behavior'],
    }),
    __metadata("design:type", Array)
], AnalyzeDocumentResponseDto.prototype, "missingInformation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['Customer Validation', 'Pricing', 'Approval'],
    }),
    __metadata("design:type", Array)
], AnalyzeDocumentResponseDto.prototype, "workflow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AnalysisMetadataDto }),
    __metadata("design:type", AnalysisMetadataDto)
], AnalyzeDocumentResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-03T10:00:00.000Z' }),
    __metadata("design:type", Date)
], AnalyzeDocumentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-03T10:00:00.000Z' }),
    __metadata("design:type", Date)
], AnalyzeDocumentResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=analyze-document-response.dto.js.map