import { Model } from 'mongoose';
import { TestScript, TestScriptDocument } from '../schemas/test-script.schema';
export declare class TestScriptRepository {
    private readonly model;
    private readonly logger;
    constructor(model: Model<TestScriptDocument>);
    insertMany(scripts: Partial<TestScript>[]): Promise<TestScriptDocument[]>;
    deleteByDocumentId(documentId: string): Promise<void>;
    findByDocumentId(documentId: string): Promise<TestScriptDocument[]>;
    countByDocumentId(documentId: string): Promise<number>;
    aggregateSummary(documentId: string): Promise<{
        byType: Record<string, number>;
        byTrack: Record<string, number>;
        byPriority: Record<string, number>;
    }>;
}
