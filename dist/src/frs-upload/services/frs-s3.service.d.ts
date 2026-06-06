export interface FrsUploadResult {
    documentId: string;
    originalFileName: string;
    mimeType: string;
    fileSizeBytes: number;
    s3Bucket: string;
    s3Key: string;
    s3PreSignedUrl: string;
    uploadedAt: string;
}
export interface FrsDocumentUrlResult {
    documentId: string;
    originalFileName: string;
    s3Bucket: string;
    s3Key: string;
    s3PreSignedUrl: string;
    expiresInSeconds: number;
    uploadedAt: string;
}
export declare class FrsS3Service {
    private readonly logger;
    private readonly s3Client;
    private readonly bucket;
    private readonly region;
    private readonly maxFileSizeBytes;
    constructor();
    uploadFrsDocument(documentId: string, originalFileName: string, mimeType: string, fileBuffer: Buffer, s3KeyOverride?: string): Promise<FrsUploadResult>;
    getFrsDocumentUrl(documentId: string, s3Key: string): Promise<FrsDocumentUrlResult>;
    private generatePresignedGetUrl;
    private validateFileType;
    private getExtension;
    private sanitizeFileName;
}
