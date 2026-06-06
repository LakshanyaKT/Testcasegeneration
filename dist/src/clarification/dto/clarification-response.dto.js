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
exports.GetPrioritizedClarificationsResponseDto = exports.PrioritizeClarificationsResponseDto = exports.GetClarificationsResponseDto = exports.GenerateClarificationsResponseDto = exports.ClarificationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const clarification_schema_1 = require("../schemas/clarification.schema");
class ClarificationResponseDto {
}
exports.ClarificationResponseDto = ClarificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CLR001' }),
    __metadata("design:type", String)
], ClarificationResponseDto.prototype, "clarificationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], ClarificationResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What defines an active customer?' }),
    __metadata("design:type", String)
], ClarificationResponseDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Customer validation requirement is ambiguous.' }),
    __metadata("design:type", String)
], ClarificationResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Customer status must equal ACTIVE in the CRM system.', nullable: true }),
    __metadata("design:type", Object)
], ClarificationResponseDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: clarification_schema_1.ClarificationStatus, example: clarification_schema_1.ClarificationStatus.PENDING }),
    __metadata("design:type", String)
], ClarificationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, nullable: true }),
    __metadata("design:type", Object)
], ClarificationResponseDto.prototype, "priorityRank", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'PRI-DOC001-1717406400000', nullable: true }),
    __metadata("design:type", Object)
], ClarificationResponseDto.prototype, "priorityBatch", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Blocks test case generation for Customer Validation module.', nullable: true }),
    __metadata("design:type", Object)
], ClarificationResponseDto.prototype, "priorityReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-03T10:00:00.000Z' }),
    __metadata("design:type", Date)
], ClarificationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-03T10:00:00.000Z' }),
    __metadata("design:type", Date)
], ClarificationResponseDto.prototype, "updatedAt", void 0);
class GenerateClarificationsResponseDto {
}
exports.GenerateClarificationsResponseDto = GenerateClarificationsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], GenerateClarificationsResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], GenerateClarificationsResponseDto.prototype, "totalGenerated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ClarificationResponseDto] }),
    __metadata("design:type", Array)
], GenerateClarificationsResponseDto.prototype, "clarifications", void 0);
class GetClarificationsResponseDto {
}
exports.GetClarificationsResponseDto = GetClarificationsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], GetClarificationsResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], GetClarificationsResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ClarificationResponseDto] }),
    __metadata("design:type", Array)
], GetClarificationsResponseDto.prototype, "clarifications", void 0);
class PrioritizeClarificationsResponseDto {
}
exports.PrioritizeClarificationsResponseDto = PrioritizeClarificationsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], PrioritizeClarificationsResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PRI-DOC001-1717406400000' }),
    __metadata("design:type", String)
], PrioritizeClarificationsResponseDto.prototype, "priorityBatchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], PrioritizeClarificationsResponseDto.prototype, "topK", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8, description: 'Total PENDING questions that were ranked' }),
    __metadata("design:type", Number)
], PrioritizeClarificationsResponseDto.prototype, "totalEvaluated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ClarificationResponseDto],
        description: 'Top-K questions in priority order (rank 1 = most critical)',
    }),
    __metadata("design:type", Array)
], PrioritizeClarificationsResponseDto.prototype, "prioritizedQuestions", void 0);
class GetPrioritizedClarificationsResponseDto {
}
exports.GetPrioritizedClarificationsResponseDto = GetPrioritizedClarificationsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], GetPrioritizedClarificationsResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PRI-DOC001-1717406400000' }),
    __metadata("design:type", String)
], GetPrioritizedClarificationsResponseDto.prototype, "priorityBatchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], GetPrioritizedClarificationsResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ClarificationResponseDto] }),
    __metadata("design:type", Array)
], GetPrioritizedClarificationsResponseDto.prototype, "questions", void 0);
//# sourceMappingURL=clarification-response.dto.js.map