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
var ClarificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClarificationService = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const llm_service_1 = require("../../document-understanding/services/llm.service");
const document_analysis_repository_1 = require("../../analysis/repositories/document-analysis.repository");
const document_analysis_service_1 = require("../../analysis/services/document-analysis.service");
const clarification_repository_1 = require("../repositories/clarification.repository");
const clarification_schema_1 = require("../schemas/clarification.schema");
const clarification_prompt_1 = require("../prompts/clarification.prompt");
const ClarificationItemSchema = zod_1.z.object({
    question: zod_1.z.string().min(1),
    reason: zod_1.z.string().min(1),
});
const ClarificationGenerationResponseSchema = zod_1.z.object({
    clarifications: zod_1.z.array(ClarificationItemSchema),
});
const RankedClarificationSchema = zod_1.z.object({
    clarificationId: zod_1.z.string(),
    priorityRank: zod_1.z.number().int().positive(),
    priorityReason: zod_1.z.string().min(1),
});
const PriorityResponseSchema = zod_1.z.object({
    rankedClarifications: zod_1.z.array(RankedClarificationSchema),
});
let ClarificationService = ClarificationService_1 = class ClarificationService {
    constructor(llmService, analysisRepository, documentAnalysisService, clarificationRepository) {
        this.llmService = llmService;
        this.analysisRepository = analysisRepository;
        this.documentAnalysisService = documentAnalysisService;
        this.clarificationRepository = clarificationRepository;
        this.logger = new common_1.Logger(ClarificationService_1.name);
    }
    async generateClarifications(documentId) {
        this.logger.log(`Generating clarifications for document: ${documentId}`);
        const analysis = await this.analysisRepository.findByDocumentId(documentId);
        if (!analysis) {
            throw new common_1.NotFoundException(`No analysis found for document: ${documentId}. Run POST /document-understanding/${documentId}/analyze first.`);
        }
        if (!analysis.missingInformation || analysis.missingInformation.length === 0) {
            this.logger.log(`No missing information found for ${documentId}, returning empty set`);
            return { documentId, totalGenerated: 0, clarifications: [] };
        }
        const rawResult = await this.llmService.generateStructuredResponse({
            systemPrompt: clarification_prompt_1.CLARIFICATION_GENERATION_SYSTEM_PROMPT,
            userPrompt: (0, clarification_prompt_1.CLARIFICATION_GENERATION_USER_PROMPT)(documentId, analysis.overallSummary, analysis.missingInformation, analysis.riskAreas),
            temperature: 0.2,
            maxTokens: 4096,
        });
        const validated = ClarificationGenerationResponseSchema.parse(rawResult);
        const saved = await this.clarificationRepository.createMany(documentId, validated.clarifications);
        this.logger.log(`Generated and stored ${saved.length} clarifications for ${documentId}`);
        return {
            documentId,
            totalGenerated: saved.length,
            clarifications: saved.map(this.toResponseDto),
        };
    }
    async prioritizeClarifications(documentId, topK = 3) {
        this.logger.log(`Prioritizing clarifications for document: ${documentId}, topK: ${topK}`);
        const analysis = await this.analysisRepository.findByDocumentId(documentId);
        if (!analysis) {
            throw new common_1.NotFoundException(`No analysis found for document: ${documentId}. Run analysis first.`);
        }
        const pendingQuestions = await this.clarificationRepository.findPendingByDocumentId(documentId);
        if (pendingQuestions.length === 0) {
            throw new common_1.BadRequestException(`No PENDING clarification questions found for document: ${documentId}. Generate them first via POST /clarifications/${documentId}/generate`);
        }
        const clampedTopK = Math.min(topK, pendingQuestions.length);
        const questionsPayload = pendingQuestions.map((q) => ({
            clarificationId: q.clarificationId,
            question: q.question,
            reason: q.reason,
        }));
        const rawResult = await this.llmService.generateStructuredResponse({
            systemPrompt: clarification_prompt_1.CLARIFICATION_PRIORITY_SYSTEM_PROMPT,
            userPrompt: (0, clarification_prompt_1.CLARIFICATION_PRIORITY_USER_PROMPT)(documentId, analysis.overallSummary, analysis.riskAreas, analysis.workflow, clampedTopK, questionsPayload),
            temperature: 0.1,
            maxTokens: 4096,
        });
        const validated = PriorityResponseSchema.parse(rawResult);
        const topRanked = validated.rankedClarifications.slice(0, clampedTopK);
        const batchId = `PRI-${documentId}-${Date.now()}`;
        const rankUpdates = topRanked.map((r) => ({
            clarificationId: r.clarificationId,
            priorityRank: r.priorityRank,
            priorityBatch: batchId,
            priorityReason: r.priorityReason,
        }));
        await this.clarificationRepository.applyPriorityRanks(rankUpdates);
        const updated = await this.clarificationRepository.findPrioritizedByDocumentId(documentId, batchId);
        this.logger.log(`Prioritized ${updated.length} of ${pendingQuestions.length} questions (batchId: ${batchId})`);
        return {
            documentId,
            priorityBatchId: batchId,
            topK: clampedTopK,
            totalEvaluated: pendingQuestions.length,
            prioritizedQuestions: updated.map(this.toResponseDto),
        };
    }
    async getPrioritizedClarifications(documentId) {
        const questions = await this.clarificationRepository.findLatestPrioritizedBatch(documentId);
        if (questions.length === 0) {
            throw new common_1.NotFoundException(`No prioritized questions found for document: ${documentId}. Run POST /clarifications/${documentId}/prioritize first.`);
        }
        const batchId = questions[0].priorityBatch;
        return {
            documentId,
            priorityBatchId: batchId,
            total: questions.length,
            questions: questions.map(this.toResponseDto),
        };
    }
    async getClarifications(documentId) {
        const records = await this.clarificationRepository.findByDocumentId(documentId);
        return {
            documentId,
            total: records.length,
            clarifications: records.map(this.toResponseDto),
        };
    }
    async respondToClarification(clarificationId, answer) {
        this.logger.log(`Processing response for clarification: ${clarificationId}`);
        const existing = await this.clarificationRepository.findById(clarificationId);
        if (!existing) {
            throw new common_1.NotFoundException(`Clarification not found: ${clarificationId}`);
        }
        if (existing.status === clarification_schema_1.ClarificationStatus.RESOLVED) {
            throw new common_1.BadRequestException(`Clarification ${clarificationId} is already RESOLVED.`);
        }
        if (existing.status === clarification_schema_1.ClarificationStatus.REJECTED) {
            throw new common_1.BadRequestException(`Clarification ${clarificationId} is REJECTED and cannot be answered.`);
        }
        const answered = await this.clarificationRepository.updateAnswer(clarificationId, answer, clarification_schema_1.ClarificationStatus.ANSWERED);
        if (!answered) {
            throw new common_1.NotFoundException(`Failed to update clarification: ${clarificationId}`);
        }
        const updatedAnalysis = await this.documentAnalysisService.updateAnalysisWithClarification(existing.documentId, existing.question, answer);
        const resolved = await this.clarificationRepository.markResolved(clarificationId);
        this.logger.log(`Clarification ${clarificationId} resolved, analysis updated for ${existing.documentId}`);
        return {
            clarification: this.toResponseDto(resolved),
            updatedAnalysis,
        };
    }
    toResponseDto(doc) {
        return {
            clarificationId: doc.clarificationId,
            documentId: doc.documentId,
            question: doc.question,
            reason: doc.reason,
            answer: doc.answer,
            status: doc.status,
            priorityRank: doc.priorityRank ?? null,
            priorityBatch: doc.priorityBatch ?? null,
            priorityReason: doc.priorityReason ?? null,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
};
exports.ClarificationService = ClarificationService;
exports.ClarificationService = ClarificationService = ClarificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [llm_service_1.LLMService,
        document_analysis_repository_1.DocumentAnalysisRepository,
        document_analysis_service_1.DocumentAnalysisService,
        clarification_repository_1.ClarificationRepository])
], ClarificationService);
//# sourceMappingURL=clarification.service.js.map