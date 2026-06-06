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
var TestCaseTypesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCaseTypesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const test_case_type_discovery_service_1 = require("../services/test-case-type-discovery.service");
const dto_1 = require("../dto");
let TestCaseTypesController = TestCaseTypesController_1 = class TestCaseTypesController {
    constructor(discoveryService) {
        this.discoveryService = discoveryService;
        this.logger = new common_1.Logger(TestCaseTypesController_1.name);
    }
    async discoverTestCaseTypes(documentId) {
        this.logger.log(`Discover test case types for: ${documentId}`);
        return this.discoveryService.discoverTestCaseTypes(documentId);
    }
    async getTypeSelection(documentId) {
        return this.discoveryService.getTypeSelection(documentId);
    }
    async approveTypes(documentId, dto) {
        this.logger.log(`Approve types for: ${documentId} — [${dto.approvedTypes.join(', ')}]`);
        return this.discoveryService.approveTypes(documentId, dto.approvedTypes);
    }
};
exports.TestCaseTypesController = TestCaseTypesController;
__decorate([
    (0, common_1.Post)(':documentId/discover'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Discover and suggest test case types for a document',
        description: 'Reads document chunks, analysis, and resolved clarification answers. ' +
            'Claude detects test case types already present/implied in the document (detectedTypes) ' +
            'and recommends 2-3 additional types based on risk areas (suggestedTypes). ' +
            'Result stored in test_case_type_selections with status PENDING_APPROVAL.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.TestCaseTypeSelectionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Analysis or chunks not found' }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestCaseTypesController.prototype, "discoverTestCaseTypes", null);
__decorate([
    (0, common_1.Get)(':documentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current test case type selection state',
        description: 'Returns detected types, AI-suggested types, approved finalTypes, and current status. ' +
            'Status is PENDING_APPROVAL until the user calls /approve.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.TestCaseTypeSelectionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No selection found — run discover first' }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestCaseTypesController.prototype, "getTypeSelection", null);
__decorate([
    (0, common_1.Post)(':documentId/approve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Approve and freeze the final test case types',
        description: 'User submits their chosen types from the detected + suggested pool. ' +
            'Validates all submitted types are in the allowed set. ' +
            'Stores finalTypes and sets status to APPROVED. ' +
            'Test script generation is gated on this approval — POST /test-scripts/:documentId/generate will reject until APPROVED.',
    }),
    (0, swagger_1.ApiParam)({ name: 'documentId', example: 'DOC001' }),
    (0, swagger_1.ApiBody)({ type: dto_1.ApproveTestCaseTypesDto }),
    (0, swagger_1.ApiResponse)({ status: 200, type: dto_1.TestCaseTypeSelectionResponseDto, description: 'Types approved. Status set to APPROVED.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid types submitted — not in detected or suggested pool' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No selection found — run discover first' }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ApproveTestCaseTypesDto]),
    __metadata("design:returntype", Promise)
], TestCaseTypesController.prototype, "approveTypes", null);
exports.TestCaseTypesController = TestCaseTypesController = TestCaseTypesController_1 = __decorate([
    (0, swagger_1.ApiTags)('Test Case Types'),
    (0, common_1.Controller)('test-case-types'),
    __metadata("design:paramtypes", [test_case_type_discovery_service_1.TestCaseTypeDiscoveryService])
], TestCaseTypesController);
//# sourceMappingURL=test-case-types.controller.js.map