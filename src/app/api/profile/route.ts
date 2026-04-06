import { Response } from "@/lib/api-response";
import { Logger } from "@/lib/logger";
import { ProfileService } from "@/services/profile-service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Logger.info("Profile fetch: no user session");
      return Response.success({ profile: null });
    }

    const profileService = new ProfileService(true);
    const profile = await profileService.getProfile(user.id);

    return Response.success({ profile });
  } catch (err: any) {
    Logger.error("Profile API Error", err);
    return Response.internalError();
  }
}


