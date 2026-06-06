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
var FrsS3Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrsS3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_2 = require("@aws-sdk/client-s3");
const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/markdown',
    'text/plain',
    'text/x-markdown',
]);
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.md', '.markdown', '.txt']);
const PRESIGNED_URL_EXPIRY_SECONDS = 3600;
let FrsS3Service = FrsS3Service_1 = class FrsS3Service {
    constructor() {
        this.logger = new common_1.Logger(FrsS3Service_1.name);
        this.region = process.env.AWS_REGION || 'us-east-1';
        this.bucket = process.env.FRS_S3_BUCKET || 'mvp-frs-documents';
        this.maxFileSizeBytes = parseInt(process.env.MAX_DOCUMENT_BYTES || '209715200', 10);
        this.s3Client = new client_s3_1.S3Client({ region: this.region });
        this.logger.log(`FrsS3Service initialized (bucket: ${this.bucket}, region: ${this.region})`);
    }
    async uploadFrsDocument(documentId, originalFileName, mimeType, fileBuffer, s3KeyOverride) {
        this.logger.log(`Uploading FRS document: ${originalFileName} for documentId: ${documentId}`);
        this.validateFileType(originalFileName, mimeType);
        if (fileBuffer.length > this.maxFileSizeBytes) {
            throw new common_1.BadRequestException(`File size (${fileBuffer.length} bytes) exceeds maximum allowed size of ${this.maxFileSizeBytes} bytes.`);
        }
        if (fileBuffer.length === 0) {
            throw new common_1.BadRequestException('Uploaded file is empty.');
        }
        const s3Key = s3KeyOverride ??
            `frs-documents/${documentId}/${this.sanitizeFileName(originalFileName)}`;
        const putCommand = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: s3Key,
            Body: fileBuffer,
            ContentType: mimeType,
            Metadata: {
                documentId,
                originalFileName,
                uploadedAt: new Date().toISOString(),
            },
        });
        try {
            await this.s3Client.send(putCommand);
            this.logger.log(`Successfully uploaded to s3://${this.bucket}/${s3Key} (${fileBuffer.length} bytes)`);
        }
        catch (error) {
            this.logger.error(`S3 upload failed: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to upload document to S3: ${error.message}`);
        }
        const s3PreSignedUrl = await this.generatePresignedGetUrl(s3Key);
        return {
            documentId,
            originalFileName,
            mimeType,
            fileSizeBytes: fileBuffer.length,
            s3Bucket: this.bucket,
            s3Key,
            s3PreSignedUrl,
            uploadedAt: new Date().toISOString(),
        };
    }
    async getFrsDocumentUrl(documentId, s3Key) {
        this.logger.log(`Fetching pre-signed URL for documentId: ${documentId}, key: ${s3Key}`);
        let uploadedAt;
        let originalFileName;
        try {
            const headCommand = new client_s3_1.HeadObjectCommand({
                Bucket: this.bucket,
                Key: s3Key,
            });
            const headResponse = await this.s3Client.send(headCommand);
            uploadedAt = headResponse.Metadata?.['uploadedat'] ?? headResponse.LastModified?.toISOString() ?? new Date().toISOString();
            originalFileName = headResponse.Metadata?.['originalfilename'] ?? s3Key.split('/').pop() ?? s3Key;
        }
        catch (error) {
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                throw new common_1.NotFoundException(`Document not found in S3: s3://${this.bucket}/${s3Key}. ` +
                    `Ensure the document was uploaded first via POST /frs-upload`);
            }
            this.logger.error(`HeadObject failed for key ${s3Key}: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to access document in S3: ${error.message}`);
        }
        const s3PreSignedUrl = await this.generatePresignedGetUrl(s3Key);
        this.logger.log(`Pre-signed URL generated for s3://${this.bucket}/${s3Key} (expires in ${PRESIGNED_URL_EXPIRY_SECONDS}s)`);
        return {
            documentId,
            originalFileName,
            s3Bucket: this.bucket,
            s3Key,
            s3PreSignedUrl,
            expiresInSeconds: PRESIGNED_URL_EXPIRY_SECONDS,
            uploadedAt,
        };
    }
    async generatePresignedGetUrl(s3Key) {
        const getCommand = new client_s3_2.GetObjectCommand({
            Bucket: this.bucket,
            Key: s3Key,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, getCommand, {
            expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
        });
    }
    validateFileType(fileName, mimeType) {
        const ext = this.getExtension(fileName);
        if (!ALLOWED_EXTENSIONS.has(ext)) {
            throw new common_1.UnsupportedMediaTypeException(`Unsupported file extension "${ext}". Allowed: ${[...ALLOWED_EXTENSIONS].join(', ')}`);
        }
        const normalizedMime = mimeType.split(';')[0].trim().toLowerCase();
        if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
            throw new common_1.UnsupportedMediaTypeException(`Unsupported MIME type "${normalizedMime}". Allowed: ${[...ALLOWED_MIME_TYPES].join(', ')}`);
        }
    }
    getExtension(fileName) {
        const lastDot = fileName.lastIndexOf('.');
        if (lastDot === -1)
            return '';
        return fileName.slice(lastDot).toLowerCase();
    }
    sanitizeFileName(fileName) {
        return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    }
};
exports.FrsS3Service = FrsS3Service;
exports.FrsS3Service = FrsS3Service = FrsS3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FrsS3Service);
//# sourceMappingURL=frs-s3.service.js.map