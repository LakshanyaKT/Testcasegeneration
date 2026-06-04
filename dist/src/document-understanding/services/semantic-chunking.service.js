"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SemanticChunkingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticChunkingService = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const llm_service_1 = require("./llm.service");
const semantic_chunking_prompt_1 = require("../prompts/semantic-chunking.prompt");
const SemanticChunkSchema = zod_1.z.object({
    chunkNumber: zod_1.z.number(),
    title: zod_1.z.string(),
    content: zod_1.z.string(),
});
const SemanticChunkingResponseSchema = zod_1.z.object({
    chunks: zod_1.z.array(SemanticChunkSchema),
});
let SemanticChunkingService = SemanticChunkingService_1 = class SemanticChunkingService {
    constructor(llmService) {
        this.llmService = llmService;
        this.logger = new common_1.Logger(SemanticChunkingService_1.name);
    }
    async chunkSection(section) {
        this.logger.log(`Chunking section: ${section.title}`);
        if (section.content.length < 100) {
            return [
                {
                    chunkNumber: 1,
                    title: section.title,
                    content: section.content,
                },
            ];
        }
        try {
            const response = await this.llmService.generateStructuredResponse({
                systemPrompt: semantic_chunking_prompt_1.SEMANTIC_CHUNKING_SYSTEM_PROMPT,
                userPrompt: (0, semantic_chunking_prompt_1.SEMANTIC_CHUNKING_USER_PROMPT)(section.title, section.content),
                temperature: 0.1,
                maxTokens: 4096,
            });
            const validated = SemanticChunkingResponseSchema.parse(response);
            if (!validated.chunks || validated.chunks.length === 0) {
                this.logger.warn(`No chunks returned for section: ${section.title}, using fallback`);
                return this.fallbackChunking(section);
            }
            this.logger.log(`Section "${section.title}" split into ${validated.chunks.length} chunks`);
            return validated.chunks;
        }
        catch (error) {
            this.logger.error(`Failed to chunk section "${section.title}": ${error.message}`);
            return this.fallbackChunking(section);
        }
    }
    fallbackChunking(section) {
        this.logger.warn(`Using fallback chunking for section: ${section.title}`);
        const paragraphs = section.content
            .split(/\n\n+/)
            .filter((p) => p.trim().length > 0);
        if (paragraphs.length <= 1) {
            return [
                {
                    chunkNumber: 1,
                    title: section.title,
                    content: section.content,
                },
            ];
        }
        return paragraphs.map((paragraph, index) => ({
            chunkNumber: index + 1,
            title: `${section.title} - Part ${index + 1}`,
            content: paragraph.trim(),
        }));
    }
};
exports.SemanticChunkingService = SemanticChunkingService;
exports.SemanticChunkingService = SemanticChunkingService = SemanticChunkingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [llm_service_1.LLMService])
], SemanticChunkingService);
//# sourceMappingURL=semantic-chunking.service.js.map