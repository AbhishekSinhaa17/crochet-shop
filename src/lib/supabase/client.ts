import { createBrowserClient } from "@supabase/ssr";
import { Logger } from "../logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 🔒 Environment Validation
 * Fails loudly during development, but gracefully in production to avoid crashing the hydration,
 * while still marking the service as unusable.
 */
if (!supabaseUrl || !supabaseKey) {
  const errorMsg = "Supabase environment variables are missing! Mutations will fail.";
  
  if (process.env.NODE_ENV === "development") {
    throw new Error(errorMsg);
  } else if (typeof window !== "undefined") {
    Logger.error(errorMsg, undefined, {
      module: "supabase-client",
      action: "init",
      urlExists: !!supabaseUrl,
      keyExists: !!supabaseKey
    });
  }
}

/**
 * 🌐 Standard Supabase Browser Client
 * Use this in Client Components (useEffect, event handlers, Zustand stores).
 */
export const supabase = createBrowserClient(
  supabaseUrl || "https://placeholder-if-missing.supabase.co",
  supabaseKey || "placeholder-pk-if-missing"
);