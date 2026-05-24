import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const response = NextResponse.next();
          response.cookies.set({ name, value, ...options });
          return response;
        },
        remove(name: string, options: CookieOptions) {
          const response = NextResponse.next();
          response.cookies.set({ name, value: "", ...options });
          return response;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoginPage = pathname === "/login";
  const isProtectedRoute = pathname === "/" || 
    pathname.startsWith("/clients") || 
    pathname.startsWith("/projects") || 
    pathname.startsWith("/activity-logs") || 
    pathname.startsWith("/credentials") || 
    pathname.startsWith("/settings") || 
    pathname.startsWith("/crm");

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/clients/:path*",
    "/projects/:path*",
    "/activity-logs/:path*",
    "/credentials/:path*",
    "/settings/:path*",
    "/crm/:path*",
  ],
};
