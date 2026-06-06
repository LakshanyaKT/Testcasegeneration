"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClarificationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const clarification_schema_1 = require("./schemas/clarification.schema");
const clarification_controller_1 = require("./controllers/clarification.controller");
const clarification_service_1 = require("./services/clarification.service");
const clarification_repository_1 = require("./repositories/clarification.repository");
const analysis_module_1 = require("../analysis/analysis.module");
const llm_service_1 = require("../document-understanding/services/llm.service");
let ClarificationModule = class ClarificationModule {
};
exports.ClarificationModule = ClarificationModule;
exports.ClarificationModule = ClarificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: clarification_schema_1.Clarification.name, schema: clarification_schema_1.ClarificationSchema },
            ]),
            analysis_module_1.AnalysisModule,
        ],
        controllers: [clarification_controller_1.ClarificationController],
        providers: [clarification_service_1.ClarificationService, clarification_repository_1.ClarificationRepository, llm_service_1.LLMService],
        exports: [clarification_service_1.ClarificationService, clarification_repository_1.ClarificationRepository],
    })
], ClarificationModule);
//# sourceMappingURL=clarification.module.js.map