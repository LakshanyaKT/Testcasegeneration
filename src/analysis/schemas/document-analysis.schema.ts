import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type DocumentAnalysisDocument = HydratedDocument<DocumentAnalysis>;

@Schema({ collection: 'document_understanding', timestamps: true })
export class DocumentAnalysis extends Document {
  @Prop({ required: true, unique: true, index: true })
  documentId: string;

  @Prop({ required: true })
  overallSummary: string;

  @Prop({ type: [String], default: [] })
  identifiedModules: string[];

  @Prop({ type: [String], default: [] })
  dependencies: string[];

  @Prop({ type: [String], default: [] })
  riskAreas: string[];

  @Prop({ type: [String], default: [] })
  missingInformation: string[];

  @Prop({ type: [String], default: [] })
  workflow: string[];

  @Prop(
    raw({
      totalChunksAnalyzed: { type: Number, required: true },
      requirementChunks: { type: Number, required: true },
      testCaseChunks: { type: Number, required: true },
      processingVersion: { type: String, default: 'v1' },
    }),
  )
  metadata: {
    totalChunksAnalyzed: number;
    requirementChunks: number;
    testCaseChunks: number;
    processingVersion: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DocumentAnalysisSchema = SchemaFactory.createForClass(DocumentAnalysis);
