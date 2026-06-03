import { ChunkClassification, SemanticChunk } from '../interfaces';
import { LLMService } from './llm.service';
export declare class ChunkClassificationService {
    private readonly llmService;
    private readonly logger;
    constructor(llmService: LLMService);
    classifyChunk(chunk: SemanticChunk): Promise<ChunkClassification>;
}
