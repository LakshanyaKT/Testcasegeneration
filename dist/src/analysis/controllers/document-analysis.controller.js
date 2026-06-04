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
var DocumentAnalysisController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentAnalysisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const document_analysis_service_1 = require("../services/document-analysis.service");
const dto_1 = require("../dto");
let DocumentAnalysisController = DocumentAnalysisController_1 = class DocumentAnalysisController {
    constructor(documentAnalysisService) {
        this.documentAnalysisService = documentAnalysisService;
        this.logger = new common_1.Logger(DocumentAnalysisController_1.name);
    }
    async analyzeDocument(documentId) {
        this.logger.log(`Received analysis request for document: ${documentId}`);
        return this.documentAnalysisService.analyzeDocument(documentId);
    }
    async getAnalysis(documentId) {
        return this.documentAnalysisService.getAnalysis(documentId);
    }
};
exports.DocumentAnalysisController = DocumentAnalysisController;
__decorate([
    (0, common_1.Post)(':documentId/analyze'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Analyze a processed document',
        description: 'Fetches all chunks for the document, aggregates summaries/requirements/test cases, and uses Claude to produce a comprehensive document understanding including identified modules, dependencies, risk areas, missing information, and workflow.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Document analysis completed successfully',
        type: dto_1.AnalyzeDocumentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No chunks found — document must be processed first',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentAnalysisController.prototype, "analyzeDocument", null);
__decorate([
    (0, common_1.Get)(':documentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get existing document analysis',
        description: 'Retrieves the stored document understanding analysis for the given document ID.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Document analysis retrieved successfully',
        type: dto_1.AnalyzeDocumentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Analysis not found — run analysis first via POST',
    }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentAnalysisController.prototype, "getAnalysis", null);
exports.DocumentAnalysisController = DocumentAnalysisController = DocumentAnalysisController_1 = __decorate([
    (0, swagger_1.ApiTags)('Document Understanding'),
    (0, common_1.Controller)('document-understanding'),
    __metadata("design:paramtypes", [document_analysis_service_1.DocumentAnalysisService])
], DocumentAnalysisController);
//# sourceMappingURL=document-analysis.controller.js.map