import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Basic Rate Limiting Structure (In-memory is not persistent across middleware runs, 
// so this is more of a structural hint or using a real store if needed)
const ipCache = new Map<string, { count: number, reset: number }>();
const RATE_LIMIT = 100; // requests
const WINDOW_MS = 60 * 1000; // 1 minute

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // 1. Basic Rate Limiting Check (Simplified)
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const userData = ipCache.get(ip) || { count: 0, reset: now + WINDOW_MS };

  if (now > userData.reset) {
    userData.count = 0;
    userData.reset = now + WINDOW_MS;
  }

  userData.count++;
  ipCache.set(ip, userData);

  if (userData.count > RATE_LIMIT) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // 2. Supabase Client Setup
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // 3. Define route protection
  const protectedRoutes = ["/profile", "/orders", "/wishlist", "/cart", "/checkout", "/chat", "/custom-order"];
  const adminRoutes = ["/admin"];
  const authRoutes = ["/auth/login", "/auth/register"];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Determine if this route needs an authentication/authorization check
  const needsAuthCheck = isProtectedRoute || isAdminRoute || isAuthRoute;

  if (!needsAuthCheck) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Authentication Logic
  if (!user) {
    if (isProtectedRoute || isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // If user is logged in and tries to access /auth pages, redirect to home
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 5. Authorization Logic (RBAC)
  if (isAdminRoute) {
    // Only admins can access admin routes
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role?.toLowerCase()?.trim();

    if (role !== "admin") {
      // Not an admin, redirect home with error or to a forbidden page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Add rate limit headers to response
  supabaseResponse.headers.set('X-RateLimit-Limit', RATE_LIMIT.toString());
  supabaseResponse.headers.set('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT - userData.count).toString());
  supabaseResponse.headers.set('X-RateLimit-Reset', userData.reset.toString());

  return supabaseResponse;
}