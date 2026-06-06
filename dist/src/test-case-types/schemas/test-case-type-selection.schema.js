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
exports.TestCaseTypeSelectionSchema = exports.TestCaseTypeSelection = exports.TestCaseTypeSelectionStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TestCaseTypeSelectionStatus;
(function (TestCaseTypeSelectionStatus) {
    TestCaseTypeSelectionStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    TestCaseTypeSelectionStatus["APPROVED"] = "APPROVED";
})(TestCaseTypeSelectionStatus || (exports.TestCaseTypeSelectionStatus = TestCaseTypeSelectionStatus = {}));
let TestCaseTypeSelection = class TestCaseTypeSelection extends mongoose_2.Document {
};
exports.TestCaseTypeSelection = TestCaseTypeSelection;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], TestCaseTypeSelection.prototype, "documentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], TestCaseTypeSelection.prototype, "detectedTypes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [(0, mongoose_1.raw)({ type: { type: String }, reason: { type: String } })],
        default: [],
    }),
    __metadata("design:type", Array)
], TestCaseTypeSelection.prototype, "suggestedTypes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], TestCaseTypeSelection.prototype, "finalTypes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: TestCaseTypeSelectionStatus,
        default: TestCaseTypeSelectionStatus.PENDING_APPROVAL,
    }),
    __metadata("design:type", String)
], TestCaseTypeSelection.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], TestCaseTypeSelection.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], TestCaseTypeSelection.prototype, "updatedAt", void 0);
exports.TestCaseTypeSelection = TestCaseTypeSelection = __decorate([
    (0, mongoose_1.Schema)({ collection: 'test_case_type_selections', timestamps: true })
], TestCaseTypeSelection);
exports.TestCaseTypeSelectionSchema = mongoose_1.SchemaFactory.createForClass(TestCaseTypeSelection);
//# sourceMappingURL=test-case-type-selection.schema.js.map