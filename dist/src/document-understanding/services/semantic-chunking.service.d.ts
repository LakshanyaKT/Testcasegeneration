import { Section, SemanticChunk } from '../interfaces';
import { LLMService } from './llm.service';
export declare class SemanticChunkingService {
    private readonly llmService;
    private readonly logger;
    constructor(llmService: LLMService);
    chunkSection(section: Section): Promise<SemanticChunk[]>;
    private fallbackChunking;
}
