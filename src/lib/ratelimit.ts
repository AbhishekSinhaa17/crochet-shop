import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "./env";

// 1. Initialize Redis client if credentials exist
const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// 2. Simple In-Memory Fallback for Rate Limiting
type InMemoryStore = Map<string, { count: number; reset: number }>;
const memoryStore: InMemoryStore = new Map();

const memoryRateLimit = (id: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const entry = memoryStore.get(id) || { count: 0, reset: now + windowMs };

  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + windowMs;
  }

  entry.count++;
  memoryStore.set(id, entry);

  return {
    success: entry.count <= limit,
    limit,
    remaining: Math.max(0, limit - entry.count),
    reset: entry.reset,
  };
};

// 3. Define Rate Limit Configurations
export const AUTH_LIMIT = { limit: 10, window: "1 m" as const, windowMs: 60 * 1000 };
export const PUBLIC_LIMIT = { limit: 100, window: "1 m" as const, windowMs: 60 * 1000 };

export async function checkRateLimit(
  identifier: string,
  config: typeof PUBLIC_LIMIT
) {
  // Use Upstash Redis if available
  if (redis) {
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.limit, config.window),
      analytics: true,
      prefix: "@crochet/ratelimit",
    });

    return await ratelimit.limit(identifier);
  }

  // Fallback to in-memory
  return memoryRateLimit(identifier, config.limit, config.windowMs);
}
