export enum ChunkType {
  REQUIREMENT = 'REQUIREMENT',
  TEST_CASE = 'TEST_CASE',
  UNKNOWN = 'UNKNOWN',
}

export interface PageRange {
  startPage: number;
  endPage: number;
}

export interface Section {
  sectionId: string;
  title: string;
  content: string;
  pageRange: PageRange;
}

export interface SemanticChunk {
  chunkNumber: number;
  title: string;
  content: string;
}

export interface ChunkClassification {
  chunkType: ChunkType;
  confidence: number;
}

export interface ChunkSummary {
  shortSummary: string;
  detailedSummary: string;
  confidence: number;
}

export interface ExtractedRequirement {
  requirementId: string;
  title: string;
  description: string;
}

export interface ExtractedTestCase {
  testCaseId: string;
  scenario: string;
  preconditions: string[];
  steps: string[];
  expectedResults: string[];
}

export interface RequirementExtractedData {
  requirements: ExtractedRequirement[];
}

export interface TestCaseExtractedData {
  testCases: ExtractedTestCase[];
}

export interface UnknownExtractedData {
  category: 'UNKNOWN';
}

export type ExtractedData =
  | RequirementExtractedData
  | TestCaseExtractedData
  | UnknownExtractedData;

export interface ProcessingMetadata {
  chunkingStrategy: 'AI_SEMANTIC';
  summaryGenerated: boolean;
  extractionCompleted: boolean;
}

export interface DocumentChunkData {
  documentId: string;
  chunkNumber: number;
  chunkType: ChunkType;
  title: string;
  pageRange: PageRange;
  content: string;
  summary: ChunkSummary;
  classification: ChunkClassification;
  extractedData: ExtractedData;
  processing: ProcessingMetadata;
}
