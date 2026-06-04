import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type AgentRunsDocument = HydratedDocument<AgentRuns>;

@Schema({ collection: 'agent_runs', timestamps: true })
export class AgentRuns extends Document {
  @Prop({ required: true, index: true })
  projectId: string;

  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ required: true, index: true })
  documentId: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  startedAt: Date;

  @Prop({ required: true })
  completedAt: Date;

  @Prop({ required: true, default: 0 })
  bedrockCalls: number;

  @Prop({ required: true, default: 0 })
  executionTime: number; // in milliseconds
}

export const AgentRunsSchema = SchemaFactory.createForClass(AgentRuns);
