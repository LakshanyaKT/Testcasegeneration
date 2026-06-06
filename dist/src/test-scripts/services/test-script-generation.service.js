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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TestScriptGenerationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestScriptGenerationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const zod_1 = require("zod");
const document_chunk_schema_1 = require("../../document-understanding/schemas/document-chunk.schema");
const llm_service_1 = require("../../document-understanding/services/llm.service");
const clarification_repository_1 = require("../../clarification/repositories/clarification.repository");
const test_case_type_selection_repository_1 = require("../../test-case-types/repositories/test-case-type-selection.repository");
const test_case_type_selection_schema_1 = require("../../test-case-types/schemas/test-case-type-selection.schema");
const test_script_repository_1 = require("../repositories/test-script.repository");
const test_script_schema_1 = require("../schemas/test-script.schema");
const test_script_generation_prompt_1 = require("../prompts/test-script-generation.prompt");
const GeneratedScriptSchema = zod_1.z.object({
    testCaseType: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    sourceRequirementId: zod_1.z.string().nullable().optional(),
    sourceTestCaseId: zod_1.z.string().nullable().optional(),
    preconditions: zod_1.z.array(zod_1.z.string()).default([]),
    steps: zod_1.z.array(zod_1.z.string()).min(1),
    expectedResults: zod_1.z.array(zod_1.z.string()).min(1),
    priority: zod_1.z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
});
const GenerationResponseSchema = zod_1.z.object({
    testScripts: zod_1.z.array(GeneratedScriptSchema),
});
let TestScriptGenerationService = TestScriptGenerationService_1 = class TestScriptGenerationService {
    constructor(chunkModel, llmService, clarificationRepository, typeSelectionRepository, testScriptRepository) {
        this.chunkModel = chunkModel;
        this.llmService = llmService;
        this.clarificationRepository = clarificationRepository;
        this.typeSelectionRepository = typeSelectionRepository;
        this.testScriptRepository = testScriptRepository;
        this.logger = new common_1.Logger(TestScriptGenerationService_1.name);
    }
    async generateTestScripts(documentId) {
        this.logger.log(`Starting test script generation for: ${documentId}`);
        const typeSelection = await this.typeSelectionRepository.findByDocumentId(documentId);
        if (!typeSelection) {
            throw new common_1.NotFoundException(`No test case type selection found for document: ${documentId}. Run POST /test-case-types/${documentId}/discover first.`);
        }
        if (typeSelection.status !== test_case_type_selection_schema_1.TestCaseTypeSelectionStatus.APPROVED) {
            throw new common_1.BadRequestException(`Test case types for document ${documentId} are not yet approved. ` +
                `Run POST /test-case-types/${documentId}/approve to freeze the types before generating scripts.`);
        }
        const finalTypes = typeSelection.finalTypes;
        if (!finalTypes || finalTypes.length === 0) {
            throw new common_1.BadRequestException(`No finalTypes found for document: ${documentId}.`);
        }
        const chunks = await this.chunkModel.find({ documentId }).lean().exec();
        if (!chunks || chunks.length === 0) {
            throw new common_1.NotFoundException(`No chunks found for document: ${documentId}.`);
        }
        const resolvedClarifications = await this.clarificationRepository.findResolvedByDocumentId(documentId);
        const clarificationsPayload = resolvedClarifications.map((c) => ({
            question: c.question,
            answer: c.answer ?? '',
        }));
        await this.testScriptRepository.deleteByDocumentId(documentId);
        const requirementChunks = chunks.filter((c) => c.chunkType === 'REQUIREMENT').slice(0, 1);
        const testCaseChunks = chunks.filter((c) => c.chunkType === 'TEST_CASE').slice(0, 1);
        const allScripts = [];
        let scriptIndex = 0;
        for (const chunk of requirementChunks) {
            const requirements = chunk.extractedData?.requirements;
            if (!requirements || requirements.length === 0)
                continue;
            this.logger.log(`Track A — generating scripts for chunk: ${chunk.title}`);
            try {
                const rawResult = await this.llmService.generateStructuredResponse({
                    systemPrompt: test_script_generation_prompt_1.REQUIREMENT_TRACK_SYSTEM_PROMPT,
                    userPrompt: (0, test_script_generation_prompt_1.REQUIREMENT_TRACK_USER_PROMPT)(chunk.title, finalTypes, requirements, clarificationsPayload),
                    temperature: 0.2,
                    maxTokens: 16384,
                });
                const validated = GenerationResponseSchema.parse(rawResult);
                for (const script of validated.testScripts) {
                    allScripts.push({
                        testScriptId: `TS-${documentId}-${Date.now()}-${scriptIndex++}`,
                        documentId,
                        chunkId: String(chunk._id),
                        chunkTitle: chunk.title,
                        sourceTrack: test_script_schema_1.TestScriptSourceTrack.REQUIREMENT,
                        testCaseType: script.testCaseType,
                        title: script.title,
                        sourceRequirementId: script.sourceRequirementId ?? null,
                        sourceTestCaseId: null,
                        preconditions: script.preconditions,
                        steps: script.steps,
                        expectedResults: script.expectedResults,
                        priority: script.priority,
                    });
                }
                this.logger.log(`Track A — ${validated.testScripts.length} scripts from "${chunk.title}"`);
            }
            catch (error) {
                this.logger.error(`Track A failed for chunk "${chunk.title}": ${error.message}`);
            }
        }
        const fromRequirementTrack = allScripts.length;
        for (const chunk of testCaseChunks) {
            const existingTestCases = chunk.extractedData?.testCases;
            if (!existingTestCases || existingTestCases.length === 0)
                continue;
            this.logger.log(`Track B — enriching scripts for chunk: ${chunk.title}`);
            try {
                const rawResult = await this.llmService.generateStructuredResponse({
                    systemPrompt: test_script_generation_prompt_1.TEST_CASE_TRACK_SYSTEM_PROMPT,
                    userPrompt: (0, test_script_generation_prompt_1.TEST_CASE_TRACK_USER_PROMPT)(chunk.title, finalTypes, existingTestCases, clarificationsPayload),
                    temperature: 0.2,
                    maxTokens: 16384,
                });
                const validated = GenerationResponseSchema.parse(rawResult);
                for (const script of validated.testScripts) {
                    allScripts.push({
                        testScriptId: `TS-${documentId}-${Date.now()}-${scriptIndex++}`,
                        documentId,
                        chunkId: String(chunk._id),
                        chunkTitle: chunk.title,
                        sourceTrack: test_script_schema_1.TestScriptSourceTrack.TEST_CASE,
                        testCaseType: script.testCaseType,
                        title: script.title,
                        sourceRequirementId: null,
                        sourceTestCaseId: script.sourceTestCaseId ?? null,
                        preconditions: script.preconditions,
                        steps: script.steps,
                        expectedResults: script.expectedResults,
                        priority: script.priority,
                    });
                }
                this.logger.log(`Track B — ${validated.testScripts.length} scripts from "${chunk.title}"`);
            }
            catch (error) {
                this.logger.error(`Track B failed for chunk "${chunk.title}": ${error.message}`);
            }
        }
        const fromTestCaseTrack = allScripts.length - fromRequirementTrack;
        if (allScripts.length > 0) {
            await this.testScriptRepository.insertMany(allScripts);
        }
        this.logger.log(`Generation complete for ${documentId}: ${allScripts.length} scripts ` +
            `(Track A: ${fromRequirementTrack}, Track B: ${fromTestCaseTrack})`);
        return {
            documentId,
            totalGenerated: allScripts.length,
            fromRequirementTrack,
            fromTestCaseTrack,
            testCaseTypes: finalTypes,
            testScripts: allScripts.map(this.toResponseDto),
        };
    }
    async getTestScripts(documentId) {
        const scripts = await this.testScriptRepository.findByDocumentId(documentId);
        const grouped = new Map();
        for (const s of scripts) {
            const dto = this.toResponseDto(s);
            if (!grouped.has(s.testCaseType))
                grouped.set(s.testCaseType, []);
            grouped.get(s.testCaseType).push(dto);
        }
        return {
            documentId,
            total: scripts.length,
            byType: [...grouped.entries()].map(([type, items]) => ({
                testCaseType: type,
                count: items.length,
                scripts: items,
            })),
        };
    }
    async getTestScriptsSummary(documentId) {
        const total = await this.testScriptRepository.countByDocumentId(documentId);
        if (total === 0) {
            throw new common_1.NotFoundException(`No test scripts found for document: ${documentId}. Run POST /test-scripts/${documentId}/generate first.`);
        }
        const { byType, byTrack, byPriority } = await this.testScriptRepository.aggregateSummary(documentId);
        return {
            documentId,
            totalScripts: total,
            byType,
            byTrack,
            byPriority,
            testCaseTypes: Object.keys(byType),
        };
    }
    toResponseDto(doc) {
        return {
            testScriptId: doc.testScriptId,
            documentId: doc.documentId,
            chunkId: doc.chunkId,
            chunkTitle: doc.chunkTitle,
            sourceTrack: doc.sourceTrack,
            testCaseType: doc.testCaseType,
            title: doc.title,
            sourceRequirementId: doc.sourceRequirementId ?? null,
            sourceTestCaseId: doc.sourceTestCaseId ?? null,
            preconditions: doc.preconditions,
            steps: doc.steps,
            expectedResults: doc.expectedResults,
            priority: doc.priority,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
};
exports.TestScriptGenerationService = TestScriptGenerationService;
exports.TestScriptGenerationService = TestScriptGenerationService = TestScriptGenerationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(document_chunk_schema_1.DocumentChunk.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        llm_service_1.LLMService,
        clarification_repository_1.ClarificationRepository,
        test_case_type_selection_repository_1.TestCaseTypeSelectionRepository,
        test_script_repository_1.TestScriptRepository])
], TestScriptGenerationService);
//# sourceMappingURL=test-script-generation.service.js.map