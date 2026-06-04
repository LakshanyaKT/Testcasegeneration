export declare class AnalysisMetadataDto {
    totalChunksAnalyzed: number;
    requirementChunks: number;
    testCaseChunks: number;
    processingVersion: string;
}
export declare class AnalyzeDocumentResponseDto {
    documentId: string;
    overallSummary: string;
    identifiedModules: string[];
    dependencies: string[];
    riskAreas: string[];
    missingInformation: string[];
    workflow: string[];
    metadata: AnalysisMetadataDto;
    createdAt: Date;
    updatedAt: Date;
}
