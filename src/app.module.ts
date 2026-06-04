import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentUnderstandingModule } from './document-understanding/document-understanding.module';
import { AnalysisModule } from './analysis/analysis.module';
import { ClarificationModule } from './clarification/clarification.module';
import { AgentsModule } from './agents/agents.module';
import { FrsUploadModule } from './frs-upload/frs-upload.module';
import { TestCaseTypesModule } from './test-case-types/test-case-types.module';
import { TestScriptsModule } from './test-scripts/test-scripts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/document-understanding',
    ),
    DocumentUnderstandingModule,
    AnalysisModule,
    ClarificationModule,
    AgentsModule,
    FrsUploadModule,
    TestCaseTypesModule,
    TestScriptsModule,
  ],
})
export class AppModule {}
