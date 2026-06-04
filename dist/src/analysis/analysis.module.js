"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const document_analysis_schema_1 = require("./schemas/document-analysis.schema");
const document_chunk_schema_1 = require("../document-understanding/schemas/document-chunk.schema");
const document_analysis_controller_1 = require("./controllers/document-analysis.controller");
const document_analysis_service_1 = require("./services/document-analysis.service");
const document_analysis_repository_1 = require("./repositories/document-analysis.repository");
const llm_service_1 = require("../document-understanding/services/llm.service");
let AnalysisModule = class AnalysisModule {
};
exports.AnalysisModule = AnalysisModule;
exports.AnalysisModule = AnalysisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: document_analysis_schema_1.DocumentAnalysis.name, schema: document_analysis_schema_1.DocumentAnalysisSchema },
                { name: document_chunk_schema_1.DocumentChunk.name, schema: document_chunk_schema_1.DocumentChunkSchema },
            ]),
        ],
        controllers: [document_analysis_controller_1.DocumentAnalysisController],
        providers: [document_analysis_service_1.DocumentAnalysisService, document_analysis_repository_1.DocumentAnalysisRepository, llm_service_1.LLMService],
        exports: [document_analysis_service_1.DocumentAnalysisService, document_analysis_repository_1.DocumentAnalysisRepository],
    })
], AnalysisModule);
//# sourceMappingURL=analysis.module.js.map