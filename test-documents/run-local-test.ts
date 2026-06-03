/**
 * Test script to invoke the local document processing pipeline.
 * 
 * Usage:
 *   1. Start the server: npm run start:dev
 *   2. Run this script: npx ts-node test-documents/run-local-test.ts
 */

const API_URL = process.env.API_URL || 'http://localhost:3001';

async function main() {
  const payload = {
    documentId: 'DOC_LOCAL_TEST_001',
    filePath: './test-documents/sample-frs.md',
  };

  console.log('='.repeat(60));
  console.log('Document Understanding Pipeline - Local Test');
  console.log('='.repeat(60));
  console.log(`\nEndpoint: POST ${API_URL}/documents/process-local`);
  console.log(`Document: ${payload.filePath}`);
  console.log(`Document ID: ${payload.documentId}`);
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
    console.log('RESULTS');
    console.log('='.repeat(60));
    console.log(`\nTotal Chunks: ${result.totalChunks}`);
    console.log(`  Requirements: ${result.requirementChunks}`);
    console.log(`  Test Cases:   ${result.testCaseChunks}`);
    console.log(`  Unknown:      ${result.unknownChunks}`);

    console.log('\n' + '-'.repeat(60));
    console.log('CHUNKS DETAIL');
    console.log('-'.repeat(60));

    for (const chunk of result.chunks) {
      console.log(`\n[#${chunk.chunkNumber}] ${chunk.chunkType} - "${chunk.title}"`);
      console.log(`  Confidence: ${chunk.classification.confidence}%`);
      console.log(`  Summary: ${chunk.summary.shortSummary}`);
      console.log(`  Page Range: ${chunk.pageRange.startPage}-${chunk.pageRange.endPage}`);

      if (chunk.chunkType === 'REQUIREMENT' && chunk.extractedData.requirements) {
        console.log(`  Extracted Requirements:`);
        for (const req of chunk.extractedData.requirements) {
          console.log(`    - [${req.requirementId}] ${req.title}`);
        }
      }

      if (chunk.chunkType === 'TEST_CASE' && chunk.extractedData.testCases) {
        console.log(`  Extracted Test Cases:`);
        for (const tc of chunk.extractedData.testCases) {
          console.log(`    - [${tc.testCaseId}] ${tc.scenario}`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('DONE - Results stored in MongoDB');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('Failed to connect to server:', error.message);
    console.error('\nMake sure the server is running: npm run start:dev');
    process.exit(1);
  }
}

main();
