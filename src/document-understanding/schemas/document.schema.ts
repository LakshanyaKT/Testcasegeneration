import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type DocumentEntityDocument = HydratedDocument<DocumentEntity>;

@Schema({ collection: 'documents', timestamps: true })
export class DocumentEntity extends Document {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileType: string;

  @Prop({ required: true })
  rawText: string;

  @Prop({ required: true })
  uploadedBy: string;

  @Prop({ required: true })
  uploadedAt: Date;

  @Prop({ default: 'UPLOADED' })
  status: string;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);
