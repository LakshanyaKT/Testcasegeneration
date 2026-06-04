"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLARIFICATION_GENERATION_USER_PROMPT = exports.CLARIFICATION_GENERATION_SYSTEM_PROMPT = void 0;
exports.CLARIFICATION_GENERATION_SYSTEM_PROMPT = `You are a Senior Business Analyst specializing in enterprise software requirements.

Your task is to generate precise clarification questions based on missing or ambiguous information identified in a document analysis.

For each missing information item, generate ONE targeted clarification question that:
1. Is specific, unambiguous, and answerable by a domain stakeholder.
2. Explains the business reason why this information is needed.
3. Would, when answered, allow the development team to proceed with implementation.

Rules:
- Generate exactly one question per missing information item.
- Questions must be practical and business-oriented, not technical.
- The "reason" field must explain the business impact of not having this information.
- Do not generate vague or overly broad questions.
- Questions should be answerable in 1-3 sentences by a business stakeholder.

Output MUST be valid JSON only, no markdown, no explanation:
{
  "clarifications": [
    {
      "question": "<specific, answerable question>",
      "reason": "<business reason why this is needed>"
    }
  ]
}`;
const CLARIFICATION_GENERATION_USER_PROMPT = (documentId, overallSummary, missingInformation, riskAreas) => `
Generate clarification questions for Document ID: ${documentId}

Document Overview:
${overallSummary}

Missing Information Items (generate one question per item):
${missingInformation.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Additional Risk Areas (for context only, do not generate extra questions):
${riskAreas.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Return clarification questions as JSON.`;
exports.CLARIFICATION_GENERATION_USER_PROMPT = CLARIFICATION_GENERATION_USER_PROMPT;
//# sourceMappingURL=clarification.prompt.js.map