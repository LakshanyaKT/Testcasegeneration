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
exports.ClarificationsSchema = exports.Clarifications = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Clarifications = class Clarifications extends mongoose_2.Document {
};
exports.Clarifications = Clarifications;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Clarifications.prototype, "documentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Clarifications.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Clarifications.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                questionId: { type: String, required: true },
                question: { type: String, required: true },
                category: { type: String, required: true },
                priority: { type: String, required: true },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Clarifications.prototype, "questions", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                questionId: { type: String, required: true },
                answer: { type: String, required: true },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Clarifications.prototype, "answers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Clarifications.prototype, "status", void 0);
exports.Clarifications = Clarifications = __decorate([
    (0, mongoose_1.Schema)({ collection: 'clarifications', timestamps: true })
], Clarifications);
exports.ClarificationsSchema = mongoose_1.SchemaFactory.createForClass(Clarifications);
//# sourceMappingURL=clarifications.schema.js.map