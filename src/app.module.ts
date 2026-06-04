import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentUnderstandingModule } from './document-understanding/document-understanding.module';
import { AnalysisModule } from './analysis/analysis.module';
import { ClarificationModule } from './clarification/clarification.module';
import { AgentsModule } from './agents/agents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/document-understanding',
    ),
    DocumentUnderstandingModule,
    AnalysisModule,
    ClarificationModule,
    AgentsModule,
  ],
})
export class AppModule {}
