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
var TestCaseTypeDiscoveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseTypeDiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const zod_1 = require("zod");
const document_chunk_schema_1 = require("../../document-understanding/schemas/document-chunk.schema");
const llm_service_1 = require("../../document-understanding/services/llm.service");
const document_analysis_repository_1 = require("../../analysis/repositories/document-analysis.repository");
const clarification_repository_1 = require("../../clarification/repositories/clarification.repository");
const test_case_type_selection_repository_1 = require("../repositories/test-case-type-selection.repository");
const test_case_type_discovery_prompt_1 = require("../prompts/test-case-type-discovery.prompt");
const DiscoveryResultSchema = zod_1.z.object({
    detectedTypes: zod_1.z.array(zod_1.z.string().min(1)),
    suggestedTypes: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.string().min(1),
        reason: zod_1.z.string().min(1),
    })).min(2).max(3),
});
let TestCaseTypeDiscoveryService = TestCaseTypeDiscoveryService_1 = class TestCaseTypeDiscoveryService {
    constructor(chunkModel, llmService, analysisRepository, clarificationRepository, selectionRepository) {
        this.chunkModel = chunkModel;
        this.llmService = llmService;
        this.analysisRepository = analysisRepository;
        this.clarificationRepository = clarificationRepository;
        this.selectionRepository = selectionRepository;
        this.logger = new common_1.Logger(TestCaseTypeDiscoveryService_1.name);
    }
    async discoverTestCaseTypes(documentId) {
        this.logger.log(`Discovering test case types for: ${documentId}`);
        const analysis = await this.analysisRepository.findByDocumentId(documentId);
        if (!analysis) {
            throw new common_1.NotFoundException(`No analysis found for document: ${documentId}. Run POST /document-understanding/${documentId}/analyze first.`);
        }
        const chunks = await this.chunkModel.find({ documentId }).lean().exec();
        if (!chunks || chunks.length === 0) {
            throw new common_1.BadRequestException(`No chunks found for document: ${documentId}.`);
        }
        const resolvedClarifications = await this.clarificationRepository.findResolvedByDocumentId(documentId);
        const requirementsSample = this.buildSample(chunks.filter((c) => c.chunkType === 'REQUIREMENT'), 'requirements', 3000);
        const testCasesSample = this.buildSample(chunks.filter((c) => c.chunkType === 'TEST_CASE'), 'testCases', 3000);
        const clarificationsPayload = resolvedClarifications.map((c) => ({
            question: c.question,
            answer: c.answer ?? '',
        }));
        const rawResult = await this.llmService.generateStructuredResponse({
            systemPrompt: test_case_type_discovery_prompt_1.TEST_CASE_TYPE_DISCOVERY_SYSTEM_PROMPT,
            userPrompt: (0, test_case_type_discovery_prompt_1.TEST_CASE_TYPE_DISCOVERY_USER_PROMPT)(documentId, analysis.overallSummary, analysis.identifiedModules, analysis.riskAreas, analysis.workflow, clarificationsPayload, requirementsSample, testCasesSample),
            temperature: 0.2,
            maxTokens: 4096,
        });
        const validated = DiscoveryResultSchema.parse(rawResult);
        const saved = await this.selectionRepository.upsertDiscovery(documentId, validated.detectedTypes, validated.suggestedTypes);
        this.logger.log(`Discovered ${validated.detectedTypes.length} types, suggested ${validated.suggestedTypes.length} for ${documentId}`);
        return this.toResponseDto(saved);
    }
    async getTypeSelection(documentId) {
        const record = await this.selectionRepository.findByDocumentId(documentId);
        if (!record) {
            throw new common_1.NotFoundException(`No type selection found for document: ${documentId}. Run POST /test-case-types/${documentId}/discover first.`);
        }
        return this.toResponseDto(record);
    }
    async approveTypes(documentId, approvedTypes) {
        this.logger.log(`Approving test case types for: ${documentId}`);
        const record = await this.selectionRepository.findByDocumentId(documentId);
        if (!record) {
            throw new common_1.NotFoundException(`No type selection found for document: ${documentId}. Run discover first.`);
        }
        const allowedTypes = new Set([
            ...record.detectedTypes,
            ...record.suggestedTypes.map((s) => s.type),
        ]);
        const invalidTypes = approvedTypes.filter((t) => !allowedTypes.has(t));
        if (invalidTypes.length > 0) {
            throw new common_1.BadRequestException(`Invalid types submitted: [${invalidTypes.join(', ')}]. ` +
                `Allowed types are: [${[...allowedTypes].join(', ')}]`);
        }
        const updated = await this.selectionRepository.approve(documentId, approvedTypes);
        if (!updated) {
            throw new common_1.NotFoundException(`Failed to update type selection for: ${documentId}`);
        }
        this.logger.log(`Types approved for ${documentId}: [${approvedTypes.join(', ')}]`);
        return this.toResponseDto(updated);
    }
    buildSample(chunks, dataKey, maxChars) {
        let result = '';
        for (const chunk of chunks) {
            const items = chunk.extractedData?.[dataKey];
            if (!items || items.length === 0)
                continue;
            const chunkText = `[${chunk.title}]\n${JSON.stringify(items, null, 2)}\n\n`;
            if (result.length + chunkText.length > maxChars)
                break;
            result += chunkText;
        }
        return result || 'None available.';
    }
    toResponseDto(doc) {
        return {
            documentId: doc.documentId,
            detectedTypes: doc.detectedTypes,
            suggestedTypes: doc.suggestedTypes,
            finalTypes: doc.finalTypes,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
};
exports.TestCaseTypeDiscoveryService = TestCaseTypeDiscoveryService;
exports.TestCaseTypeDiscoveryService = TestCaseTypeDiscoveryService = TestCaseTypeDiscoveryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(document_chunk_schema_1.DocumentChunk.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        llm_service_1.LLMService,
        document_analysis_repository_1.DocumentAnalysisRepository,
        clarification_repository_1.ClarificationRepository,
        test_case_type_selection_repository_1.TestCaseTypeSelectionRepository])
], TestCaseTypeDiscoveryService);
//# sourceMappingURL=test-case-type-discovery.service.js.map