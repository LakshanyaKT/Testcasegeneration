"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const document_understanding_module_1 = require("./document-understanding/document-understanding.module");
const analysis_module_1 = require("./analysis/analysis.module");
const clarification_module_1 = require("./clarification/clarification.module");
const agents_module_1 = require("./agents/agents.module");
const frs_upload_module_1 = require("./frs-upload/frs-upload.module");
const test_case_types_module_1 = require("./test-case-types/test-case-types.module");
const test_scripts_module_1 = require("./test-scripts/test-scripts.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/document-understanding'),
            document_understanding_module_1.DocumentUnderstandingModule,
            analysis_module_1.AnalysisModule,
            clarification_module_1.ClarificationModule,
            agents_module_1.AgentsModule,
            frs_upload_module_1.FrsUploadModule,
            test_case_types_module_1.TestCaseTypesModule,
            test_scripts_module_1.TestScriptsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map