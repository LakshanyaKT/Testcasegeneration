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
exports.RespondClarificationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const clarification_response_dto_1 = require("./clarification-response.dto");
const dto_1 = require("../../analysis/dto");
class RespondClarificationResponseDto {
}
exports.RespondClarificationResponseDto = RespondClarificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: clarification_response_dto_1.ClarificationResponseDto }),
    __metadata("design:type", clarification_response_dto_1.ClarificationResponseDto)
], RespondClarificationResponseDto.prototype, "clarification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: dto_1.AnalyzeDocumentResponseDto }),
    __metadata("design:type", dto_1.AnalyzeDocumentResponseDto)
], RespondClarificationResponseDto.prototype, "updatedAnalysis", void 0);
//# sourceMappingURL=respond-clarification-response.dto.js.map