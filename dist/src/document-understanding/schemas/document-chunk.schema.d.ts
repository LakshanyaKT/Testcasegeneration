import { Document, HydratedDocument } from 'mongoose';
import { ChunkType } from '../interfaces';
export type DocumentChunkDocument = HydratedDocument<DocumentChunk>;
export declare class DocumentChunk extends Document {
    documentId: string;
    chunkNumber: number;
    chunkType: ChunkType;
    title: string;
    pageRange: {
        startPage: number;
        endPage: number;
    };
    content: string;
    summary: {
        shortSummary: string;
        detailedSummary: string;
        confidence: number;
    };
    classification: {
        confidence: number;
    };
    extractedData: Record<string, any>;
    processing: {
        chunkingStrategy: string;
        summaryGenerated: boolean;
        extractionCompleted: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const DocumentChunkSchema: import("mongoose").Schema<DocumentChunk, import("mongoose").Model<DocumentChunk, any, any, any, Document<unknown, any, DocumentChunk, any, {}> & DocumentChunk & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DocumentChunk, Document<unknown, {}, import("mongoose").FlatRecord<DocumentChunk>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<DocumentChunk> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
