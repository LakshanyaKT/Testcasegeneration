"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestScriptsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const test_script_schema_1 = require("./schemas/test-script.schema");
const document_chunk_schema_1 = require("../document-understanding/schemas/document-chunk.schema");
const test_scripts_controller_1 = require("./controllers/test-scripts.controller");
const test_script_generation_service_1 = require("./services/test-script-generation.service");
const test_script_repository_1 = require("./repositories/test-script.repository");
const clarification_module_1 = require("../clarification/clarification.module");
const test_case_types_module_1 = require("../test-case-types/test-case-types.module");
const llm_service_1 = require("../document-understanding/services/llm.service");
let TestScriptsModule = class TestScriptsModule {
};
exports.TestScriptsModule = TestScriptsModule;
exports.TestScriptsModule = TestScriptsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: test_script_schema_1.TestScript.name, schema: test_script_schema_1.TestScriptSchema },
                { name: document_chunk_schema_1.DocumentChunk.name, schema: document_chunk_schema_1.DocumentChunkSchema },
            ]),
            clarification_module_1.ClarificationModule,
            test_case_types_module_1.TestCaseTypesModule,
        ],
        controllers: [test_scripts_controller_1.TestScriptsController],
        providers: [test_script_generation_service_1.TestScriptGenerationService, test_script_repository_1.TestScriptRepository, llm_service_1.LLMService],
        exports: [test_script_generation_service_1.TestScriptGenerationService],
    })
], TestScriptsModule);
//# sourceMappingURL=test-scripts.module.js.map