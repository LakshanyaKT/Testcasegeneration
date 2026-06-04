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
exports.ClarificationSchema = exports.Clarification = exports.ClarificationStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ClarificationStatus;
(function (ClarificationStatus) {
    ClarificationStatus["PENDING"] = "PENDING";
    ClarificationStatus["ANSWERED"] = "ANSWERED";
    ClarificationStatus["RESOLVED"] = "RESOLVED";
    ClarificationStatus["REJECTED"] = "REJECTED";
})(ClarificationStatus || (exports.ClarificationStatus = ClarificationStatus = {}));
let Clarification = class Clarification extends mongoose_2.Document {
};
exports.Clarification = Clarification;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Clarification.prototype, "clarificationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Clarification.prototype, "documentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Clarification.prototype, "question", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Clarification.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Clarification.prototype, "answer", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ClarificationStatus,
        default: ClarificationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Clarification.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Clarification.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Clarification.prototype, "updatedAt", void 0);
exports.Clarification = Clarification = __decorate([
    (0, mongoose_1.Schema)({ collection: 'clarifications', timestamps: true })
], Clarification);
exports.ClarificationSchema = mongoose_1.SchemaFactory.createForClass(Clarification);
exports.ClarificationSchema.index({ documentId: 1, status: 1 });
//# sourceMappingURL=clarification.schema.js.map