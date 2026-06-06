export declare class GetFrsDocumentUrlResponseDto {
    documentId: string;
    originalFileName: string;
    s3Bucket: string;
    s3Key: string;
    s3PreSignedUrl: string;
    expiresInSeconds: number;
    uploadedAt: string;
}
