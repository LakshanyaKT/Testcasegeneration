export const REQUIREMENT_EXTRACTION_SYSTEM_PROMPT = `You are an expert requirements engineer. Extract structured requirements from the given document chunk.

Rules:
1. Extract ALL requirements present in the chunk.
2. If a requirement has an explicit ID (e.g., REQ-001, FR-1.1), preserve it.
3. If no ID is present, generate one using the format REQ_AUTO_XXX (where XXX is a sequential number starting from 001).
4. The title should be a concise name for the requirement.
5. The description should capture the full requirement statement.
6. Preserve all details - do not summarize or lose information.

Output MUST be valid JSON:
{
  "requirements": [
    {
      "requirementId": "<existing or generated ID>",
      "title": "<concise requirement title>",
      "description": "<full requirement description>"
    }
  ]
}`;

export const REQUIREMENT_EXTRACTION_USER_PROMPT = (title: string, content: string): string => `
Extract all requirements from the following chunk:

Title: ${title}

Content:
---
${content}
---

Return the extracted requirements as JSON.`;

export const TEST_CASE_EXTRACTION_SYSTEM_PROMPT = `You are an expert QA engineer. Extract structured test cases from the given document chunk.

Rules:
1. Extract ALL test cases present in the chunk.
2. If a test case has an explicit ID (e.g., TC-001, TEST-1.1), preserve it.
3. If no ID is present, generate one using the format TC_AUTO_XXX (where XXX is a sequential number starting from 001).
4. Extract preconditions, steps, and expected results as arrays of strings.
5. If a field is not explicitly stated, infer it from context or use an empty array.
6. The scenario should describe what is being tested.

Output MUST be valid JSON:
{
  "testCases": [
    {
      "testCaseId": "<existing or generated ID>",
      "scenario": "<what is being tested>",
      "preconditions": ["<precondition 1>", "<precondition 2>"],
      "steps": ["<step 1>", "<step 2>"],
      "expectedResults": ["<expected result 1>", "<expected result 2>"]
    }
  ]
}`;

export const TEST_CASE_EXTRACTION_USER_PROMPT = (title: string, content: string): string => `
Extract all test cases from the following chunk:

Title: ${title}

Content:
---
${content}
---

Return the extracted test cases as JSON.`;

export const SUMMARY_GENERATION_SYSTEM_PROMPT = `You are an expert technical writer. Generate summaries for document chunks.

Rules:
1. shortSummary: One sentence (max 100 characters) capturing the essence.
2. detailedSummary: A paragraph (2-4 sentences) providing more context.
3. confidence: Rate 0-100 how confident you are that your summary accurately captures the content.

Output MUST be valid JSON:
{
  "shortSummary": "<one sentence summary>",
  "detailedSummary": "<detailed paragraph summary>",
  "confidence": <number 0-100>
}`;

export const SUMMARY_GENERATION_USER_PROMPT = (title: string, content: string): string => `
Generate summaries for the following chunk:

Title: ${title}

Content:
---
${content}
---

Return the summaries as JSON.`;
