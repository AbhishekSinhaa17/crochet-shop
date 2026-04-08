import { createBrowserClient } from "@supabase/ssr";
import { Logger } from "../logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 🔒 Environment Validation
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

declare global {
  var _supabaseBrowserInstance: any;
}

// ✅ Optimized client with faster connection
const createOptimizedClient = () => {
  return createBrowserClient(
    supabaseUrl || "https://placeholder-if-missing.supabase.co",
    supabaseKey || "placeholder-pk-if-missing",
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        fetch: (url: RequestInfo | URL, options?: RequestInit) => {
          return fetch(url, {
            ...options,
            keepalive: true, // ✅ Connection alive rakhega
          });
        },
      },
      realtime: {
        params: {
          eventsPerSecond: -1, // ✅ Realtime band - cart ko nahi chahiye
        },
      },
    }
  );
};

export const supabase =
  globalThis._supabaseBrowserInstance ||
  createOptimizedClient();

if (process.env.NODE_ENV !== "production") {
  globalThis._supabaseBrowserInstance = supabase;
}