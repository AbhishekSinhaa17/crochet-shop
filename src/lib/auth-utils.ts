import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Logger } from "@/lib/logger";

/**
 * 🛡️ Auth Utilities
 * Consistent role-based checks for the whole application.
 */

export type UserRole = "admin" | "user" | null;

/**
 * Checks if a given role string is 'admin'.
 * Handles casing and potential whitespace for production robustness.
 */
export const isAdmin = (role: string | null | undefined): boolean => {
  if (!role) return false;
  return role.toLowerCase().trim() === "admin";
};

/**
 * Checks if a given role is a standard 'user'.
 */
export const isUser = (role: string | null | undefined): boolean => {
  if (!role) return false;
  return role.toLowerCase().trim() === "user";
};

/**
 * Server-side helper to verify admin status.
 * Throws Unauthorized or Forbidden errors if checks fail.
 */
export async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    Logger.error("Forbidden admin access attempt", new Error("Forbidden"), { userId: user.id });
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}
