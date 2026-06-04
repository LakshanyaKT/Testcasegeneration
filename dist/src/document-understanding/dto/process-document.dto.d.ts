export declare class ProcessDocumentDto {
    projectId: string;
    sessionId: string;
    documentId: string;
    s3Bucket: string;
    s3Key: string;
    markdown?: string;
    fileName?: string;
    fileType?: string;
    uploadedBy?: string;
}
