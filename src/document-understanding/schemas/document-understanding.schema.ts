import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type DocumentUnderstandingDocument = HydratedDocument<DocumentUnderstanding>;

@Schema({ collection: 'document_understanding', timestamps: true })
export class DocumentUnderstanding extends Document {
  @Prop({ required: true, index: true })
  documentId: string;

  @Prop({ required: true, index: true })
  projectId: string;

  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ type: Object, required: true })
  analysis: {
    confidence: number;
    completenessScore: number;
    coverageScore: number;
    documentType: string;
    moduleCount: number;
    requirementCount: number;
  };

  @Prop({ type: [Object], default: [] })
  requirements: Array<{
    requirementId: string;
    module: string;
    title: string;
    description: string;
    priority: string;
    category: string;
  }>;

  @Prop({ type: [Object], default: [] })
  entities: Array<{
    entityId: string;
    name: string;
    description: string;
    attributes: string[];
  }>;

  @Prop({ type: [Object], default: [] })
  businessRules: Array<{
    ruleId: string;
    description: string;
    priority: string;
  }>;

  @Prop({ type: [Object], default: [] })
  validations: Array<{
    validationId: string;
    field: string;
    rule: string;
    errorMessage: string;
  }>;

  @Prop({ type: [Object], default: [] })
  processFlows: Array<{
    processId: string;
    name: string;
    steps: string[];
  }>;

  @Prop({ type: [Object], default: [] })
  workflows: Array<{
    workflowId: string;
    name: string;
    states: string[];
    transitions: Array<{ from: string; to: string; trigger?: string }>;
  }>;

  @Prop({ type: [Object], default: [] })
  missingInformation: Array<{
    id: string;
    category: string;
    description: string;
    severity: string;
  }>;

  @Prop({ type: [Object], default: [] })
  questions: Array<{
    questionId: string;
    question: string;
    category: string;
    priority: string;
  }>;

  @Prop({ required: true })
  status: string;
}

export const DocumentUnderstandingSchema = SchemaFactory.createForClass(DocumentUnderstanding);
