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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentAnalysisSchema = exports.DocumentAnalysis = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DocumentAnalysis = class DocumentAnalysis extends mongoose_2.Document {
};
exports.DocumentAnalysis = DocumentAnalysis;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], DocumentAnalysis.prototype, "documentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentAnalysis.prototype, "overallSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DocumentAnalysis.prototype, "identifiedModules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DocumentAnalysis.prototype, "dependencies", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DocumentAnalysis.prototype, "riskAreas", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DocumentAnalysis.prototype, "missingInformation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DocumentAnalysis.prototype, "workflow", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        totalChunksAnalyzed: { type: Number, required: true },
        requirementChunks: { type: Number, required: true },
        testCaseChunks: { type: Number, required: true },
        processingVersion: { type: String, default: 'v1' },
    })),
    __metadata("design:type", Object)
], DocumentAnalysis.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], DocumentAnalysis.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], DocumentAnalysis.prototype, "updatedAt", void 0);
exports.DocumentAnalysis = DocumentAnalysis = __decorate([
    (0, mongoose_1.Schema)({ collection: 'document_understanding', timestamps: true })
], DocumentAnalysis);
exports.DocumentAnalysisSchema = mongoose_1.SchemaFactory.createForClass(DocumentAnalysis);
//# sourceMappingURL=document-analysis.schema.js.map