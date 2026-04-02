import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Use service role key to bypass all RLS
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get the current user from the session cookie
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    // Use admin key to bypass RLS completely
    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile fetch error:", profileError.message);
      return NextResponse.json({ profile: null, error: profileError.message }, { status: 200 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ profile: null }, { status: 500 });
  }
}
