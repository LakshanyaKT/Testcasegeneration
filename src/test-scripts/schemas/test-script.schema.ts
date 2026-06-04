import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type TestScriptDocument = HydratedDocument<TestScript>;

export enum TestScriptPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum TestScriptSourceTrack {
  REQUIREMENT = 'REQUIREMENT',
  TEST_CASE = 'TEST_CASE',
}

@Schema({ collection: 'test_scripts', timestamps: true })
export class TestScript extends Document {
  @Prop({ required: true, unique: true, index: true })
  testScriptId: string;

  @Prop({ required: true, index: true })
  documentId: string;

  @Prop({ required: true })
  chunkId: string;

  @Prop({ required: true })
  chunkTitle: string;

  @Prop({ required: true, enum: TestScriptSourceTrack })
  sourceTrack: TestScriptSourceTrack;

  @Prop({ required: true })
  testCaseType: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: String, default: null })
  sourceRequirementId: string | null;

  @Prop({ type: String, default: null })
  sourceTestCaseId: string | null;

  @Prop({ type: [String], default: [] })
  preconditions: string[];

  @Prop({ type: [String], default: [] })
  steps: string[];

  @Prop({ type: [String], default: [] })
  expectedResults: string[];

  @Prop({
    required: true,
    enum: TestScriptPriority,
    default: TestScriptPriority.MEDIUM,
  })
  priority: TestScriptPriority;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TestScriptSchema = SchemaFactory.createForClass(TestScript);
TestScriptSchema.index({ documentId: 1, testCaseType: 1 });
TestScriptSchema.index({ documentId: 1, sourceTrack: 1 });
