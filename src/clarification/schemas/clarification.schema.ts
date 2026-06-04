import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ClarificationDocument = HydratedDocument<Clarification>;

export enum ClarificationStatus {
  PENDING = 'PENDING',
  ANSWERED = 'ANSWERED',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

@Schema({ collection: 'clarifications', timestamps: true })
export class Clarification extends Document {
  @Prop({ required: true, unique: true, index: true })
  clarificationId: string;

  @Prop({ required: true, index: true })
  documentId: string;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ type: String, default: null })
  answer: string | null;

  @Prop({
    required: true,
    enum: ClarificationStatus,
    default: ClarificationStatus.PENDING,
  })
  status: ClarificationStatus;

  // Priority fields — populated after POST /clarifications/:documentId/prioritize
  @Prop({ type: Number, default: null })
  priorityRank: number | null;

  @Prop({ type: String, default: null })
  priorityBatch: string | null;   // batch ID grouping a single prioritize run

  @Prop({ type: String, default: null })
  priorityReason: string | null;  // why Claude ranked it high

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ClarificationSchema = SchemaFactory.createForClass(Clarification);

ClarificationSchema.index({ documentId: 1, status: 1 });
ClarificationSchema.index({ documentId: 1, priorityRank: 1 });
