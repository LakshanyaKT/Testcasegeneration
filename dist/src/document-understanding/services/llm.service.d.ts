export interface LLMRequestOptions {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    maxTokens?: number;
}
export declare class LLMService {
    private readonly logger;
    private readonly client;
    private readonly modelId;
    constructor();
    generateStructuredResponse<T>(options: LLMRequestOptions): Promise<T>;
}
