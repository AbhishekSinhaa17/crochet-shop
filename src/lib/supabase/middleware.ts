import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect routes
  const protectedRoutes = ["/profile", "/orders", "/wishlist", "/cart", "/checkout", "/chat", "/custom-order"];
  const adminRoutes = ["/admin"];
  const authRoutes = ["/auth/login", "/auth/register"];

  const pathname = request.nextUrl.pathname;

  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const retailPages = ["/cart", "/wishlist", "/checkout"];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isRetailPage = retailPages.some((route) => pathname.startsWith(route));

  if (user && (isAdminRoute || isRetailPage)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role?.toLowerCase()?.trim();

    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isRetailPage && role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return supabaseResponse;
}