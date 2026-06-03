import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type DocumentEntityDocument = HydratedDocument<DocumentEntity>;

@Schema({ collection: 'documents', timestamps: true })
export class DocumentEntity extends Document {
  @Prop({ required: true, unique: true })
  documentId: string;

  @Prop({ required: true })
  originalMarkdown: string;

  @Prop({ default: 'PROCESSED' })
  status: string;

  @Prop()
  totalChunks: number;

  @Prop()
  requirementChunks: number;

  @Prop()
  testCaseChunks: number;

  @Prop()
  unknownChunks: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);
