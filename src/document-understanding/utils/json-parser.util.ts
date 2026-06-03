import { Logger } from '@nestjs/common';

const logger = new Logger('JsonParser');

/**
 * Extracts and parses JSON from LLM response text.
 * Handles cases where JSON is wrapped in markdown code blocks or has extra text.
 */
export function parseJsonFromLLMResponse<T>(response: string): T {
  // Try direct parse first
  try {
    return JSON.parse(response) as T;
  } catch {
    // Continue to extraction methods
  }

  // Try extracting from markdown code blocks
  const codeBlockMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch {
      logger.warn('Found code block but failed to parse JSON from it');
    }
  }

  // Try finding JSON object pattern
  const jsonObjectMatch = response.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) {
    try {
      return JSON.parse(jsonObjectMatch[0]) as T;
    } catch {
      logger.warn('Found JSON-like pattern but failed to parse');
    }
  }

  // Try finding JSON array pattern
  const jsonArrayMatch = response.match(/\[[\s\S]*\]/);
  if (jsonArrayMatch) {
    try {
      return JSON.parse(jsonArrayMatch[0]) as T;
    } catch {
      logger.warn('Found JSON array pattern but failed to parse');
    }
  }

  throw new Error(`Failed to parse JSON from LLM response: ${response.substring(0, 200)}...`);
}
