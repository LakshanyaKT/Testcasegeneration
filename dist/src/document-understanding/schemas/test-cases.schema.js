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
exports.TestCasesSchema = exports.TestCases = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TestCases = class TestCases extends mongoose_2.Document {
};
exports.TestCases = TestCases;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], TestCases.prototype, "documentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], TestCases.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], TestCases.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                testCaseId: { type: String, required: true },
                title: { type: String, required: true },
                priority: { type: String, required: true },
                type: { type: String, required: true },
                requirementIds: { type: [String], default: [] },
                preConditions: { type: [String], default: [] },
                steps: { type: [String], default: [] },
                expectedResults: { type: [String], default: [] },
                testData: { type: [Object], default: [] },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], TestCases.prototype, "testCases", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            requirementsCovered: { type: Number, required: true },
            requirementsTotal: { type: Number, required: true },
            coveragePercentage: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], TestCases.prototype, "coverage", void 0);
exports.TestCases = TestCases = __decorate([
    (0, mongoose_1.Schema)({ collection: 'test_cases', timestamps: true })
], TestCases);
exports.TestCasesSchema = mongoose_1.SchemaFactory.createForClass(TestCases);
//# sourceMappingURL=test-cases.schema.js.map