import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type AgentDocument = HydratedDocument<Agent>;

@Schema({ collection: 'agents', timestamps: false })
export class Agent extends Document {
  @Prop(
    raw({
      agent_key: { type: String, required: true },
      display_name: { type: String, required: true },
      module: { type: String, required: true },
      mode: { type: String, default: 'FRS_DRIVEN' },
      status: { type: String, default: 'DRAFT' },
      review_status: { type: String, default: 'DRAFT' },
      created_by: { type: String, required: true },
      created_on: { type: Date, default: Date.now },
      started_on: { type: Date, default: null },
      completed_on: { type: Date, default: null },
    }),
  )
  about: {
    agent_key: string;
    display_name: string;
    module: string;
    mode: string;
    status: string;
    review_status: string;
    created_by: string;
    created_on: Date;
    started_on: Date | null;
    completed_on: Date | null;
  };

  @Prop(
    raw({
      document_id: { type: String, default: '' },
      document_name: { type: String, required: true },
      document_type: { type: String, default: 'FRS' },
    }),
  )
  document: {
    document_id: string;
    document_name: string;
    document_type: string;
  };

  @Prop(
    raw({
      total_chunks: { type: Number, default: 0 },
      requirement_chunks: { type: Number, default: 0 },
      testcase_chunks: { type: Number, default: 0 },
      generated_testcases: { type: Number, default: 0 },
      clarifications: { type: Number, default: 0 },
    }),
  )
  metrics: {
    total_chunks: number;
    requirement_chunks: number;
    testcase_chunks: number;
    generated_testcases: number;
    clarifications: number;
  };

  @Prop(
    raw({
      percentage: { type: Number, default: 0 },
      current_phase: { type: String, default: 'NOT_STARTED' },
    }),
  )
  progress: {
    percentage: number;
    current_phase: string;
  };

  @Prop(
    raw({
      document_understanding_id: { type: String, default: '' },
      generated_script_count: { type: Number, default: 0 },
    }),
  )
  output: {
    document_understanding_id: string;
    generated_script_count: number;
  };

  @Prop({ default: true })
  active: boolean;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
