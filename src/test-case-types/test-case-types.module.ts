import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestCaseTypeSelection, TestCaseTypeSelectionSchema } from './schemas/test-case-type-selection.schema';
import { DocumentChunk, DocumentChunkSchema } from '../document-understanding/schemas/document-chunk.schema';
import { TestCaseTypesController } from './controllers/test-case-types.controller';
import { TestCaseTypeDiscoveryService } from './services/test-case-type-discovery.service';
import { TestCaseTypeSelectionRepository } from './repositories/test-case-type-selection.repository';
import { AnalysisModule } from '../analysis/analysis.module';
import { ClarificationModule } from '../clarification/clarification.module';
import { LLMService } from '../document-understanding/services/llm.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestCaseTypeSelection.name, schema: TestCaseTypeSelectionSchema },
      { name: DocumentChunk.name, schema: DocumentChunkSchema },
    ]),
    AnalysisModule,
    ClarificationModule,
  ],
  controllers: [TestCaseTypesController],
  providers: [TestCaseTypeDiscoveryService, TestCaseTypeSelectionRepository, LLMService],
  exports: [TestCaseTypeDiscoveryService, TestCaseTypeSelectionRepository],
})
export class TestCaseTypesModule {}
