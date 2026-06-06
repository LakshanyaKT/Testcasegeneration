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
var ClarificationRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClarificationRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const clarification_schema_1 = require("../schemas/clarification.schema");
let ClarificationRepository = ClarificationRepository_1 = class ClarificationRepository {
    constructor(clarificationModel) {
        this.clarificationModel = clarificationModel;
        this.logger = new common_1.Logger(ClarificationRepository_1.name);
    }
    async createMany(documentId, items) {
        const docs = items.map((item, index) => ({
            clarificationId: `CLR-${documentId}-${Date.now()}-${index}`,
            documentId,
            question: item.question,
            reason: item.reason,
            answer: null,
            status: clarification_schema_1.ClarificationStatus.PENDING,
        }));
        return this.clarificationModel.insertMany(docs);
    }
    async findByDocumentId(documentId) {
        return this.clarificationModel
            .find({ documentId })
            .sort({ createdAt: 1 })
            .exec();
    }
    async findPendingByDocumentId(documentId) {
        return this.clarificationModel
            .find({ documentId, status: clarification_schema_1.ClarificationStatus.PENDING })
            .sort({ createdAt: 1 })
            .exec();
    }
    async findPrioritizedByDocumentId(documentId, batchId) {
        return this.clarificationModel
            .find({ documentId, priorityBatch: batchId, status: clarification_schema_1.ClarificationStatus.PENDING })
            .sort({ priorityRank: 1 })
            .exec();
    }
    async findLatestPrioritizedBatch(documentId) {
        const latest = await this.clarificationModel
            .findOne({ documentId, priorityBatch: { $ne: null } })
            .sort({ updatedAt: -1 })
            .exec();
        if (!latest?.priorityBatch)
            return [];
        return this.clarificationModel
            .find({
            documentId,
            priorityBatch: latest.priorityBatch,
            status: clarification_schema_1.ClarificationStatus.PENDING,
        })
            .sort({ priorityRank: 1 })
            .exec();
    }
    async findResolvedByDocumentId(documentId) {
        return this.clarificationModel
            .find({ documentId, status: clarification_schema_1.ClarificationStatus.RESOLVED })
            .sort({ updatedAt: 1 })
            .exec();
    }
    async findById(clarificationId) {
        return this.clarificationModel.findOne({ clarificationId }).exec();
    }
    async updateAnswer(clarificationId, answer, status) {
        return this.clarificationModel.findOneAndUpdate({ clarificationId }, { answer, status }, { new: true }).exec();
    }
    async markResolved(clarificationId) {
        return this.clarificationModel.findOneAndUpdate({ clarificationId }, { status: clarification_schema_1.ClarificationStatus.RESOLVED }, { new: true }).exec();
    }
    async applyPriorityRanks(ranks) {
        const ops = ranks.map((r) => ({
            updateOne: {
                filter: { clarificationId: r.clarificationId },
                update: {
                    $set: {
                        priorityRank: r.priorityRank,
                        priorityBatch: r.priorityBatch,
                        priorityReason: r.priorityReason,
                    },
                },
            },
        }));
        await this.clarificationModel.bulkWrite(ops);
    }
};
exports.ClarificationRepository = ClarificationRepository;
exports.ClarificationRepository = ClarificationRepository = ClarificationRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(clarification_schema_1.Clarification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ClarificationRepository);
//# sourceMappingURL=clarification.repository.js.map