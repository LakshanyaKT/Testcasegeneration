/**
 * Generates a unique section ID based on index and title.
 */
export function generateSectionId(index: number, title: string): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 30);
  return `SEC_${String(index + 1).padStart(3, '0')}_${sanitized}`;
}

/**
 * Generates an auto requirement ID.
 */
export function generateRequirementId(index: number): string {
  return `REQ_AUTO_${String(index + 1).padStart(3, '0')}`;
}

/**
 * Generates an auto test case ID.
 */
export function generateTestCaseId(index: number): string {
  return `TC_AUTO_${String(index + 1).padStart(3, '0')}`;
}
