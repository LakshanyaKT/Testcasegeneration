import { ChunkType, SemanticChunk, ExtractedData, ChunkSummary } from '../interfaces';
import { LLMService } from './llm.service';
export declare class KnowledgeExtractionService {
    private readonly llmService;
    private readonly logger;
    constructor(llmService: LLMService);
    extractKnowledge(chunk: SemanticChunk, chunkType: ChunkType): Promise<ExtractedData>;
    generateSummary(chunk: SemanticChunk): Promise<ChunkSummary>;
    private extractRequirements;
    private extractTestCases;
    private extractUnknown;
}
