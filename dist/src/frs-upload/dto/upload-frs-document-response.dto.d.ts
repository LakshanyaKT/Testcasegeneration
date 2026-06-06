export declare class UploadFrsDocumentResponseDto {
    documentId: string;
    originalFileName: string;
    mimeType: string;
    fileSizeBytes: number;
    s3Bucket: string;
    s3Key: string;
    s3PreSignedUrl: string;
    uploadedAt: string;
}
