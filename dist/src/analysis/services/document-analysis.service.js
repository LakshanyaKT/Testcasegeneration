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
var DocumentAnalysisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const zod_1 = require("zod");
const document_chunk_schema_1 = require("../../document-understanding/schemas/document-chunk.schema");
const llm_service_1 = require("../../document-understanding/services/llm.service");
const document_analysis_repository_1 = require("../repositories/document-analysis.repository");
const document_analysis_prompt_1 = require("../prompts/document-analysis.prompt");
const DocumentAnalysisResultSchema = zod_1.z.object({
    documentId: zod_1.z.string(),
    overallSummary: zod_1.z.string(),
    identifiedModules: zod_1.z.array(zod_1.z.string()),
    dependencies: zod_1.z.array(zod_1.z.string()),
    riskAreas: zod_1.z.array(zod_1.z.string()),
    missingInformation: zod_1.z.array(zod_1.z.string()),
    workflow: zod_1.z.array(zod_1.z.string()),
});
let DocumentAnalysisService = DocumentAnalysisService_1 = class DocumentAnalysisService {
    constructor(chunkModel, llmService, analysisRepository) {
        this.chunkModel = chunkModel;
        this.llmService = llmService;
        this.analysisRepository = analysisRepository;
        this.logger = new common_1.Logger(DocumentAnalysisService_1.name);
    }
    async analyzeDocument(documentId) {
        this.logger.log(`Starting document analysis for: ${documentId}`);
        this.logger.log(`Fetching chunks from MongoDB for: ${documentId}`);
        const chunks = await this.chunkModel
            .find({ documentId })
            .sort({ chunkNumber: 1 })
            .lean()
            .exec();
        if (!chunks || chunks.length === 0) {
            throw new common_1.NotFoundException(`No chunks found for document: ${documentId}. Process the document first.`);
        }
        this.logger.log(`Found ${chunks.length} chunks, aggregating and calling Bedrock...`);
        const aggregations = this.aggregateChunks(chunks);
        const chunksPayload = JSON.stringify(aggregations, null, 2);
        const rawResult = await this.llmService.generateStructuredResponse({
            systemPrompt: document_analysis_prompt_1.DOCUMENT_ANALYSIS_SYSTEM_PROMPT,
            userPrompt: (0, document_analysis_prompt_1.DOCUMENT_ANALYSIS_USER_PROMPT)(documentId, chunksPayload),
            temperature: 0.1,
            maxTokens: 4096,
        });
        const validated = DocumentAnalysisResultSchema.parse(rawResult);
        const requirementChunks = chunks.filter((c) => c.chunkType === 'REQUIREMENT').length;
        const testCaseChunks = chunks.filter((c) => c.chunkType === 'TEST_CASE').length;
        const metadata = {
            totalChunksAnalyzed: chunks.length,
            requirementChunks,
            testCaseChunks,
            processingVersion: 'v1',
        };
        const saved = await this.analysisRepository.upsert(validated, metadata);
        this.logger.log(`Document analysis complete for ${documentId}: ` +
            `${validated.identifiedModules.length} modules, ` +
            `${validated.missingInformation.length} missing items`);
        return this.toResponseDto(saved);
    }
    async getAnalysis(documentId) {
        const analysis = await this.analysisRepository.findByDocumentId(documentId);
        if (!analysis) {
            throw new common_1.NotFoundException(`No analysis found for document: ${documentId}. Run analysis first via POST /document-understanding/${documentId}/analyze`);
        }
        return this.toResponseDto(analysis);
    }
    async updateAnalysisWithClarification(documentId, clarificationQuestion, clarificationAnswer) {
        this.logger.log(`Updating analysis for ${documentId} with clarification answer`);
        const existingAnalysis = await this.analysisRepository.findByDocumentId(documentId);
        if (!existingAnalysis) {
            throw new common_1.NotFoundException(`No analysis found for document: ${documentId}. Run analysis first.`);
        }
        const chunks = await this.chunkModel
            .find({ documentId })
            .sort({ chunkNumber: 1 })
            .lean()
            .exec();
        if (!chunks || chunks.length === 0) {
            throw new common_1.BadRequestException(`No chunks found for document: ${documentId}`);
        }
        const aggregations = this.aggregateChunks(chunks);
        const chunksPayload = JSON.stringify(aggregations, null, 2);
        const existingAnalysisStr = JSON.stringify({
            overallSummary: existingAnalysis.overallSummary,
            identifiedModules: existingAnalysis.identifiedModules,
            dependencies: existingAnalysis.dependencies,
            riskAreas: existingAnalysis.riskAreas,
            missingInformation: existingAnalysis.missingInformation,
            workflow: existingAnalysis.workflow,
        }, null, 2);
        const rawResult = await this.llmService.generateStructuredResponse({
            systemPrompt: document_analysis_prompt_1.DOCUMENT_ANALYSIS_UPDATE_SYSTEM_PROMPT,
            userPrompt: (0, document_analysis_prompt_1.DOCUMENT_ANALYSIS_UPDATE_USER_PROMPT)(documentId, existingAnalysisStr, clarificationQuestion, clarificationAnswer, chunksPayload),
            temperature: 0.1,
            maxTokens: 4096,
        });
        const validated = DocumentAnalysisResultSchema.parse(rawResult);
        const metadata = {
            totalChunksAnalyzed: chunks.length,
            requirementChunks: chunks.filter((c) => c.chunkType === 'REQUIREMENT').length,
            testCaseChunks: chunks.filter((c) => c.chunkType === 'TEST_CASE').length,
            processingVersion: 'v1',
        };
        const saved = await this.analysisRepository.upsert(validated, metadata);
        this.logger.log(`Analysis updated for ${documentId}`);
        return this.toResponseDto(saved);
    }
    aggregateChunks(chunks) {
        return chunks.map((chunk) => {
            const aggregation = {
                chunkId: String(chunk._id),
                title: chunk.title,
                chunkType: chunk.chunkType,
                shortSummary: chunk.summary?.shortSummary ?? '',
                detailedSummary: chunk.summary?.detailedSummary ?? '',
                content: chunk.content,
            };
            if (chunk.chunkType === 'REQUIREMENT' && chunk.extractedData?.requirements) {
                aggregation.requirements = chunk.extractedData.requirements;
            }
            if (chunk.chunkType === 'TEST_CASE' && chunk.extractedData?.testCases) {
                aggregation.testCases = chunk.extractedData.testCases;
            }
            return aggregation;
        });
    }
    toResponseDto(doc) {
        return {
            documentId: doc.documentId,
            overallSummary: doc.overallSummary,
            identifiedModules: doc.identifiedModules,
            dependencies: doc.dependencies,
            riskAreas: doc.riskAreas,
            missingInformation: doc.missingInformation,
            workflow: doc.workflow,
            metadata: doc.metadata,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
};
exports.DocumentAnalysisService = DocumentAnalysisService;
exports.DocumentAnalysisService = DocumentAnalysisService = DocumentAnalysisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(document_chunk_schema_1.DocumentChunk.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        llm_service_1.LLMService,
        document_analysis_repository_1.DocumentAnalysisRepository])
], DocumentAnalysisService);
//# sourceMappingURL=document-analysis.service.js.map