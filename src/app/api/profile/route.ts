import { NextResponse } from "next/server";
import { ProfileService } from "@/services/profile-service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    const profileService = new ProfileService(true); // Using admin service to ensure profile is fetched even if RLS is tight
    const profile = await profileService.getProfile(user.id);

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (err: any) {
    console.error("Profile API Error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

