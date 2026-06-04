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
var DocumentUnderstandingController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentUnderstandingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const document_processing_service_1 = require("../services/document-processing.service");
const process_document_dto_1 = require("../dto/process-document.dto");
const process_local_document_dto_1 = require("../dto/process-local-document.dto");
const process_document_response_dto_1 = require("../dto/process-document-response.dto");
let DocumentUnderstandingController = DocumentUnderstandingController_1 = class DocumentUnderstandingController {
    constructor(documentProcessingService) {
        this.documentProcessingService = documentProcessingService;
        this.logger = new common_1.Logger(DocumentUnderstandingController_1.name);
    }
    async processDocument(dto) {
        this.logger.log(`Received document processing request: ${dto.documentId} (s3://${dto.s3Bucket}/${dto.s3Key}) for project: ${dto.projectId}`);
        return this.documentProcessingService.processDocument(dto);
    }
    async processLocalDocument(dto) {
        this.logger.log(`Received local document processing request: ${dto.documentId} (${dto.filePath}) for project: ${dto.projectId}`);
        return this.documentProcessingService.processLocalDocument(dto);
    }
};
exports.DocumentUnderstandingController = DocumentUnderstandingController;
__decorate([
    (0, common_1.Post)('process'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Process a document from S3 (document-centric)',
        description: 'Downloads a document from S3, retrieves relevant project knowledge, submits the entire document text + project knowledge to Amazon Bedrock (Claude Sonnet), performs a complete analysis in a single request, executes the Decision Engine, and stores results in MongoDB.',
    }),
    (0, swagger_1.ApiBody)({ type: process_document_dto_1.ProcessDocumentDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Document processed successfully using document-centric architecture',
        type: process_document_response_dto_1.ProcessDocumentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request body or failed to download document from S3',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error during processing',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_document_dto_1.ProcessDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentUnderstandingController.prototype, "processDocument", null);
__decorate([
    (0, common_1.Post)('process-local'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Process a local document (document-centric test workflow)',
        description: 'Reads a document from the local filesystem, parses it, retrieves relevant project knowledge, executes a complete Amazon Bedrock analysis in a single request, executes the Decision Engine, and saves results in MongoDB.',
    }),
    (0, swagger_1.ApiBody)({ type: process_local_document_dto_1.ProcessLocalDocumentDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Document processed successfully using document-centric architecture',
        type: process_document_response_dto_1.ProcessDocumentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request body or file not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error during processing',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_local_document_dto_1.ProcessLocalDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentUnderstandingController.prototype, "processLocalDocument", null);
exports.DocumentUnderstandingController = DocumentUnderstandingController = DocumentUnderstandingController_1 = __decorate([
    (0, swagger_1.ApiTags)('Documents'),
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [document_processing_service_1.DocumentProcessingService])
], DocumentUnderstandingController);
//# sourceMappingURL=document-understanding.controller.js.map