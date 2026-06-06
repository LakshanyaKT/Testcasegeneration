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
exports.TestScriptSchema = exports.TestScript = exports.TestScriptSourceTrack = exports.TestScriptPriority = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TestScriptPriority;
(function (TestScriptPriority) {
    TestScriptPriority["HIGH"] = "HIGH";
    TestScriptPriority["MEDIUM"] = "MEDIUM";
    TestScriptPriority["LOW"] = "LOW";
})(TestScriptPriority || (exports.TestScriptPriority = TestScriptPriority = {}));
var TestScriptSourceTrack;
(function (TestScriptSourceTrack) {
    TestScriptSourceTrack["REQUIREMENT"] = "REQUIREMENT";
    TestScriptSourceTrack["TEST_CASE"] = "TEST_CASE";
})(TestScriptSourceTrack || (exports.TestScriptSourceTrack = TestScriptSourceTrack = {}));
let TestScript = class TestScript extends mongoose_2.Document {
};
exports.TestScript = TestScript;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], TestScript.prototype, "testScriptId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], TestScript.prototype, "documentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TestScript.prototype, "chunkId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TestScript.prototype, "chunkTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: TestScriptSourceTrack }),
    __metadata("design:type", String)
], TestScript.prototype, "sourceTrack", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TestScript.prototype, "testCaseType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TestScript.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], TestScript.prototype, "sourceRequirementId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], TestScript.prototype, "sourceTestCaseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], TestScript.prototype, "preconditions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], TestScript.prototype, "steps", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], TestScript.prototype, "expectedResults", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: TestScriptPriority,
        default: TestScriptPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], TestScript.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], TestScript.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], TestScript.prototype, "updatedAt", void 0);
exports.TestScript = TestScript = __decorate([
    (0, mongoose_1.Schema)({ collection: 'test_scripts', timestamps: true })
], TestScript);
exports.TestScriptSchema = mongoose_1.SchemaFactory.createForClass(TestScript);
exports.TestScriptSchema.index({ documentId: 1, testCaseType: 1 });
exports.TestScriptSchema.index({ documentId: 1, sourceTrack: 1 });
//# sourceMappingURL=test-script.schema.js.map