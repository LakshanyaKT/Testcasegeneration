import { Document, HydratedDocument } from 'mongoose';
export type DocumentUnderstandingDocument = HydratedDocument<DocumentUnderstanding>;
export declare class DocumentUnderstanding extends Document {
    documentId: string;
    projectId: string;
    sessionId: string;
    analysis: {
        confidence: number;
        completenessScore: number;
        coverageScore: number;
        documentType: string;
        moduleCount: number;
        requirementCount: number;
    };
    requirements: Array<{
        requirementId: string;
        module: string;
        title: string;
        description: string;
        priority: string;
        category: string;
    }>;
    entities: Array<{
        entityId: string;
        name: string;
        description: string;
        attributes: string[];
    }>;
    businessRules: Array<{
        ruleId: string;
        description: string;
        priority: string;
    }>;
    validations: Array<{
        validationId: string;
        field: string;
        rule: string;
        errorMessage: string;
    }>;
    processFlows: Array<{
        processId: string;
        name: string;
        steps: string[];
    }>;
    workflows: Array<{
        workflowId: string;
        name: string;
        states: string[];
        transitions: Array<{
            from: string;
            to: string;
            trigger?: string;
        }>;
    }>;
    missingInformation: Array<{
        id: string;
        category: string;
        description: string;
        severity: string;
    }>;
    questions: Array<{
        questionId: string;
        question: string;
        category: string;
        priority: string;
    }>;
    status: string;
}
export declare const DocumentUnderstandingSchema: import("mongoose").Schema<DocumentUnderstanding, import("mongoose").Model<DocumentUnderstanding, any, any, any, Document<unknown, any, DocumentUnderstanding, any, {}> & DocumentUnderstanding & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DocumentUnderstanding, Document<unknown, {}, import("mongoose").FlatRecord<DocumentUnderstanding>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<DocumentUnderstanding> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
