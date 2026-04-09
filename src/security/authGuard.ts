import { createServerSupabaseClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { Redis } from "@upstash/redis";
import { Logger } from "@/lib/logger";

const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;
const ROLE_CACHE_TTL = 600; // 10 minutes

export class AuthError extends Error {
  constructor(public message: string, public status: number = 401) {
    super(message);
    this.name = "AuthError";
  }
}

export interface AuthenticatedUser extends User {
  role?: string;
}

/**
 * 🔒 Auth Guard — Ensures a valid session exists.
 * Throws AuthError if unauthenticated.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthError("Unauthorized access", 401);
  }

  // 🏎️ Try role cache first
  let role: string | undefined;
  const cacheKey = `user:role:${user.id}`;
  
  if (redis) {
    try {
      role = (await redis.get<string>(cacheKey)) || undefined;
      if (role) Logger.debug(`Role cache hit for user ${user.id}: ${role}`);
    } catch (err) {
      Logger.error("Redis role fetch failed", err);
    }
  }

  if (!role) {
    // Fetch role from profile table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    role = profile?.role || "customer";

    // Store in cache
    if (redis) {
      try {
        await redis.set(cacheKey, role, { ex: ROLE_CACHE_TTL });
      } catch (err) {
        Logger.error("Redis role store failed", err);
      }
    }
  }

  return { ...user, role };
}

/**
 * 👑 Admin Guard — Ensures user has admin role.
 * Throws AuthError if not admin.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireUser();

  if (user.role !== "admin") {
    throw new AuthError("Access denied: Admin privileges required", 403);
  }

  return user;
}
