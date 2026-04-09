import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { Logger } from "@/lib/logger";

/**
 * 🚦 Advanced Hybrid Rate Limiter (Upstash Redis)
 * 
 * Supports User-based limiting (preferred) with IP-based fallback.
 */

let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, "1 m"), // Global default: 60 req/min
    analytics: true,
    prefix: "@crochet/ratelimit",
  });
}

// Named configurations for different scenarios
export const LIMIT_CONFIGS = {
  PUBLIC: { limit: 30, window: "1 m" as const },      // 30 req/min for anonymous
  AUTH: { limit: 120, window: "1 m" as const },       // 120 req/min for logged-in
  CRITICAL: { limit: 10, window: "1 m" as const },    // 10 req/min for payments/auth
};

export class RateLimitError extends Error {
  constructor(public message: string = "Too many requests", public status: number = 429) {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * Extracts real client IP behind proxies
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "127.0.0.1";
}

/**
 * 🛡️ Hybrid Rate Limiter Check
 * 
 * Uses user ID if available, otherwise falls back to IP.
 */
export async function checkRateLimit(
  request: NextRequest, 
  options?: { 
    userId?: string; 
    config?: keyof typeof LIMIT_CONFIGS;
    action?: string;
  }
) {
  if (!ratelimit) return { success: true, limit: 10, remaining: 10, reset: Date.now() + 60000 };

  const ip = getClientIp(request);
  const identifier = options?.userId 
    ? `user:${options.userId}` 
    : `ip:${ip}`;
  
  const actionKey = options?.action ? `:${options.action}` : "";
  const key = `${identifier}${actionKey}`;

  const configName = options?.config || (options?.userId ? "AUTH" : "PUBLIC");
  const config = LIMIT_CONFIGS[configName];

  // We create a specific limiter if non-default config is passed
  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(config.limit, config.window),
    prefix: `@crochet/ratelimit:${configName}`,
  });

  const result = await limiter.limit(key);

  if (!result.success) {
    Logger.warn(`Rate limit exceeded`, { 
      module: "security", 
      action: options?.action || "api_call", 
      identifier,
      config: configName
    });
    throw new RateLimitError();
  }

  return result;
}

/**
 * 📏 Request Size Limiter
 * 
 * Rejects requests with bodies larger than 1MB.
 */
export function validateRequestSize(request: NextRequest, maxSizeInBytes: number = 1048576) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > maxSizeInBytes) {
    Logger.warn("Blocked overly large request", { 
      module: "security", 
      action: "size_limit", 
      size: contentLength, 
      maxSize: maxSizeInBytes 
    });
    throw new Error("Payload too large");
  }
}
