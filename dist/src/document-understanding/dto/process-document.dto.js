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
exports.ProcessDocumentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ProcessDocumentDto {
}
exports.ProcessDocumentDto = ProcessDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the document',
        example: 'DOC001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessDocumentDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'S3 bucket name where the document is stored',
        example: 'my-documents-bucket',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessDocumentDto.prototype, "s3Bucket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'S3 object key (path) of the markdown document',
        example: 'uploads/documents/requirements-spec.md',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessDocumentDto.prototype, "s3Key", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional raw markdown content. If provided, S3 download is skipped.',
        example: '# Requirements\n\nThe system shall authenticate users via OAuth 2.0.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProcessDocumentDto.prototype, "markdown", void 0);
//# sourceMappingURL=process-document.dto.js.map