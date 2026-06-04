import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type TestCaseTypeSelectionDocument = HydratedDocument<TestCaseTypeSelection>;

export enum TestCaseTypeSelectionStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
}

export interface SuggestedTestCaseType {
  type: string;
  reason: string;
}

@Schema({ collection: 'test_case_type_selections', timestamps: true })
export class TestCaseTypeSelection extends Document {
  @Prop({ required: true, unique: true, index: true })
  documentId: string;

  @Prop({ type: [String], default: [] })
  detectedTypes: string[];

  @Prop({
    type: [raw({ type: { type: String }, reason: { type: String } })],
    default: [],
  })
  suggestedTypes: SuggestedTestCaseType[];

  @Prop({ type: [String], default: [] })
  finalTypes: string[];

  @Prop({
    required: true,
    enum: TestCaseTypeSelectionStatus,
    default: TestCaseTypeSelectionStatus.PENDING_APPROVAL,
  })
  status: TestCaseTypeSelectionStatus;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TestCaseTypeSelectionSchema = SchemaFactory.createForClass(TestCaseTypeSelection);
