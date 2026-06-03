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
exports.DocumentChunkSchema = exports.DocumentChunk = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interfaces_1 = require("../interfaces");
let DocumentChunk = class DocumentChunk extends mongoose_2.Document {
};
exports.DocumentChunk = DocumentChunk;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], DocumentChunk.prototype, "documentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DocumentChunk.prototype, "chunkNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: interfaces_1.ChunkType }),
    __metadata("design:type", String)
], DocumentChunk.prototype, "chunkType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentChunk.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        startPage: { type: Number, required: true },
        endPage: { type: Number, required: true },
    })),
    __metadata("design:type", Object)
], DocumentChunk.prototype, "pageRange", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentChunk.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        shortSummary: { type: String, required: true },
        detailedSummary: { type: String, required: true },
        confidence: { type: Number, required: true },
    })),
    __metadata("design:type", Object)
], DocumentChunk.prototype, "summary", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        confidence: { type: Number, required: true },
    })),
    __metadata("design:type", Object)
], DocumentChunk.prototype, "classification", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], DocumentChunk.prototype, "extractedData", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        chunkingStrategy: { type: String, default: 'AI_SEMANTIC' },
        summaryGenerated: { type: Boolean, default: false },
        extractionCompleted: { type: Boolean, default: false },
    })),
    __metadata("design:type", Object)
], DocumentChunk.prototype, "processing", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], DocumentChunk.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], DocumentChunk.prototype, "updatedAt", void 0);
exports.DocumentChunk = DocumentChunk = __decorate([
    (0, mongoose_1.Schema)({ collection: 'document_chunks', timestamps: true })
], DocumentChunk);
exports.DocumentChunkSchema = mongoose_1.SchemaFactory.createForClass(DocumentChunk);
exports.DocumentChunkSchema.index({ documentId: 1, chunkNumber: 1 }, { unique: true });
//# sourceMappingURL=document-chunk.schema.js.map