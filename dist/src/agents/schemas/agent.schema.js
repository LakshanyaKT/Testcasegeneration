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
exports.AgentSchema = exports.Agent = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Agent = class Agent extends mongoose_2.Document {
};
exports.Agent = Agent;
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        agent_key: { type: String, required: true },
        display_name: { type: String, required: true },
        module: { type: String, required: true },
        mode: { type: String, default: 'FRS_DRIVEN' },
        status: { type: String, default: 'DRAFT' },
        review_status: { type: String, default: 'DRAFT' },
        created_by: { type: String, required: true },
        created_on: { type: Date, default: Date.now },
        started_on: { type: Date, default: null },
        completed_on: { type: Date, default: null },
    })),
    __metadata("design:type", Object)
], Agent.prototype, "about", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        document_id: { type: String, default: '' },
        document_name: { type: String, required: true },
        document_type: { type: String, default: 'FRS' },
    })),
    __metadata("design:type", Object)
], Agent.prototype, "document", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        total_chunks: { type: Number, default: 0 },
        requirement_chunks: { type: Number, default: 0 },
        testcase_chunks: { type: Number, default: 0 },
        generated_testcases: { type: Number, default: 0 },
        clarifications: { type: Number, default: 0 },
    })),
    __metadata("design:type", Object)
], Agent.prototype, "metrics", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        percentage: { type: Number, default: 0 },
        current_phase: { type: String, default: 'NOT_STARTED' },
    })),
    __metadata("design:type", Object)
], Agent.prototype, "progress", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        document_understanding_id: { type: String, default: '' },
        generated_script_count: { type: Number, default: 0 },
    })),
    __metadata("design:type", Object)
], Agent.prototype, "output", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Agent.prototype, "active", void 0);
exports.Agent = Agent = __decorate([
    (0, mongoose_1.Schema)({ collection: 'agents', timestamps: false })
], Agent);
exports.AgentSchema = mongoose_1.SchemaFactory.createForClass(Agent);
//# sourceMappingURL=agent.schema.js.map