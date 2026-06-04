import { Model } from 'mongoose';
import { DocumentAnalysisDocument } from '../schemas/document-analysis.schema';
import { DocumentAnalysisResult, AnalysisMetadata } from '../interfaces';
export declare class DocumentAnalysisRepository {
    private readonly analysisModel;
    private readonly logger;
    constructor(analysisModel: Model<DocumentAnalysisDocument>);
    upsert(result: DocumentAnalysisResult, metadata: AnalysisMetadata): Promise<DocumentAnalysisDocument>;
    findByDocumentId(documentId: string): Promise<DocumentAnalysisDocument | null>;
}
