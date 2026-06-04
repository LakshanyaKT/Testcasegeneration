"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DocumentProcessingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const document_schema_1 = require("../schemas/document.schema");
const document_understanding_schema_1 = require("../schemas/document-understanding.schema");
const project_knowledge_schema_1 = require("../schemas/project-knowledge.schema");
const clarifications_schema_1 = require("../schemas/clarifications.schema");
const test_cases_schema_1 = require("../schemas/test-cases.schema");
const agent_runs_schema_1 = require("../schemas/agent-runs.schema");
const llm_service_1 = require("./llm.service");
const s3_document_service_1 = require("./s3-document.service");
const document_parsing_service_1 = require("./document-parsing.service");
const document_analysis_prompt_1 = require("../prompts/document-analysis.prompt");
let DocumentProcessingService = DocumentProcessingService_1 = class DocumentProcessingService {
    constructor(documentModel, documentUnderstandingModel, projectKnowledgeModel, clarificationsModel, testCasesModel, agentRunsModel, s3DocumentService, documentParsingService, llmService) {
        this.documentModel = documentModel;
        this.documentUnderstandingModel = documentUnderstandingModel;
        this.projectKnowledgeModel = projectKnowledgeModel;
        this.clarificationsModel = clarificationsModel;
        this.testCasesModel = testCasesModel;
        this.agentRunsModel = agentRunsModel;
        this.s3DocumentService = s3DocumentService;
        this.documentParsingService = documentParsingService;
        this.llmService = llmService;
        this.logger = new common_1.Logger(DocumentProcessingService_1.name);
    }
    async processDocument(dto) {
        const { documentId, projectId, sessionId, s3Bucket, s3Key } = dto;
        const startedAt = new Date();
        this.logger.log(`Processing full document: ${documentId} for project: ${projectId}, session: ${sessionId}`);
        let markdown;
        if (dto.markdown) {
            this.logger.log('Using provided markdown content (skipping S3 download)');
            markdown = dto.markdown;
        }
        else {
            this.logger.log(`Step 0: Downloading document from s3://${s3Bucket}/${s3Key}`);
            const buffer = await this.s3DocumentService.downloadDocumentBuffer(s3Bucket, s3Key);
            this.logger.log(`Downloaded ${buffer.length} bytes, parsing to markdown...`);
            markdown = await this.documentParsingService.parseToMarkdown(buffer, s3Key);
        }
        this.logger.log('Step 1: Saving document in MongoDB documents collection');
        await this.documentModel.findOneAndUpdate({ projectId, sessionId, fileName: dto.fileName || path.basename(s3Key || 'document.md') }, {
            projectId,
            sessionId,
            fileName: dto.fileName || path.basename(s3Key || 'document.md'),
            fileType: dto.fileType || path.extname(s3Key || '.md').substring(1) || 'markdown',
            rawText: markdown,
            uploadedBy: dto.uploadedBy || 'system',
            uploadedAt: new Date(),
            status: 'UPLOADED',
        }, { upsert: true, new: true });
        this.logger.log('Step 2: Retrieving relevant project knowledge');
        let projectKnowledge = await this.projectKnowledgeModel.findOne({ projectId });
        if (!projectKnowledge) {
            this.logger.log(`No existing project knowledge found for project: ${projectId}. Creating new document...`);
            projectKnowledge = await this.projectKnowledgeModel.create({
                projectId,
                entities: [],
                businessRules: [],
                validations: [],
                processFlows: [],
                workflows: [],
                testPatterns: [],
                domainKnowledge: [],
                reusableScenarios: [],
            });
        }
        const projectKnowledgeContext = {
            entities: projectKnowledge.entities || [],
            businessRules: projectKnowledge.businessRules || [],
            validations: projectKnowledge.validations || [],
            processFlows: projectKnowledge.processFlows || [],
            workflows: projectKnowledge.workflows || [],
            testPatterns: projectKnowledge.testPatterns || [],
            domainKnowledge: projectKnowledge.domainKnowledge || [],
            reusableScenarios: projectKnowledge.reusableScenarios || [],
        };
        this.logger.log('Step 3: Sending full document text + project knowledge to Bedrock Claude Sonnet');
        const task = {
            analyzeDocument: true,
            extractRequirements: true,
            extractEntities: true,
            extractBusinessRules: true,
            extractValidations: true,
            extractProcessFlows: true,
            extractWorkflows: true,
            identifyMissingInformation: true,
            generateQuestions: true,
            generateTestCases: true,
            generateKnowledgeUpdates: true,
        };
        let bedrockResponse;
        try {
            bedrockResponse = await this.llmService.generateStructuredResponse({
                systemPrompt: document_analysis_prompt_1.DOCUMENT_ANALYSIS_SYSTEM_PROMPT,
                userPrompt: (0, document_analysis_prompt_1.DOCUMENT_ANALYSIS_USER_PROMPT)(projectId, sessionId, markdown, projectKnowledgeContext, task),
                temperature: 0.2,
                maxTokens: 8192,
            });
        }
        catch (error) {
            this.logger.error(`Bedrock analysis invocation failed: ${error.message}`);
            throw new common_1.BadRequestException(`Bedrock analysis failed: ${error.message}`);
        }
        this.logger.log(`Bedrock response received. Status: ${bedrockResponse.status}, Questions generated: ${bedrockResponse.questions?.length || 0}`);
        this.logger.log('Step 4: Executing Decision Engine');
        const moduleCount = new Set(bedrockResponse.requirements?.map((r) => r.module).filter(Boolean)).size;
        await this.documentUnderstandingModel.findOneAndUpdate({ documentId }, {
            documentId,
            projectId,
            sessionId,
            analysis: {
                confidence: bedrockResponse.analysis?.confidence || 0,
                completenessScore: bedrockResponse.analysis?.completenessScore || 0,
                coverageScore: bedrockResponse.analysis?.coverageScore || 0,
                documentType: bedrockResponse.analysis?.documentType || 'FRS',
                moduleCount,
                requirementCount: bedrockResponse.requirements?.length || 0,
            },
            requirements: bedrockResponse.requirements || [],
            entities: bedrockResponse.entities || [],
            businessRules: bedrockResponse.businessRules || [],
            validations: bedrockResponse.validations || [],
            processFlows: bedrockResponse.processFlows || [],
            workflows: bedrockResponse.workflows || [],
            missingInformation: bedrockResponse.missingInformation || [],
            questions: bedrockResponse.questions || [],
            status: bedrockResponse.status,
        }, { upsert: true, new: true });
        const questionsCount = bedrockResponse.questions?.length || 0;
        if (questionsCount > 0) {
            this.logger.log('Decision Engine: Questions found. Saving Clarifications and returning NEEDS_CLARIFICATION.');
            await this.clarificationsModel.findOneAndUpdate({ documentId }, {
                documentId,
                projectId,
                sessionId,
                questions: bedrockResponse.questions.map((q, idx) => ({
                    questionId: q.questionId || `Q_AUTO_${String(idx + 1).padStart(3, '0')}`,
                    question: q.question,
                    category: q.category,
                    priority: q.priority,
                })),
                answers: [],
                status: 'PENDING_USER',
            }, { upsert: true, new: true });
        }
        else {
            this.logger.log('Decision Engine: No questions found. Saving Test Cases and updating Project Knowledge.');
            await this.testCasesModel.findOneAndUpdate({ documentId }, {
                documentId,
                projectId,
                sessionId,
                testCases: bedrockResponse.testCases || [],
                coverage: bedrockResponse.coverage || {
                    requirementsCovered: 0,
                    requirementsTotal: bedrockResponse.requirements?.length || 0,
                    coveragePercentage: 0,
                },
            }, { upsert: true, new: true });
            const suggestedKnowledge = bedrockResponse.knowledgeBase?.projectKnowledge;
            if (suggestedKnowledge) {
                this.logger.log('Updating project knowledge collection from Bedrock suggestion payload');
                await this.projectKnowledgeModel.findOneAndUpdate({ projectId }, {
                    projectId,
                    entities: suggestedKnowledge.entities || [],
                    businessRules: suggestedKnowledge.businessRules || [],
                    validations: suggestedKnowledge.validations || [],
                    processFlows: suggestedKnowledge.processFlows || [],
                    workflows: suggestedKnowledge.workflows || [],
                    testPatterns: suggestedKnowledge.testPatterns || [],
                    domainKnowledge: suggestedKnowledge.domainKnowledge || [],
                    reusableScenarios: suggestedKnowledge.reusableScenarios || [],
                }, { upsert: true, new: true });
            }
        }
        const completedAt = new Date();
        const executionTime = completedAt.getTime() - startedAt.getTime();
        this.logger.log(`Step 5: Logging agent execution metadata in agent_runs collection (Execution Time: ${executionTime}ms)`);
        await this.agentRunsModel.create({
            projectId,
            sessionId,
            documentId,
            status: bedrockResponse.status,
            startedAt,
            completedAt,
            bedrockCalls: 1,
            executionTime,
        });
        return {
            status: bedrockResponse.status,
            documentId,
            projectId,
            sessionId,
            analysis: bedrockResponse.analysis,
            requirements: bedrockResponse.requirements,
            entities: bedrockResponse.entities,
            businessRules: bedrockResponse.businessRules,
            validations: bedrockResponse.validations,
            processFlows: bedrockResponse.processFlows,
            workflows: bedrockResponse.workflows,
            missingInformation: bedrockResponse.missingInformation,
            questions: bedrockResponse.status === 'NEEDS_CLARIFICATION' ? bedrockResponse.questions : undefined,
            testCases: bedrockResponse.status === 'READY' ? bedrockResponse.testCases : undefined,
            coverage: bedrockResponse.status === 'READY' ? bedrockResponse.coverage : undefined,
            nextAction: bedrockResponse.nextAction,
        };
    }
    async processLocalDocument(dto) {
        const { documentId, projectId, sessionId, filePath } = dto;
        this.logger.log(`Processing local document: ${documentId} from ${filePath}`);
        const resolvedPath = path.resolve(filePath);
        if (!fs.existsSync(resolvedPath)) {
            throw new common_1.BadRequestException(`File not found: ${resolvedPath}`);
        }
        const buffer = fs.readFileSync(resolvedPath);
        this.logger.log(`Read local file: ${resolvedPath} (${buffer.length} bytes)`);
        const markdown = await this.documentParsingService.parseToMarkdown(buffer, resolvedPath);
        this.logger.log(`Parsed local file to markdown: ${markdown.length} characters`);
        return this.processDocument({
            documentId,
            projectId,
            sessionId,
            s3Bucket: 'local',
            s3Key: filePath,
            markdown,
            fileName: path.basename(filePath),
            fileType: path.extname(filePath).substring(1),
        });
    }
};
exports.DocumentProcessingService = DocumentProcessingService;
exports.DocumentProcessingService = DocumentProcessingService = DocumentProcessingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(document_schema_1.DocumentEntity.name)),
    __param(1, (0, mongoose_1.InjectModel)(document_understanding_schema_1.DocumentUnderstanding.name)),
    __param(2, (0, mongoose_1.InjectModel)(project_knowledge_schema_1.ProjectKnowledge.name)),
    __param(3, (0, mongoose_1.InjectModel)(clarifications_schema_1.Clarifications.name)),
    __param(4, (0, mongoose_1.InjectModel)(test_cases_schema_1.TestCases.name)),
    __param(5, (0, mongoose_1.InjectModel)(agent_runs_schema_1.AgentRuns.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        s3_document_service_1.S3DocumentService,
        document_parsing_service_1.DocumentParsingService,
        llm_service_1.LLMService])
], DocumentProcessingService);
//# sourceMappingURL=document-processing.service.js.map