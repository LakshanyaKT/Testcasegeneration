export interface DocumentAnalysisResult {
    documentId: string;
    overallSummary: string;
    identifiedModules: string[];
    dependencies: string[];
    riskAreas: string[];
    missingInformation: string[];
    workflow: string[];
}
export interface AnalysisMetadata {
    totalChunksAnalyzed: number;
    requirementChunks: number;
    testCaseChunks: number;
    processingVersion: string;
}
export interface ChunkAggregation {
    chunkId: string;
    title: string;
    chunkType: string;
    shortSummary: string;
    detailedSummary: string;
    content: string;
    requirements?: Array<{
        requirementId: string;
        title: string;
        description: string;
    }>;
    testCases?: Array<{
        testCaseId: string;
        scenario: string;
        preconditions: string[];
        steps: string[];
        expectedResults: string[];
    }>;
}
