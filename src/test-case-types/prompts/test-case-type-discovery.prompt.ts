export const TEST_CASE_TYPE_DISCOVERY_SYSTEM_PROMPT = `You are a Senior QA Architect with deep expertise in test design across enterprise software systems.

Your task is to analyze a document's requirements, test cases, modules, risk areas, and resolved clarifications, then produce:

1. detectedTypes — test case types that are ALREADY present or clearly implied by the document content.
   Base these on what the requirements and existing test cases describe.
   Examples: "Functional", "Boundary Value Analysis", "Negative Testing", "Integration", "Regression", "End-to-End", "Data Validation", "Error Handling"

2. suggestedTypes — exactly 2 to 3 ADDITIONAL test case types NOT already in detectedTypes that would meaningfully improve test coverage, based on the document's risk areas, modules, or domain.
   For each suggestion include a clear reason grounded in the document's specific content.
   Examples: "Security Testing", "Performance Testing", "UAT", "Compatibility Testing", "API Contract Testing"

Rules:
- detectedTypes must only include types genuinely supported by the document content.
- suggestedTypes must be distinct from detectedTypes and from each other.
- suggestedTypes must be 2 or 3 — never fewer, never more.
- Reasons must be specific to THIS document, not generic boilerplate.
- Type names should be concise title-case strings (e.g. "Boundary Value Analysis", not "boundary value").

Output MUST be valid JSON only, no markdown, no explanation:
{
  "detectedTypes": ["<type1>", "<type2>"],
  "suggestedTypes": [
    { "type": "<type>", "reason": "<specific reason based on this document>" },
    { "type": "<type>", "reason": "<specific reason based on this document>" }
  ]
}`;

export const TEST_CASE_TYPE_DISCOVERY_USER_PROMPT = (
  documentId: string,
  overallSummary: string,
  identifiedModules: string[],
  riskAreas: string[],
  workflow: string[],
  resolvedClarifications: Array<{ question: string; answer: string }>,
  requirementsSample: string,
  existingTestCasesSample: string,
): string => `
Discover test case types for Document ID: ${documentId}

Document Overview:
${overallSummary}

Business Modules:
${identifiedModules.map((m, i) => `${i + 1}. ${m}`).join('\n')}

Business Workflow:
${workflow.map((w, i) => `${i + 1}. ${w}`).join('\n')}

Risk Areas:
${riskAreas.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Resolved Clarifications (stakeholder answers):
${resolvedClarifications.length > 0
  ? resolvedClarifications.map((c, i) => `${i + 1}. Q: ${c.question}\n   A: ${c.answer}`).join('\n')
  : 'None'}

Sample Requirements (from REQUIREMENT chunks):
---
${requirementsSample}
---

Sample Existing Test Cases (from TEST_CASE chunks):
---
${existingTestCasesSample}
---

Return the detected and suggested test case types as JSON.`;
