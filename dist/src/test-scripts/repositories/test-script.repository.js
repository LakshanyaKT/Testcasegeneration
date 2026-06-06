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
var TestScriptRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestScriptRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const test_script_schema_1 = require("../schemas/test-script.schema");
let TestScriptRepository = TestScriptRepository_1 = class TestScriptRepository {
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(TestScriptRepository_1.name);
    }
    async insertMany(scripts) {
        return this.model.insertMany(scripts);
    }
    async deleteByDocumentId(documentId) {
        await this.model.deleteMany({ documentId });
    }
    async findByDocumentId(documentId) {
        return this.model.find({ documentId }).sort({ testCaseType: 1, priority: 1 }).exec();
    }
    async countByDocumentId(documentId) {
        return this.model.countDocuments({ documentId });
    }
    async aggregateSummary(documentId) {
        const [typeAgg, trackAgg, priorityAgg] = await Promise.all([
            this.model.aggregate([
                { $match: { documentId } },
                { $group: { _id: '$testCaseType', count: { $sum: 1 } } },
            ]),
            this.model.aggregate([
                { $match: { documentId } },
                { $group: { _id: '$sourceTrack', count: { $sum: 1 } } },
            ]),
            this.model.aggregate([
                { $match: { documentId } },
                { $group: { _id: '$priority', count: { $sum: 1 } } },
            ]),
        ]);
        return {
            byType: Object.fromEntries(typeAgg.map((a) => [a._id, a.count])),
            byTrack: Object.fromEntries(trackAgg.map((a) => [a._id, a.count])),
            byPriority: Object.fromEntries(priorityAgg.map((a) => [a._id, a.count])),
        };
    }
};
exports.TestScriptRepository = TestScriptRepository;
exports.TestScriptRepository = TestScriptRepository = TestScriptRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(test_script_schema_1.TestScript.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TestScriptRepository);
//# sourceMappingURL=test-script.repository.js.map