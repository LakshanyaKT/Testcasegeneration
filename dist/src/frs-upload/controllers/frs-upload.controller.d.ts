import { FrsS3Service } from '../services/frs-s3.service';
import { UploadFrsDocumentResponseDto, GetFrsDocumentUrlResponseDto } from '../dto';
export declare class FrsUploadController {
    private readonly frsS3Service;
    private readonly logger;
    constructor(frsS3Service: FrsS3Service);
    uploadFrsDocument(documentId: string, file: Express.Multer.File, s3KeyOverride?: string): Promise<UploadFrsDocumentResponseDto>;
    getFrsDocumentUrl(documentId: string, s3Key: string): Promise<GetFrsDocumentUrlResponseDto>;
}
