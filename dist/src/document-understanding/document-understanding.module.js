"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentUnderstandingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const document_understanding_controller_1 = require("./controllers/document-understanding.controller");
const services_1 = require("./services");
const document_schema_1 = require("./schemas/document.schema");
const document_understanding_schema_1 = require("./schemas/document-understanding.schema");
const project_knowledge_schema_1 = require("./schemas/project-knowledge.schema");
const clarifications_schema_1 = require("./schemas/clarifications.schema");
const test_cases_schema_1 = require("./schemas/test-cases.schema");
const agent_runs_schema_1 = require("./schemas/agent-runs.schema");
let DocumentUnderstandingModule = class DocumentUnderstandingModule {
};
exports.DocumentUnderstandingModule = DocumentUnderstandingModule;
exports.DocumentUnderstandingModule = DocumentUnderstandingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: document_schema_1.DocumentEntity.name, schema: document_schema_1.DocumentSchema },
                { name: document_understanding_schema_1.DocumentUnderstanding.name, schema: document_understanding_schema_1.DocumentUnderstandingSchema },
                { name: project_knowledge_schema_1.ProjectKnowledge.name, schema: project_knowledge_schema_1.ProjectKnowledgeSchema },
                { name: clarifications_schema_1.Clarifications.name, schema: clarifications_schema_1.ClarificationsSchema },
                { name: test_cases_schema_1.TestCases.name, schema: test_cases_schema_1.TestCasesSchema },
                { name: agent_runs_schema_1.AgentRuns.name, schema: agent_runs_schema_1.AgentRunsSchema },
            ]),
        ],
        controllers: [document_understanding_controller_1.DocumentUnderstandingController],
        providers: [
            services_1.LLMService,
            services_1.S3DocumentService,
            services_1.DocumentParsingService,
            services_1.DocumentProcessingService,
        ],
        exports: [services_1.DocumentProcessingService],
    })
], DocumentUnderstandingModule);
//# sourceMappingURL=document-understanding.module.js.map