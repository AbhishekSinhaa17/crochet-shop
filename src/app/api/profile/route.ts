import { NextRequest } from "next/server";
import { Response } from "@/lib/api-response";
import { Logger } from "@/lib/logger";
import { ProfileService } from "@/services/profile-service";
import { requireUser } from "@/security/authGuard";
import { checkRateLimit } from "@/security/rateLimiter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request);
    const user = await requireUser();

    const profileService = new ProfileService();
    const profile = await profileService.getProfile(user.id);

    return Response.success({ profile });
  } catch (err: any) {
    Logger.apiError("/api/profile", err);
    return Response.handle(err, "/api/profile");
  }
}


