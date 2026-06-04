/**
 * Test script to invoke the local document-centric processing pipeline.
 * 
 * Usage:
 *   1. Start the server: npm run start:dev
 *   2. Run this script: npx ts-node test-documents/run-local-test.ts
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function main() {
  const payload = {
    projectId: 'PRJ_LOCAL_TEST_001',
    sessionId: 'SES_LOCAL_TEST_001',
    documentId: 'DOC_LOCAL_TEST_001',
    filePath: './test-documents/sample-frs.md',
  };

  console.log('='.repeat(60));
  console.log('Document-Centric Understanding Pipeline - Local Test');
  console.log('='.repeat(60));
  console.log(`\nEndpoint: POST ${API_URL}/documents/process-local`);
  console.log(`Project ID:  ${payload.projectId}`);
  console.log(`Session ID:  ${payload.sessionId}`);
  console.log(`Document ID: ${payload.documentId}`);
  console.log(`File Path:   ${payload.filePath}`);
  console.log('\nSending request...\n');

  try {
    const response = await fetch(`${API_URL}/documents/process-local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`ERROR (${response.status}): ${error}`);
      process.exit(1);
    }

    const result = await response.json();

    console.log('='.repeat(60));
    console.log('DECISION ENGINE RESULT');
    console.log('='.repeat(60));
    console.log(`\nStatus:        ${result.status}`);
    console.log(`Document ID:   ${result.documentId}`);
    
    if (result.analysis) {
      console.log(`Confidence:    ${result.analysis.confidence}%`);
      console.log(`Completeness:  ${result.analysis.completenessScore}%`);
      console.log(`Type:          ${result.analysis.documentType}`);
      console.log(`Summary:       ${result.analysis.summary}`);
    }

    if (result.status === 'NEEDS_CLARIFICATION') {
      console.log('\n' + '-'.repeat(60));
      console.log(`CLARIFICATION QUESTIONS DETECTED (${result.questions?.length || 0})`);
      console.log('-'.repeat(60));
      
      for (const question of result.questions || []) {
        console.log(`\n[${question.questionId}] [Priority: ${question.priority}] (${question.category}):`);
        console.log(`  Q: ${question.question}`);
      }
    } else if (result.status === 'READY') {
      console.log('\n' + '-'.repeat(60));
      console.log('GENERATED TEST CASES');
      console.log('-'.repeat(60));
      
      for (const tc of result.testCases || []) {
        console.log(`\n[${tc.testCaseId}] [${tc.type}] [Priority: ${tc.priority}] - "${tc.title}"`);
        console.log(`  Requirements:  ${tc.requirementIds?.join(', ') || 'None'}`);
        console.log(`  Preconditions: ${tc.preConditions?.join('; ') || 'None'}`);
        console.log(`  Steps:`);
        tc.steps?.forEach((step: string, idx: number) => console.log(`    ${idx + 1}. ${step}`));
        console.log(`  Expected:      ${tc.expectedResults?.join('; ') || 'None'}`);
      }

      if (result.coverage) {
        console.log('\n' + '-'.repeat(60));
        console.log('COVERAGE ANALYSIS');
        console.log('-'.repeat(60));
        console.log(`Requirements Covered: ${result.coverage.requirementsCovered}`);
        console.log(`Requirements Total:   ${result.coverage.requirementsTotal}`);
        console.log(`Coverage Percentage:  ${result.coverage.coveragePercentage}%`);
      }
    }

    if (result.nextAction) {
      console.log(`\nNext Action: ${result.nextAction}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('DONE - Results processed and saved to MongoDB');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('Failed to connect to server:', error.message);
    console.error('\nMake sure the server is running: npm run start:dev');
    process.exit(1);
  }
}

main();
