import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { ChunkType } from '../interfaces';

export type DocumentChunkDocument = HydratedDocument<DocumentChunk>;

@Schema({ collection: 'document_chunks', timestamps: true })
export class DocumentChunk extends Document {
  @Prop({ required: true, index: true })
  documentId: string;

  @Prop({ required: true })
  chunkNumber: number;

  @Prop({ required: true, enum: ChunkType })
  chunkType: ChunkType;

  @Prop({ required: true })
  title: string;

  @Prop(
    raw({
      startPage: { type: Number, required: true },
      endPage: { type: Number, required: true },
    }),
  )
  pageRange: { startPage: number; endPage: number };

  @Prop({ required: true })
  content: string;

  @Prop(
    raw({
      shortSummary: { type: String, required: true },
      detailedSummary: { type: String, required: true },
      confidence: { type: Number, required: true },
    }),
  )
  summary: { shortSummary: string; detailedSummary: string; confidence: number };

  @Prop(
    raw({
      confidence: { type: Number, required: true },
    }),
  )
  classification: { confidence: number };

  @Prop({ type: Object, required: true })
  extractedData: Record<string, any>;

  @Prop(
    raw({
      chunkingStrategy: { type: String, default: 'AI_SEMANTIC' },
      summaryGenerated: { type: Boolean, default: false },
      extractionCompleted: { type: Boolean, default: false },
    }),
  )
  processing: {
    chunkingStrategy: string;
    summaryGenerated: boolean;
    extractionCompleted: boolean;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DocumentChunkSchema = SchemaFactory.createForClass(DocumentChunk);

DocumentChunkSchema.index({ documentId: 1, chunkNumber: 1 }, { unique: true });
