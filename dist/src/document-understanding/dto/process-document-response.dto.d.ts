import { ChunkType, PageRange, ChunkSummary, ExtractedData, ProcessingMetadata } from '../interfaces';
export declare class PageRangeDto {
    startPage: number;
    endPage: number;
}
export declare class ChunkSummaryDto {
    shortSummary: string;
    detailedSummary: string;
    confidence: number;
}
export declare class ClassificationDto {
    confidence: number;
}
export declare class ProcessingDto {
    chunkingStrategy: string;
    summaryGenerated: boolean;
    extractionCompleted: boolean;
}
export declare class ChunkResponseDto {
    _id: string;
    documentId: string;
    chunkNumber: number;
    chunkType: ChunkType;
    title: string;
    pageRange: PageRange;
    content: string;
    summary: ChunkSummary;
    classification: {
        confidence: number;
    };
    extractedData: ExtractedData;
    processing: ProcessingMetadata;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProcessDocumentResponseDto {
    totalChunks: number;
    requirementChunks: number;
    testCaseChunks: number;
    unknownChunks: number;
    chunks: ChunkResponseDto[];
}
