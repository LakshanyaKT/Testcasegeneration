import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentUnderstandingController } from './controllers/document-understanding.controller';
import {
  LLMService,
  S3DocumentService,
  DocumentParsingService,
  DocumentProcessingService,
} from './services';

import { DocumentEntity, DocumentSchema } from './schemas/document.schema';
import { DocumentUnderstanding, DocumentUnderstandingSchema } from './schemas/document-understanding.schema';
import { ProjectKnowledge, ProjectKnowledgeSchema } from './schemas/project-knowledge.schema';
import { Clarifications, ClarificationsSchema } from './schemas/clarifications.schema';
import { TestCases, TestCasesSchema } from './schemas/test-cases.schema';
import { AgentRuns, AgentRunsSchema } from './schemas/agent-runs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentEntity.name, schema: DocumentSchema },
      { name: DocumentUnderstanding.name, schema: DocumentUnderstandingSchema },
      { name: ProjectKnowledge.name, schema: ProjectKnowledgeSchema },
      { name: Clarifications.name, schema: ClarificationsSchema },
      { name: TestCases.name, schema: TestCasesSchema },
      { name: AgentRuns.name, schema: AgentRunsSchema },
    ]),
  ],
  controllers: [DocumentUnderstandingController],
  providers: [
    LLMService,
    S3DocumentService,
    DocumentParsingService,
    DocumentProcessingService,
  ],
  exports: [DocumentProcessingService],
})
export class DocumentUnderstandingModule {}
