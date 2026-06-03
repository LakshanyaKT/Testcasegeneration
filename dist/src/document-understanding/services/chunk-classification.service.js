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
var ChunkClassificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChunkClassificationService = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const interfaces_1 = require("../interfaces");
const llm_service_1 = require("./llm.service");
const chunk_classification_prompt_1 = require("../prompts/chunk-classification.prompt");
const ClassificationResponseSchema = zod_1.z.object({
    chunkType: zod_1.z.enum(['REQUIREMENT', 'TEST_CASE', 'UNKNOWN']),
    confidence: zod_1.z.number().min(0).max(100),
    reasoning: zod_1.z.string().optional(),
});
let ChunkClassificationService = ChunkClassificationService_1 = class ChunkClassificationService {
    constructor(llmService) {
        this.llmService = llmService;
        this.logger = new common_1.Logger(ChunkClassificationService_1.name);
    }
    async classifyChunk(chunk) {
        this.logger.log(`Classifying chunk: ${chunk.title}`);
        try {
            const response = await this.llmService.generateStructuredResponse({
                systemPrompt: chunk_classification_prompt_1.CHUNK_CLASSIFICATION_SYSTEM_PROMPT,
                userPrompt: (0, chunk_classification_prompt_1.CHUNK_CLASSIFICATION_USER_PROMPT)(chunk.title, chunk.content),
                temperature: 0.05,
            });
            const validated = ClassificationResponseSchema.parse(response);
            this.logger.log(`Chunk "${chunk.title}" classified as ${validated.chunkType} (confidence: ${validated.confidence}%)`);
            return {
                chunkType: validated.chunkType,
                confidence: validated.confidence,
            };
        }
        catch (error) {
            this.logger.error(`Failed to classify chunk "${chunk.title}": ${error.message}`);
            return {
                chunkType: interfaces_1.ChunkType.UNKNOWN,
                confidence: 0,
            };
        }
    }
};
exports.ChunkClassificationService = ChunkClassificationService;
exports.ChunkClassificationService = ChunkClassificationService = ChunkClassificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [llm_service_1.LLMService])
], ChunkClassificationService);
//# sourceMappingURL=chunk-classification.service.js.map