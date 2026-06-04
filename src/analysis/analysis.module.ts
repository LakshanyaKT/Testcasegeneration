import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentAnalysis, DocumentAnalysisSchema } from './schemas/document-analysis.schema';
import { DocumentChunk, DocumentChunkSchema } from '../document-understanding/schemas/document-chunk.schema';
import { DocumentAnalysisController } from './controllers/document-analysis.controller';
import { DocumentAnalysisService } from './services/document-analysis.service';
import { DocumentAnalysisRepository } from './repositories/document-analysis.repository';
import { LLMService } from '../document-understanding/services/llm.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentAnalysis.name, schema: DocumentAnalysisSchema },
      { name: DocumentChunk.name, schema: DocumentChunkSchema },
    ]),
  ],
  controllers: [DocumentAnalysisController],
  providers: [DocumentAnalysisService, DocumentAnalysisRepository, LLMService],
  exports: [DocumentAnalysisService, DocumentAnalysisRepository],
})
export class AnalysisModule {}
