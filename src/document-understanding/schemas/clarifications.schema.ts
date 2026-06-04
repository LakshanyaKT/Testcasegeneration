import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ClarificationsDocument = HydratedDocument<Clarifications>;

@Schema({ collection: 'clarifications', timestamps: true })
export class Clarifications extends Document {
  @Prop({ required: true, index: true })
  documentId: string;

  @Prop({ required: true, index: true })
  projectId: string;

  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({
    type: [
      {
        questionId: { type: String, required: true },
        question: { type: String, required: true },
        category: { type: String, required: true },
        priority: { type: String, required: true },
      },
    ],
    default: [],
  })
  questions: Array<{
    questionId: string;
    question: string;
    category: string;
    priority: string;
  }>;

  @Prop({
    type: [
      {
        questionId: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    default: [],
  })
  answers: Array<{
    questionId: string;
    answer: string;
  }>;

  @Prop({ required: true })
  status: string;
}

export const ClarificationsSchema = SchemaFactory.createForClass(Clarifications);
