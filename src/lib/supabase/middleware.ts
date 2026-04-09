import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Logger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/security/rateLimiter";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;
const ROLE_CACHE_TTL = 600;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // 1. Route Definitions
  const pathname = request.nextUrl.pathname;
  const authRoutes = ["/auth/login", "/auth/register", "/api/auth"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 2. Supabase Client Setup (needed for session check)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: any }[]) => {
          cookiesToSet.forEach((cookie) => request.cookies.set(cookie.name, cookie.value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach((cookie) =>
            supabaseResponse.cookies.set(cookie.name, cookie.value, cookie.options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 3. 🚦 Hybrid Rate Limiting
  try {
    const rateLimitResult = await checkRateLimit(request, {
      userId: user?.id,
      config: isAuthRoute ? "CRITICAL" : (user ? "AUTH" : "PUBLIC"),
    });

    if (rateLimitResult && !rateLimitResult.success) {
      return new NextResponse("Too Many Requests", { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
        }
      });
    }

    if (rateLimitResult) {
      supabaseResponse.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      supabaseResponse.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      supabaseResponse.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
    }
  } catch (err: any) {
    if (err.name === "RateLimitError") {
       return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  // 4. Protection Logic
  const protectedRoutes = ["/profile", "/orders", "/wishlist", "/cart", "/checkout", "/chat", "/custom-order"];
  const adminRoutes = ["/admin"];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));

  if (!user) {
    if (isProtectedRoute || isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (isAuthPage) return NextResponse.redirect(new URL("/", request.url));

  // 5. 👑 RBAC with Redis Caching
  if (isAdminRoute) {
    let role = null;
    if (redis) {
      role = await redis.get<string>(`user:role:${user.id}`);
    }

    if (!role) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      
      role = profile?.role || 'customer';
      if (redis) await redis.set(`user:role:${user.id}`, role, { ex: ROLE_CACHE_TTL });
    }

    if (role !== "admin") {
      Logger.warn(`Forbidden admin access attempt`, { module: "middleware", userId: user.id });
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

