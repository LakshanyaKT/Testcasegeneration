"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsonFromLLMResponse = parseJsonFromLLMResponse;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('JsonParser');
function parseJsonFromLLMResponse(response) {
    try {
        return JSON.parse(response);
    }
    catch {
    }
    const codeBlockMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (codeBlockMatch) {
        try {
            return JSON.parse(codeBlockMatch[1].trim());
        }
        catch {
            logger.warn('Found code block but failed to parse JSON from it');
        }
    }
    const jsonObjectMatch = response.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
        try {
            return JSON.parse(jsonObjectMatch[0]);
        }
        catch {
            logger.warn('Found JSON-like pattern but failed to parse');
        }
    }
    const jsonArrayMatch = response.match(/\[[\s\S]*\]/);
    if (jsonArrayMatch) {
        try {
            return JSON.parse(jsonArrayMatch[0]);
        }
        catch {
            logger.warn('Found JSON array pattern but failed to parse');
        }
    }
    throw new Error(`Failed to parse JSON from LLM response: ${response.substring(0, 200)}...`);
}
//# sourceMappingURL=json-parser.util.js.map