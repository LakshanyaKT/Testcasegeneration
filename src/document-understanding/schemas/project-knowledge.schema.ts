import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ProjectKnowledgeDocument = HydratedDocument<ProjectKnowledge>;

@Schema({ collection: 'project_knowledge', timestamps: true })
export class ProjectKnowledge extends Document {
  @Prop({ required: true, unique: true, index: true })
  projectId: string;

  @Prop({ type: [Object], default: [] })
  entities: any[];

  @Prop({ type: [Object], default: [] })
  businessRules: any[];

  @Prop({ type: [Object], default: [] })
  validations: any[];

  @Prop({ type: [Object], default: [] })
  processFlows: any[];

  @Prop({ type: [Object], default: [] })
  workflows: any[];

  @Prop({ type: [Object], default: [] })
  testPatterns: any[];

  @Prop({ type: [Object], default: [] })
  domainKnowledge: any[];

  @Prop({ type: [Object], default: [] })
  reusableScenarios: any[];
}

export const ProjectKnowledgeSchema = SchemaFactory.createForClass(ProjectKnowledge);
