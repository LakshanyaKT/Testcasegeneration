"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = withRetry;
const DEFAULT_RETRY_OPTIONS = {
    maxRetries: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
};
async function withRetry(fn, options = {}, logger, context) {
    const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError;
    let delay = opts.delayMs;
    for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (logger && context) {
                logger.warn(`[${context}] Attempt ${attempt}/${opts.maxRetries} failed: ${lastError.message}`);
            }
            if (attempt === opts.maxRetries) {
                break;
            }
            await sleep(delay);
            delay *= opts.backoffMultiplier;
        }
    }
    throw lastError;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=retry.util.js.map