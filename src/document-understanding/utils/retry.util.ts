import { Logger } from '@nestjs/common';

export interface RetryOptions {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {},
  logger?: Logger,
  context?: string,
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error;
  let delay = opts.delayMs;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (logger && context) {
        logger.warn(
          `[${context}] Attempt ${attempt}/${opts.maxRetries} failed: ${lastError.message}`,
        );
      }

      if (attempt === opts.maxRetries) {
        break;
      }

      await sleep(delay);
      delay *= opts.backoffMultiplier;
    }
  }

  throw lastError!;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
