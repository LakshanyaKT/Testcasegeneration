import { Document, HydratedDocument } from 'mongoose';
export type ProjectKnowledgeDocument = HydratedDocument<ProjectKnowledge>;
export declare class ProjectKnowledge extends Document {
    projectId: string;
    entities: any[];
    businessRules: any[];
    validations: any[];
    processFlows: any[];
    workflows: any[];
    testPatterns: any[];
    domainKnowledge: any[];
    reusableScenarios: any[];
}
export declare const ProjectKnowledgeSchema: import("mongoose").Schema<ProjectKnowledge, import("mongoose").Model<ProjectKnowledge, any, any, any, Document<unknown, any, ProjectKnowledge, any, {}> & ProjectKnowledge & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProjectKnowledge, Document<unknown, {}, import("mongoose").FlatRecord<ProjectKnowledge>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ProjectKnowledge> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
