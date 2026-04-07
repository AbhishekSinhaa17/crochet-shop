/**
 * ⚡ API Utility functions for production resilience.
 */

const DEFAULT_TIMEOUT_MS = 20000; // 20 seconds (Production Cold-Start Safe)

/**
 * ⏱️ Wraps a promise with a timeout.
 * If the promise doesn't resolve within the timeout, it rejects.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Request Timeout"));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
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
  retries: number = 2,
  delayMs: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // 🛡️ Exponential Backoff: Each retry waits 1.5x longer
    // This helps resolve temporary network congestion without hammering the service
    const waitTime = delayMs * Math.pow(1.5, 3 - retries);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    
    return retry(fn, retries - 1, delayMs);
  }
}

/**
 * 🛡️ Helper to run a Supabase call with both timeout and retry logic.
 */
export async function resilientCall<T>(
  fn: () => Promise<T>,
  options: { retries?: number; timeout?: number; delay?: number } = {}
): Promise<T> {
  const { retries = 2, timeout = DEFAULT_TIMEOUT_MS, delay = 1000 } = options;
  
  return retry(
    () => withTimeout(fn(), timeout),
    retries,
    delay
  );
}
