import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestScript, TestScriptSchema } from './schemas/test-script.schema';
import { DocumentChunk, DocumentChunkSchema } from '../document-understanding/schemas/document-chunk.schema';
import { TestScriptsController } from './controllers/test-scripts.controller';
import { TestScriptGenerationService } from './services/test-script-generation.service';
import { TestScriptRepository } from './repositories/test-script.repository';
import { ClarificationModule } from '../clarification/clarification.module';
import { TestCaseTypesModule } from '../test-case-types/test-case-types.module';
import { LLMService } from '../document-understanding/services/llm.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestScript.name, schema: TestScriptSchema },
      { name: DocumentChunk.name, schema: DocumentChunkSchema },
    ]),
    ClarificationModule,
    TestCaseTypesModule,
  ],
  controllers: [TestScriptsController],
  providers: [TestScriptGenerationService, TestScriptRepository, LLMService],
  exports: [TestScriptGenerationService],
})
export class TestScriptsModule {}
