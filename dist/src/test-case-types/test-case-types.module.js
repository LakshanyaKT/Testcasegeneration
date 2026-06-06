"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseTypesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const test_case_type_selection_schema_1 = require("./schemas/test-case-type-selection.schema");
const document_chunk_schema_1 = require("../document-understanding/schemas/document-chunk.schema");
const test_case_types_controller_1 = require("./controllers/test-case-types.controller");
const test_case_type_discovery_service_1 = require("./services/test-case-type-discovery.service");
const test_case_type_selection_repository_1 = require("./repositories/test-case-type-selection.repository");
const analysis_module_1 = require("../analysis/analysis.module");
const clarification_module_1 = require("../clarification/clarification.module");
const llm_service_1 = require("../document-understanding/services/llm.service");
let TestCaseTypesModule = class TestCaseTypesModule {
};
exports.TestCaseTypesModule = TestCaseTypesModule;
exports.TestCaseTypesModule = TestCaseTypesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: test_case_type_selection_schema_1.TestCaseTypeSelection.name, schema: test_case_type_selection_schema_1.TestCaseTypeSelectionSchema },
                { name: document_chunk_schema_1.DocumentChunk.name, schema: document_chunk_schema_1.DocumentChunkSchema },
            ]),
            analysis_module_1.AnalysisModule,
            clarification_module_1.ClarificationModule,
        ],
        controllers: [test_case_types_controller_1.TestCaseTypesController],
        providers: [test_case_type_discovery_service_1.TestCaseTypeDiscoveryService, test_case_type_selection_repository_1.TestCaseTypeSelectionRepository, llm_service_1.LLMService],
        exports: [test_case_type_discovery_service_1.TestCaseTypeDiscoveryService, test_case_type_selection_repository_1.TestCaseTypeSelectionRepository],
    })
], TestCaseTypesModule);
//# sourceMappingURL=test-case-types.module.js.map