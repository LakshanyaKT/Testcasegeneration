import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentUnderstandingController } from './controllers/document-understanding.controller';
import {
  LLMService,
  S3DocumentService,
  DocumentParsingService,
  SectionDiscoveryService,
  SemanticChunkingService,
  ChunkClassificationService,
  KnowledgeExtractionService,
  DocumentProcessingService,
} from './services';
import { DocumentEntity, DocumentSchema } from './schemas/document.schema';
import { DocumentChunk, DocumentChunkSchema } from './schemas/document-chunk.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentEntity.name, schema: DocumentSchema },
      { name: DocumentChunk.name, schema: DocumentChunkSchema },
    ]),
  ],
  controllers: [DocumentUnderstandingController],
  providers: [
    LLMService,
    S3DocumentService,
    DocumentParsingService,
    SectionDiscoveryService,
    SemanticChunkingService,
    ChunkClassificationService,
    KnowledgeExtractionService,
    DocumentProcessingService,
  ],
  exports: [DocumentProcessingService],
})
export class DocumentUnderstandingModule {}
