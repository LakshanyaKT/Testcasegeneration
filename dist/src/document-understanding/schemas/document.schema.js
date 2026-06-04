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
exports.DocumentSchema = exports.DocumentEntity = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DocumentEntity = class DocumentEntity extends mongoose_2.Document {
};
exports.DocumentEntity = DocumentEntity;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentEntity.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentEntity.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentEntity.prototype, "fileName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentEntity.prototype, "fileType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentEntity.prototype, "rawText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentEntity.prototype, "uploadedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], DocumentEntity.prototype, "uploadedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'UPLOADED' }),
    __metadata("design:type", String)
], DocumentEntity.prototype, "status", void 0);
exports.DocumentEntity = DocumentEntity = __decorate([
    (0, mongoose_1.Schema)({ collection: 'documents', timestamps: true })
], DocumentEntity);
exports.DocumentSchema = mongoose_1.SchemaFactory.createForClass(DocumentEntity);
//# sourceMappingURL=document.schema.js.map