import { TestScriptPriority, TestScriptSourceTrack } from '../schemas/test-script.schema';
export declare class TestScriptResponseDto {
    testScriptId: string;
    documentId: string;
    chunkId: string;
    chunkTitle: string;
    sourceTrack: TestScriptSourceTrack;
    testCaseType: string;
    title: string;
    sourceRequirementId: string | null;
    sourceTestCaseId: string | null;
    preconditions: string[];
    steps: string[];
    expectedResults: string[];
    priority: TestScriptPriority;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GenerateTestScriptsResponseDto {
    documentId: string;
    totalGenerated: number;
    fromRequirementTrack: number;
    fromTestCaseTrack: number;
    testCaseTypes: string[];
    testScripts: TestScriptResponseDto[];
}
export declare class TestScriptsByTypeDto {
    testCaseType: string;
    count: number;
    scripts: TestScriptResponseDto[];
}
export declare class GetTestScriptsResponseDto {
    documentId: string;
    total: number;
    byType: TestScriptsByTypeDto[];
}
export declare class TestScriptsSummaryDto {
    documentId: string;
    totalScripts: number;
    byType: Record<string, number>;
    byTrack: Record<string, number>;
    byPriority: Record<string, number>;
    testCaseTypes: string[];
}
