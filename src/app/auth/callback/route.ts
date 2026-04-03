import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // 1. Get the redirect path from the "auth_redirect" cookie
  const cookieStore = await cookies();
  const next = cookieStore.get("auth_redirect")?.value || "/";

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 2. Clear the redirect cookie after successful login
      const response = NextResponse.redirect(`${origin}${next}`);
      response.cookies.delete("auth_redirect");
      return response;
    } else {
      console.error("Auth callback error:", error.message);
    }
  }

  // Fallback if anything fails
  return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`);
}
