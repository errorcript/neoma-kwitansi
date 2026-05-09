import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  const { pathname } = request.nextUrl;

  // Izinkan akses ke halaman login, api login, dan halaman verifikasi (publik)
  if (
    pathname.startsWith("/login") || 
    pathname.startsWith("/api/login") || 
    pathname.startsWith("/verify") ||
    pathname.startsWith("/transparansi") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/_next") ||
    pathname === "/logo-paguyuban.png" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Jika tidak ada session, redirect ke login
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
