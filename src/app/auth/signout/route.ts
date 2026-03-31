import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();

  // 1. Sign out the user on the server (clears cookies)
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("SignOut Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 2. Clear caches and redirect
  const baseUrl = new URL(req.url).origin;
  revalidatePath("/", "layout");
  
  return NextResponse.redirect(`${baseUrl}/`, {
    status: 302,
  });
}
