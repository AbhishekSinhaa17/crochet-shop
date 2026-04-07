import { Logger } from "./logger";

/**
 * ⚡ API Utility functions for production resilience.
 */

const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds (Final Defensive Buffer)

/**
 * ⏱️ Wraps a promise with a timeout.
 * If the promise doesn't resolve within the timeout, it rejects.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  actionName: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const startTime = Date.now();
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      const duration = Date.now() - startTime;
      Logger.error(`Request Timeout: ${actionName} failed after ${duration}ms`, undefined, {
        module: "api-utils",
        action: actionName,
        durationMs: duration
      });
      reject(new Error(`Request Timeout: ${actionName}`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    const duration = Date.now() - startTime;
    Logger.debug(`Request Success: ${actionName} finished in ${duration}ms`, {
      module: "api-utils",
      action: actionName,
      durationMs: duration
    });
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

/**
 * 🔁 Retries an async function with exponential backoff.
 */
export async function retry<T>(
  fn: () => T | Promise<T>,
  actionName: string,
  retries: number = 2,
  delayMs: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // 🛡️ Exponential Backoff: Each retry waits 1.5x longer
    const attempt = 3 - retries;
    const waitTime = delayMs * Math.pow(1.5, attempt);
    
    Logger.warn(`Retrying request: ${actionName} (Attempt ${attempt}) after ${waitTime}ms`, {
      module: "api-utils",
      action: actionName,
      attempt
    });
    
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return retry(fn, actionName, retries - 1, delayMs);
  }
}

/**
 * 🛡️ Helper to run a Supabase call with both timeout and retry logic.
 */
export async function resilientCall<T>(
  fn: () => Promise<T>,
  actionName: string,
  options: { retries?: number; timeout?: number; delay?: number } = {}
): Promise<T> {
  const { retries = 2, timeout = DEFAULT_TIMEOUT_MS, delay = 1000 } = options;
  
  return retry(
    () => withTimeout(fn(), actionName, timeout),
    actionName,
    retries,
    delay
  );
}
