import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Basic Rate Limiting Structure (In-memory is not persistent across middleware runs, 
// so this is more of a structural hint or using a real store if needed)
import { checkRateLimit, AUTH_LIMIT, PUBLIC_LIMIT } from "@/lib/ratelimit";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // 1. Route Definitions
  const pathname = request.nextUrl.pathname;
  const authRoutes = ["/auth/login", "/auth/register", "/api/auth"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 2. Rate Limiting Check
  const ip = request.ip || request.headers.get("x-forwarded-for") || "anonymous";
  const limitConfig = isAuthRoute ? AUTH_LIMIT : PUBLIC_LIMIT;
  
  const { success, limit, remaining, reset } = await checkRateLimit(
    `ip:${ip}:${pathname}`, 
    limitConfig
  );

  if (!success) {
    return new NextResponse("Too Many Requests", { 
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      }
    });
  }

  // 3. Supabase Client Setup
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

  // 4. Define route protection
  const protectedRoutes = ["/profile", "/orders", "/wishlist", "/cart", "/checkout", "/chat", "/custom-order"];
  const adminRoutes = ["/admin"];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Determine if this route needs an authentication/authorization check
  const needsAuthCheck = isProtectedRoute || isAdminRoute || isAuthRoute;

  if (!needsAuthCheck) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 5. Authentication Logic
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

  // 6. Authorization Logic (RBAC)
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
  supabaseResponse.headers.set('X-RateLimit-Limit', limit.toString());
  supabaseResponse.headers.set('X-RateLimit-Remaining', remaining.toString());
  supabaseResponse.headers.set('X-RateLimit-Reset', reset.toString());

  return supabaseResponse;
}

