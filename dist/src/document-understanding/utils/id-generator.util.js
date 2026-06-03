"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSectionId = generateSectionId;
exports.generateRequirementId = generateRequirementId;
exports.generateTestCaseId = generateTestCaseId;
function generateSectionId(index, title) {
    const sanitized = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 30);
    return `SEC_${String(index + 1).padStart(3, '0')}_${sanitized}`;
}
function generateRequirementId(index) {
    return `REQ_AUTO_${String(index + 1).padStart(3, '0')}`;
}
function generateTestCaseId(index) {
    return `TC_AUTO_${String(index + 1).padStart(3, '0')}`;
}
//# sourceMappingURL=id-generator.util.js.map