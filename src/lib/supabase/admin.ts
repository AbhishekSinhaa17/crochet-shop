import { createClient } from "@supabase/supabase-js";

/**
 * WARNING: This client uses the Supabase Service Role Key.
 * It bypasses Row Level Security (RLS) entirely.
 * ALWAYS use it only in Server Components, Server Actions, or API Routes.
 * NEVER expose it to the client.
 */

if (typeof window !== 'undefined') {
  throw new Error("supabaseAdmin cannot be used on the client-side!");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!serviceKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations will fail.");
}

export const supabaseAdmin = createClient(
  url,
  serviceKey || "",
  { 
    auth: { 
      autoRefreshToken: false, 
      persistSession: false 
    } 
  }
);