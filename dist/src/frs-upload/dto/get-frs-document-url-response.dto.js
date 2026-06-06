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
exports.GetFrsDocumentUrlResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetFrsDocumentUrlResponseDto {
}
exports.GetFrsDocumentUrlResponseDto = GetFrsDocumentUrlResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'DOC001' }),
    __metadata("design:type", String)
], GetFrsDocumentUrlResponseDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sales_Order_FRS.pdf' }),
    __metadata("design:type", String)
], GetFrsDocumentUrlResponseDto.prototype, "originalFileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'mvp-frs-documents' }),
    __metadata("design:type", String)
], GetFrsDocumentUrlResponseDto.prototype, "s3Bucket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'frs-documents/DOC001/Sales_Order_FRS.pdf' }),
    __metadata("design:type", String)
], GetFrsDocumentUrlResponseDto.prototype, "s3Key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://mvp-frs-documents.s3.us-east-1.amazonaws.com/frs-documents/DOC001/Sales_Order_FRS.pdf',
        description: 'Pre-signed GET URL valid for 1 hour. Pass this to the document parsing pipeline.',
    }),
    __metadata("design:type", String)
], GetFrsDocumentUrlResponseDto.prototype, "s3PreSignedUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3600,
        description: 'Pre-signed URL expiry in seconds',
    }),
    __metadata("design:type", Number)
], GetFrsDocumentUrlResponseDto.prototype, "expiresInSeconds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-04T10:00:00.000Z' }),
    __metadata("design:type", String)
], GetFrsDocumentUrlResponseDto.prototype, "uploadedAt", void 0);
//# sourceMappingURL=get-frs-document-url-response.dto.js.map