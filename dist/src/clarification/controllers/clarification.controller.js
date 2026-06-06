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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ClarificationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClarificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clarification_service_1 = require("../services/clarification.service");
const dto_1 = require("../dto");
let ClarificationController = ClarificationController_1 = class ClarificationController {
    constructor(clarificationService) {
        this.clarificationService = clarificationService;
        this.logger = new common_1.Logger(ClarificationController_1.name);
    }
    async generateClarifications(documentId) {
        return this.clarificationService.generateClarifications(documentId);
    }
    async prioritizeClarifications(documentId, topK) {
        const k = topK ? parseInt(topK, 10) : 3;
        this.logger.log(`Prioritize clarifications for: ${documentId}, topK: ${k}`);
        return this.clarificationService.prioritizeClarifications(documentId, k);
    }
    async getPrioritizedClarifications(documentId) {
        return this.clarificationService.getPrioritizedClarifications(documentId);
    }
    async getClarifications(documentId) {
        return this.clarificationService.getClarifications(documentId);
    }
    async respondToClarification(clarificationId, dto) {
        this.logger.log(`Respond to clarification: ${clarificationId}`);
        return this.clarificationService.respondToClarification(clarificationId, dto.answer);
    }
};
exports.ClarificationController = ClarificationController;
__decorate([
    (0, common_1.Post)(':documentId/generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate clarification questions',
        description: 'Reads missingInformation from document_understanding, calls Claude, stores all as PENDING.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.GenerateClarificationsResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Analysis not found' }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClarificationController.prototype, "generateClarifications", null);
__decorate([
    (0, common_1.Post)(':documentId/prioritize'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'AI-rank and select top-K clarification questions',
        description: 'Claude scores ALL PENDING questions against document risk areas and workflow, ' +
            'selects the top-K most critical, tags them with priorityRank/priorityBatch/priorityReason. ' +
            'Default topK=3. Use GET /clarifications/:documentId/prioritized to retrieve them.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiQuery)({ name: 'topK', required: false, example: 3, description: 'How many top questions to surface (default 3)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.PrioritizeClarificationsResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No PENDING questions found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Analysis not found' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Query)('topK')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ClarificationController.prototype, "prioritizeClarifications", null);
__decorate([
    (0, common_1.Get)(':documentId/prioritized'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get top-priority clarification questions',
        description: 'Returns the most recent priority batch — the questions to present to the user.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.GetPrioritizedClarificationsResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No prioritized batch found — run prioritize first' }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClarificationController.prototype, "getPrioritizedClarifications", null);
__decorate([
    (0, common_1.Get)(':documentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all clarifications for a document',
        description: 'Returns all records across all statuses.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.GetClarificationsResponseDto }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClarificationController.prototype, "getClarifications", null);
__decorate([
    (0, common_1.Post)(':clarificationId/respond'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer a clarification question',
        description: 'Saves answer (ANSWERED), re-runs Claude to update document_understanding, marks RESOLVED. Returns resolved clarification + updated analysis.',
    }),
    (0, swagger_1.ApiParam)({ name: 'clarificationId', example: 'CLR-DOC001-1717406400000-0' }),
    (0, swagger_1.ApiBody)({ type: dto_1.RespondClarificationDto }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.RespondClarificationResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Already RESOLVED or REJECTED' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not found' }),
    __param(0, (0, common_1.Param)('clarificationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RespondClarificationDto]),
    __metadata("design:returntype", Promise)
], ClarificationController.prototype, "respondToClarification", null);
exports.ClarificationController = ClarificationController = ClarificationController_1 = __decorate([
    (0, swagger_1.ApiTags)('Clarifications'),
    (0, common_1.Controller)('clarifications'),
    __metadata("design:paramtypes", [clarification_service_1.ClarificationService])
], ClarificationController);
//# sourceMappingURL=clarification.controller.js.map