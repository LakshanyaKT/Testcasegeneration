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
var FrsUploadController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrsUploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const frs_s3_service_1 = require("../services/frs-s3.service");
const dto_1 = require("../dto");
let FrsUploadController = FrsUploadController_1 = class FrsUploadController {
    constructor(frsS3Service) {
        this.frsS3Service = frsS3Service;
        this.logger = new common_1.Logger(FrsUploadController_1.name);
    }
    async uploadFrsDocument(documentId, file, s3KeyOverride) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided. Send the document as multipart/form-data with field name "file".');
        }
        this.logger.log(`Upload request — documentId: ${documentId}, ` +
            `file: ${file.originalname} (${file.size} bytes, ${file.mimetype})`);
        const result = await this.frsS3Service.uploadFrsDocument(documentId, file.originalname, file.mimetype, file.buffer, s3KeyOverride);
        return result;
    }
    async getFrsDocumentUrl(documentId, s3Key) {
        if (!s3Key || s3Key.trim().length === 0) {
            throw new common_1.BadRequestException('Query parameter "s3Key" is required. ' +
                'Use the s3Key value returned from POST /frs-upload/:documentId.');
        }
        this.logger.log(`URL fetch request — documentId: ${documentId}, s3Key: ${s3Key}`);
        return this.frsS3Service.getFrsDocumentUrl(documentId, s3Key.trim());
    }
};
exports.FrsUploadController = FrsUploadController;
__decorate([
    (0, common_1.Post)(':documentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload an FRS document to S3',
        description: 'Accepts a PDF, DOCX, Markdown, or TXT file via multipart form upload. ' +
            'Validates file type and size, stores the file in the configured S3 bucket under ' +
            'frs-documents/<documentId>/<fileName>, and returns the S3 key and a pre-signed URL ' +
            'valid for 1 hour. The returned s3Key and s3Bucket are the values to pass into the ' +
            'document parsing pipeline (POST /documents/process).',
    }),
    (0, swagger_1.ApiParam)({
        name: 'documentId',
        description: 'Unique identifier for this document. Used as the S3 path prefix.',
        example: 'DOC001',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'The FRS document file (PDF, DOCX, .md, .txt). Max 200 MB.',
                },
                s3KeyOverride: {
                    type: 'string',
                    description: 'Optional custom S3 key. Defaults to frs-documents/<documentId>/<fileName>.',
                    example: 'frs-documents/DOC001/Sales_Order_FRS.pdf',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Document uploaded successfully. Returns S3 location and pre-signed URL.',
        type: dto_1.UploadFrsDocumentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'No file provided, file is empty, or file exceeds size limit.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 415,
        description: 'Unsupported file type. Only PDF, DOCX, MD, TXT are accepted.',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error or S3 failure.' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Query)('s3KeyOverride')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], FrsUploadController.prototype, "uploadFrsDocument", null);
__decorate([
    (0, common_1.Get)(':documentId/url'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a pre-signed URL for an uploaded FRS document',
        description: 'Looks up the FRS document in S3 using the provided s3Key, verifies it exists, ' +
            'and returns a pre-signed GET URL valid for 1 hour. ' +
            'This URL can be passed directly into the document parsing pipeline ' +
            '(POST /documents/process) as the document source. ' +
            'Also returns the s3Bucket and s3Key needed for the parsing API.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'documentId',
        description: 'The document ID this S3 object belongs to.',
        example: 'DOC001',
    }),
    (0, swagger_1.ApiQuery)({
        name: 's3Key',
        description: 'The S3 object key of the uploaded document. ' +
            'Obtained from the upload response (s3Key field).',
        example: 'frs-documents/DOC001/Sales_Order_FRS.pdf',
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pre-signed URL generated. Use s3PreSignedUrl, s3Bucket, and s3Key to call the parsing pipeline.',
        type: dto_1.GetFrsDocumentUrlResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Missing or invalid s3Key query parameter.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Document not found in S3. Upload the document first via POST /frs-upload/:documentId.',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error or S3 failure.' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Query)('s3Key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FrsUploadController.prototype, "getFrsDocumentUrl", null);
exports.FrsUploadController = FrsUploadController = FrsUploadController_1 = __decorate([
    (0, swagger_1.ApiTags)('FRS Document Upload'),
    (0, common_1.Controller)('frs-upload'),
    __metadata("design:paramtypes", [frs_s3_service_1.FrsS3Service])
], FrsUploadController);
//# sourceMappingURL=frs-upload.controller.js.map