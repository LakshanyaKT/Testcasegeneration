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
exports.ProjectKnowledgeSchema = exports.ProjectKnowledge = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ProjectKnowledge = class ProjectKnowledge extends mongoose_2.Document {
};
exports.ProjectKnowledge = ProjectKnowledge;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], ProjectKnowledge.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ProjectKnowledge.prototype, "entities", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ProjectKnowledge.prototype, "businessRules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ProjectKnowledge.prototype, "validations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ProjectKnowledge.prototype, "processFlows", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ProjectKnowledge.prototype, "workflows", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ProjectKnowledge.prototype, "testPatterns", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ProjectKnowledge.prototype, "domainKnowledge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ProjectKnowledge.prototype, "reusableScenarios", void 0);
exports.ProjectKnowledge = ProjectKnowledge = __decorate([
    (0, mongoose_1.Schema)({ collection: 'project_knowledge', timestamps: true })
], ProjectKnowledge);
exports.ProjectKnowledgeSchema = mongoose_1.SchemaFactory.createForClass(ProjectKnowledge);
//# sourceMappingURL=project-knowledge.schema.js.map