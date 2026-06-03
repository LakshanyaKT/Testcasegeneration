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
var S3DocumentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3DocumentService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
let S3DocumentService = S3DocumentService_1 = class S3DocumentService {
    constructor() {
        this.logger = new common_1.Logger(S3DocumentService_1.name);
        const region = process.env.AWS_REGION || 'us-east-1';
        this.maxDocumentBytes = parseInt(process.env.MAX_DOCUMENT_BYTES || '209715200', 10);
        this.s3Client = new client_s3_1.S3Client({ region });
        this.logger.log(`S3 Document Service initialized (region: ${region})`);
    }
    async downloadDocumentBuffer(bucket, key) {
        this.logger.log(`Downloading document from s3://${bucket}/${key}`);
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: bucket,
                Key: key,
            });
            const response = await this.s3Client.send(command);
            if (response.ContentLength && response.ContentLength > this.maxDocumentBytes) {
                throw new common_1.BadRequestException(`Document size (${response.ContentLength} bytes) exceeds maximum allowed size (${this.maxDocumentBytes} bytes)`);
            }
            if (!response.Body) {
                throw new Error(`Empty response body for s3://${bucket}/${key}`);
            }
            const byteArray = await response.Body.transformToByteArray();
            const buffer = Buffer.from(byteArray);
            this.logger.log(`Downloaded document from s3://${bucket}/${key} (${buffer.length} bytes)`);
            return buffer;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Failed to download document from s3://${bucket}/${key}: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to download document from S3: ${error.message}`);
        }
    }
};
exports.S3DocumentService = S3DocumentService;
exports.S3DocumentService = S3DocumentService = S3DocumentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3DocumentService);
//# sourceMappingURL=s3-document.service.js.map