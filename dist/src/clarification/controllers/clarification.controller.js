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
        this.logger.log(`Generating clarifications for document: ${documentId}`);
        return this.clarificationService.generateClarifications(documentId);
    }
    async getClarifications(documentId) {
        return this.clarificationService.getClarifications(documentId);
    }
    async respondToClarification(clarificationId, dto) {
        this.logger.log(`Processing answer for clarification: ${clarificationId}`);
        return this.clarificationService.respondToClarification(clarificationId, dto.answer);
    }
};
exports.ClarificationController = ClarificationController;
__decorate([
    (0, common_1.Post)(':documentId/generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate clarification questions for a document',
        description: 'Reads the document understanding analysis, extracts missing information items, and uses Claude to generate targeted clarification questions. Questions are stored as PENDING in MongoDB.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Clarification questions generated and stored',
        type: dto_1.GenerateClarificationsResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No analysis found — run document analysis first',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClarificationController.prototype, "generateClarifications", null);
__decorate([
    (0, common_1.Get)(':documentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all clarifications for a document',
        description: 'Retrieves all clarification questions (PENDING, ANSWERED, RESOLVED, REJECTED) for the given document ID.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Clarifications retrieved successfully',
        type: dto_1.GetClarificationsResponseDto,
    }),
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
        description: 'Submits an answer to a clarification question. After saving the answer, re-runs Claude document understanding to update the analysis incorporating the new information. Marks the clarification as RESOLVED.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'clarificationId',
        example: 'CLR-DOC001-1717406400000-0',
        description: 'The clarificationId field of the clarification record',
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.RespondClarificationDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Answer recorded and document analysis updated',
        type: dto_1.RespondClarificationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Clarification is already RESOLVED or REJECTED',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Clarification not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
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