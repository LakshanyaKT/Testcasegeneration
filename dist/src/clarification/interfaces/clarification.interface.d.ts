export interface GeneratedClarification {
    question: string;
    reason: string;
}
export interface ClarificationData {
    clarificationId: string;
    documentId: string;
    question: string;
    reason: string;
    answer: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
