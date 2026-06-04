import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Clarification, ClarificationSchema } from './schemas/clarification.schema';
import { ClarificationController } from './controllers/clarification.controller';
import { ClarificationService } from './services/clarification.service';
import { ClarificationRepository } from './repositories/clarification.repository';
import { AnalysisModule } from '../analysis/analysis.module';
import { LLMService } from '../document-understanding/services/llm.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Clarification.name, schema: ClarificationSchema },
    ]),
    AnalysisModule,
  ],
  controllers: [ClarificationController],
  providers: [ClarificationService, ClarificationRepository, LLMService],
  exports: [ClarificationService],
})
export class ClarificationModule {}
