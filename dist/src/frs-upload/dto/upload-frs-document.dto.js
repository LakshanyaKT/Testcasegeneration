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
exports.UploadFrsDocumentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UploadFrsDocumentDto {
}
exports.UploadFrsDocumentDto = UploadFrsDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the document. Used as the S3 key prefix and document reference.',
        example: 'DOC001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadFrsDocumentDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional custom S3 key (path) to store the file under. ' +
            'If omitted, defaults to: frs-documents/<documentId>/<originalFileName>.',
        example: 'frs-documents/DOC001/Sales_Order_FRS.pdf',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UploadFrsDocumentDto.prototype, "s3KeyOverride", void 0);
//# sourceMappingURL=upload-frs-document.dto.js.map