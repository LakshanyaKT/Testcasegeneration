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
exports.UploadFrsDocumentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UploadFrsDocumentResponseDto {
}
exports.UploadFrsDocumentResponseDto = UploadFrsDocumentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], UploadFrsDocumentResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sales_Order_FRS.pdf' }),
    __metadata("design:type", String)
], UploadFrsDocumentResponseDto.prototype, "originalFileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'application/pdf' }),
    __metadata("design:type", String)
], UploadFrsDocumentResponseDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 204800, description: 'File size in bytes' }),
    __metadata("design:type", Number)
], UploadFrsDocumentResponseDto.prototype, "fileSizeBytes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'mvp-frs-documents' }),
    __metadata("design:type", String)
], UploadFrsDocumentResponseDto.prototype, "s3Bucket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'frs-documents/DOC001/Sales_Order_FRS.pdf' }),
    __metadata("design:type", String)
], UploadFrsDocumentResponseDto.prototype, "s3Key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://mvp-frs-documents.s3.us-east-1.amazonaws.com/frs-documents/DOC001/Sales_Order_FRS.pdf',
        description: 'Pre-signed URL valid for 1 hour for immediate verification',
    }),
    __metadata("design:type", String)
], UploadFrsDocumentResponseDto.prototype, "s3PreSignedUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-04T10:00:00.000Z' }),
    __metadata("design:type", String)
], UploadFrsDocumentResponseDto.prototype, "uploadedAt", void 0);
//# sourceMappingURL=upload-frs-document-response.dto.js.map