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
var DocumentAnalysisRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentAnalysisRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const document_analysis_schema_1 = require("../schemas/document-analysis.schema");
let DocumentAnalysisRepository = DocumentAnalysisRepository_1 = class DocumentAnalysisRepository {
    constructor(analysisModel) {
        this.analysisModel = analysisModel;
        this.logger = new common_1.Logger(DocumentAnalysisRepository_1.name);
    }
    async upsert(result, metadata) {
        this.logger.log(`Upserting document analysis for: ${result.documentId}`);
        return this.analysisModel.findOneAndUpdate({ documentId: result.documentId }, {
            documentId: result.documentId,
            overallSummary: result.overallSummary,
            identifiedModules: result.identifiedModules,
            dependencies: result.dependencies,
            riskAreas: result.riskAreas,
            missingInformation: result.missingInformation,
            workflow: result.workflow,
            metadata,
        }, { upsert: true, new: true });
    }
    async findByDocumentId(documentId) {
        return this.analysisModel.findOne({ documentId }).exec();
    }
};
exports.DocumentAnalysisRepository = DocumentAnalysisRepository;
exports.DocumentAnalysisRepository = DocumentAnalysisRepository = DocumentAnalysisRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(document_analysis_schema_1.DocumentAnalysis.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DocumentAnalysisRepository);
//# sourceMappingURL=document-analysis.repository.js.map