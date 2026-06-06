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
var TestScriptsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestScriptsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const test_script_generation_service_1 = require("../services/test-script-generation.service");
const dto_1 = require("../dto");
let TestScriptsController = TestScriptsController_1 = class TestScriptsController {
    constructor(generationService) {
        this.generationService = generationService;
        this.logger = new common_1.Logger(TestScriptsController_1.name);
    }
    async generateTestScripts(documentId) {
        this.logger.log(`Generate test scripts for: ${documentId}`);
        return this.generationService.generateTestScripts(documentId);
    }
    async getTestScripts(documentId) {
        return this.generationService.getTestScripts(documentId);
    }
    async getTestScriptsSummary(documentId) {
        return this.generationService.getTestScriptsSummary(documentId);
    }
};
exports.TestScriptsController = TestScriptsController;
__decorate([
    (0, common_1.Post)(':documentId/generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate test scripts for a document',
        description: 'Requires test case types to be APPROVED first (POST /test-case-types/:documentId/approve). ' +
            'Runs two parallel tracks: ' +
            'Track A — generates new scripts from REQUIREMENT chunks using requirements[] + finalTypes. ' +
            'Track B — enriches and extends existing TEST_CASE chunks covering all finalTypes. ' +
            'All resolved clarification answers are injected into both prompts as authoritative business rules. ' +
            'Clears and replaces any previously generated scripts for this document.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Test scripts generated. Returns full list grouped by type.',
        type: dto_1.GenerateTestScriptsResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Types not yet approved — run /approve first' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No type selection or chunks found' }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestScriptsController.prototype, "generateTestScripts", null);
__decorate([
    (0, common_1.Get)(':documentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all generated test scripts for a document',
        description: 'Returns all test scripts grouped by testCaseType (Functional, Boundary Value, etc.).',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.GetTestScriptsResponseDto }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestScriptsController.prototype, "getTestScripts", null);
__decorate([
    (0, common_1.Get)(':documentId/summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a count summary of generated test scripts',
        description: 'Returns total counts broken down by testCaseType, source track (REQUIREMENT/TEST_CASE), and priority (HIGH/MEDIUM/LOW).',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.TestScriptsSummaryDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No scripts found — run generate first' }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestScriptsController.prototype, "getTestScriptsSummary", null);
exports.TestScriptsController = TestScriptsController = TestScriptsController_1 = __decorate([
    (0, swagger_1.ApiTags)('Test Scripts'),
    (0, common_1.Controller)('test-scripts'),
    __metadata("design:paramtypes", [test_script_generation_service_1.TestScriptGenerationService])
], TestScriptsController);
//# sourceMappingURL=test-scripts.controller.js.map