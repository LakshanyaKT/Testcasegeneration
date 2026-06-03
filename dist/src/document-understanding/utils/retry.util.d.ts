import { Logger } from '@nestjs/common';
export interface RetryOptions {
    maxRetries: number;
    delayMs: number;
    backoffMultiplier: number;
    retryableErrors?: string[];
}
export declare function withRetry<T>(fn: () => Promise<T>, options?: Partial<RetryOptions>, logger?: Logger, context?: string): Promise<T>;
