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
exports.ProcessDocumentResponseDto = exports.ChunkResponseDto = exports.ProcessingDto = exports.ClassificationDto = exports.ChunkSummaryDto = exports.PageRangeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const interfaces_1 = require("../interfaces");
class PageRangeDto {
}
exports.PageRangeDto = PageRangeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PageRangeDto.prototype, "startPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], PageRangeDto.prototype, "endPage", void 0);
class ChunkSummaryDto {
}
exports.ChunkSummaryDto = ChunkSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Authentication requirement for OAuth 2.0' }),
    __metadata("design:type", String)
], ChunkSummaryDto.prototype, "shortSummary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'This chunk describes the requirement for implementing OAuth 2.0 based authentication for all system users.' }),
    __metadata("design:type", String)
], ChunkSummaryDto.prototype, "detailedSummary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 94 }),
    __metadata("design:type", Number)
], ChunkSummaryDto.prototype, "confidence", void 0);
class ClassificationDto {
}
exports.ClassificationDto = ClassificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 95 }),
    __metadata("design:type", Number)
], ClassificationDto.prototype, "confidence", void 0);
class ProcessingDto {
}
exports.ProcessingDto = ProcessingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AI_SEMANTIC' }),
    __metadata("design:type", String)
], ProcessingDto.prototype, "chunkingStrategy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProcessingDto.prototype, "summaryGenerated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProcessingDto.prototype, "extractionCompleted", void 0);
class ChunkResponseDto {
}
exports.ChunkResponseDto = ChunkResponseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '6651a2f3e4b0a1234567890a' }),
    __metadata("design:type", String)
], ChunkResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], ChunkResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ChunkResponseDto.prototype, "chunkNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: interfaces_1.ChunkType, example: interfaces_1.ChunkType.REQUIREMENT }),
    __metadata("design:type", String)
], ChunkResponseDto.prototype, "chunkType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'User Authentication' }),
    __metadata("design:type", String)
], ChunkResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PageRangeDto }),
    __metadata("design:type", Object)
], ChunkResponseDto.prototype, "pageRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'The system shall authenticate users via OAuth 2.0.' }),
    __metadata("design:type", String)
], ChunkResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChunkSummaryDto }),
    __metadata("design:type", Object)
], ChunkResponseDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ClassificationDto }),
    __metadata("design:type", Object)
], ChunkResponseDto.prototype, "classification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Extracted structured data depending on chunk type',
        example: { requirements: [{ requirementId: 'REQ_AUTO_001', title: 'OAuth Auth', description: 'The system shall authenticate users via OAuth 2.0.' }] },
    }),
    __metadata("design:type", Object)
], ChunkResponseDto.prototype, "extractedData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProcessingDto }),
    __metadata("design:type", Object)
], ChunkResponseDto.prototype, "processing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-03T10:00:00.000Z' }),
    __metadata("design:type", Date)
], ChunkResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-03T10:00:00.000Z' }),
    __metadata("design:type", Date)
], ChunkResponseDto.prototype, "updatedAt", void 0);
class ProcessDocumentResponseDto {
}
exports.ProcessDocumentResponseDto = ProcessDocumentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of chunks extracted', example: 12 }),
    __metadata("design:type", Number)
], ProcessDocumentResponseDto.prototype, "totalChunks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of chunks classified as REQUIREMENT', example: 5 }),
    __metadata("design:type", Number)
], ProcessDocumentResponseDto.prototype, "requirementChunks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of chunks classified as TEST_CASE', example: 4 }),
    __metadata("design:type", Number)
], ProcessDocumentResponseDto.prototype, "testCaseChunks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of chunks classified as UNKNOWN', example: 3 }),
    __metadata("design:type", Number)
], ProcessDocumentResponseDto.prototype, "unknownChunks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of all processed chunks', type: [ChunkResponseDto] }),
    __metadata("design:type", Array)
], ProcessDocumentResponseDto.prototype, "chunks", void 0);
//# sourceMappingURL=process-document-response.dto.js.map