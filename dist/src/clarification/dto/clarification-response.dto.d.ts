import { ClarificationStatus } from '../schemas/clarification.schema';
export declare class ClarificationResponseDto {
    clarificationId: string;
    documentId: string;
    question: string;
    reason: string;
    answer: string | null;
    status: ClarificationStatus;
    priorityRank: number | null;
    priorityBatch: string | null;
    priorityReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GenerateClarificationsResponseDto {
    documentId: string;
    totalGenerated: number;
    clarifications: ClarificationResponseDto[];
}
export declare class GetClarificationsResponseDto {
    documentId: string;
    total: number;
    clarifications: ClarificationResponseDto[];
}
export declare class PrioritizeClarificationsResponseDto {
    documentId: string;
    priorityBatchId: string;
    topK: number;
    totalEvaluated: number;
    prioritizedQuestions: ClarificationResponseDto[];
}
export declare class GetPrioritizedClarificationsResponseDto {
    documentId: string;
    priorityBatchId: string;
    total: number;
    questions: ClarificationResponseDto[];
}
