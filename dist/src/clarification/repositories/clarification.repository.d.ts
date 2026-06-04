import { Model } from 'mongoose';
import { ClarificationDocument, ClarificationStatus } from '../schemas/clarification.schema';
import { GeneratedClarification } from '../interfaces';
export declare class ClarificationRepository {
    private readonly clarificationModel;
    private readonly logger;
    constructor(clarificationModel: Model<ClarificationDocument>);
    createMany(documentId: string, items: GeneratedClarification[]): Promise<ClarificationDocument[]>;
    findByDocumentId(documentId: string): Promise<ClarificationDocument[]>;
    findById(clarificationId: string): Promise<ClarificationDocument | null>;
    updateAnswer(clarificationId: string, answer: string, status: ClarificationStatus): Promise<ClarificationDocument | null>;
    markResolved(clarificationId: string): Promise<ClarificationDocument | null>;
}
