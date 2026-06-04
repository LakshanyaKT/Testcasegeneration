import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type TestCasesDocument = HydratedDocument<TestCases>;

@Schema({ collection: 'test_cases', timestamps: true })
export class TestCases extends Document {
  @Prop({ required: true, index: true })
  documentId: string;

  @Prop({ required: true, index: true })
  projectId: string;

  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({
    type: [
      {
        testCaseId: { type: String, required: true },
        title: { type: String, required: true },
        priority: { type: String, required: true },
        type: { type: String, required: true },
        requirementIds: { type: [String], default: [] },
        preConditions: { type: [String], default: [] },
        steps: { type: [String], default: [] },
        expectedResults: { type: [String], default: [] },
        testData: { type: [Object], default: [] },
      },
    ],
    default: [],
  })
  testCases: Array<{
    testCaseId: string;
    title: string;
    priority: string;
    type: string;
    requirementIds: string[];
    preConditions: string[];
    steps: string[];
    expectedResults: string[];
    testData: any[];
  }>;

  @Prop({
    type: {
      requirementsCovered: { type: Number, required: true },
      requirementsTotal: { type: Number, required: true },
      coveragePercentage: { type: Number, required: true },
    },
    required: true,
  })
  coverage: {
    requirementsCovered: number;
    requirementsTotal: number;
    coveragePercentage: number;
  };
}

export const TestCasesSchema = SchemaFactory.createForClass(TestCases);
