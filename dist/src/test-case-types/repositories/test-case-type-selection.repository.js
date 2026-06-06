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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TestCaseTypeSelectionRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseTypeSelectionRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const test_case_type_selection_schema_1 = require("../schemas/test-case-type-selection.schema");
let TestCaseTypeSelectionRepository = TestCaseTypeSelectionRepository_1 = class TestCaseTypeSelectionRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(TestCaseTypeSelectionRepository_1.name);
    }
    async upsertDiscovery(documentId, detectedTypes, suggestedTypes) {
        return this.model.findOneAndUpdate({ documentId }, {
            documentId,
            detectedTypes,
            suggestedTypes,
            finalTypes: [],
            status: test_case_type_selection_schema_1.TestCaseTypeSelectionStatus.PENDING_APPROVAL,
        }, { upsert: true, new: true });
    }
    async approve(documentId, finalTypes) {
        return this.model.findOneAndUpdate({ documentId }, { finalTypes, status: test_case_type_selection_schema_1.TestCaseTypeSelectionStatus.APPROVED }, { new: true });
    }
    async findByDocumentId(documentId) {
        return this.model.findOne({ documentId }).exec();
    }
};
exports.TestCaseTypeSelectionRepository = TestCaseTypeSelectionRepository;
exports.TestCaseTypeSelectionRepository = TestCaseTypeSelectionRepository = TestCaseTypeSelectionRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(test_case_type_selection_schema_1.TestCaseTypeSelection.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TestCaseTypeSelectionRepository);
//# sourceMappingURL=test-case-type-selection.repository.js.map