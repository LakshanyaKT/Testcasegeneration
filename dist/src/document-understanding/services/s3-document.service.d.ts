export declare class S3DocumentService {
    private readonly logger;
    private readonly s3Client;
    private readonly maxDocumentBytes;
    constructor();
    downloadDocumentBuffer(bucket: string, key: string): Promise<Buffer>;
}
