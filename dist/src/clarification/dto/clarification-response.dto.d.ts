import { ClarificationStatus } from '../schemas/clarification.schema';
export declare class ClarificationResponseDto {
    clarificationId: string;
    documentId: string;
    question: string;
    reason: string;
    answer: string | null;
    status: ClarificationStatus;
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
