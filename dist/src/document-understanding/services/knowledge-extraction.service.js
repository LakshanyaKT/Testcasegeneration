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
var KnowledgeExtractionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeExtractionService = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const interfaces_1 = require("../interfaces");
const llm_service_1 = require("./llm.service");
const knowledge_extraction_prompt_1 = require("../prompts/knowledge-extraction.prompt");
const id_generator_util_1 = require("../utils/id-generator.util");
const RequirementSchema = zod_1.z.object({
    requirementId: zod_1.z.string().optional(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
});
const RequirementExtractionResponseSchema = zod_1.z.object({
    requirements: zod_1.z.array(RequirementSchema),
});
const TestCaseSchema = zod_1.z.object({
    testCaseId: zod_1.z.string().optional(),
    scenario: zod_1.z.string(),
    preconditions: zod_1.z.array(zod_1.z.string()).default([]),
    steps: zod_1.z.array(zod_1.z.string()).default([]),
    expectedResults: zod_1.z.array(zod_1.z.string()).default([]),
});
const TestCaseExtractionResponseSchema = zod_1.z.object({
    testCases: zod_1.z.array(TestCaseSchema),
});
const SummaryResponseSchema = zod_1.z.object({
    shortSummary: zod_1.z.string(),
    detailedSummary: zod_1.z.string(),
    confidence: zod_1.z.number().min(0).max(100),
});
let KnowledgeExtractionService = KnowledgeExtractionService_1 = class KnowledgeExtractionService {
    constructor(llmService) {
        this.llmService = llmService;
        this.logger = new common_1.Logger(KnowledgeExtractionService_1.name);
    }
    async extractKnowledge(chunk, chunkType) {
        this.logger.log(`Extracting knowledge from chunk: ${chunk.title} (type: ${chunkType})`);
        switch (chunkType) {
            case interfaces_1.ChunkType.REQUIREMENT:
                return this.extractRequirements(chunk);
            case interfaces_1.ChunkType.TEST_CASE:
                return this.extractTestCases(chunk);
            case interfaces_1.ChunkType.UNKNOWN:
            default:
                return this.extractUnknown();
        }
    }
    async generateSummary(chunk) {
        this.logger.log(`Generating summary for chunk: ${chunk.title}`);
        try {
            const response = await this.llmService.generateStructuredResponse({
                systemPrompt: knowledge_extraction_prompt_1.SUMMARY_GENERATION_SYSTEM_PROMPT,
                userPrompt: (0, knowledge_extraction_prompt_1.SUMMARY_GENERATION_USER_PROMPT)(chunk.title, chunk.content),
                temperature: 0.2,
                maxTokens: 512,
            });
            const validated = SummaryResponseSchema.parse(response);
            return {
                shortSummary: validated.shortSummary,
                detailedSummary: validated.detailedSummary,
                confidence: validated.confidence,
            };
        }
        catch (error) {
            this.logger.error(`Failed to generate summary for "${chunk.title}": ${error.message}`);
            return {
                shortSummary: chunk.title,
                detailedSummary: chunk.content.substring(0, 200),
                confidence: 0,
            };
        }
    }
    async extractRequirements(chunk) {
        try {
            const response = await this.llmService.generateStructuredResponse({
                systemPrompt: knowledge_extraction_prompt_1.REQUIREMENT_EXTRACTION_SYSTEM_PROMPT,
                userPrompt: (0, knowledge_extraction_prompt_1.REQUIREMENT_EXTRACTION_USER_PROMPT)(chunk.title, chunk.content),
                temperature: 0.1,
                maxTokens: 2048,
            });
            const validated = RequirementExtractionResponseSchema.parse(response);
            const requirements = validated.requirements.map((req, index) => ({
                requirementId: req.requirementId || (0, id_generator_util_1.generateRequirementId)(index),
                title: req.title,
                description: req.description,
            }));
            this.logger.log(`Extracted ${requirements.length} requirements from chunk: ${chunk.title}`);
            return { requirements };
        }
        catch (error) {
            this.logger.error(`Failed to extract requirements from "${chunk.title}": ${error.message}`);
            return {
                requirements: [
                    {
                        requirementId: (0, id_generator_util_1.generateRequirementId)(0),
                        title: chunk.title,
                        description: chunk.content,
                    },
                ],
            };
        }
    }
    async extractTestCases(chunk) {
        try {
            const response = await this.llmService.generateStructuredResponse({
                systemPrompt: knowledge_extraction_prompt_1.TEST_CASE_EXTRACTION_SYSTEM_PROMPT,
                userPrompt: (0, knowledge_extraction_prompt_1.TEST_CASE_EXTRACTION_USER_PROMPT)(chunk.title, chunk.content),
                temperature: 0.1,
                maxTokens: 2048,
            });
            const validated = TestCaseExtractionResponseSchema.parse(response);
            const testCases = validated.testCases.map((tc, index) => ({
                testCaseId: tc.testCaseId || (0, id_generator_util_1.generateTestCaseId)(index),
                scenario: tc.scenario,
                preconditions: tc.preconditions,
                steps: tc.steps,
                expectedResults: tc.expectedResults,
            }));
            this.logger.log(`Extracted ${testCases.length} test cases from chunk: ${chunk.title}`);
            return { testCases };
        }
        catch (error) {
            this.logger.error(`Failed to extract test cases from "${chunk.title}": ${error.message}`);
            return {
                testCases: [
                    {
                        testCaseId: (0, id_generator_util_1.generateTestCaseId)(0),
                        scenario: chunk.title,
                        preconditions: [],
                        steps: [chunk.content],
                        expectedResults: [],
                    },
                ],
            };
        }
    }
    extractUnknown() {
        return { category: 'UNKNOWN' };
    }
};
exports.KnowledgeExtractionService = KnowledgeExtractionService;
exports.KnowledgeExtractionService = KnowledgeExtractionService = KnowledgeExtractionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [llm_service_1.LLMService])
], KnowledgeExtractionService);
//# sourceMappingURL=knowledge-extraction.service.js.map