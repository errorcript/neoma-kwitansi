import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('admin_auth');
  const { pathname } = request.nextUrl;

  // Izinkan akses ke halaman login, verifikasi publik, dan aset publik
  if (
    pathname === '/login' || 
    pathname.startsWith('/verify') || 
    pathname.startsWith('/api/receipts/list') || // List API juga dipake di verify? Enggak, tapi biarin buat verifikasi link
    pathname.includes('.') // Aset gambar/logo
  ) {
    return NextResponse.next();
  }

  // Jika belum login, redirect ke halaman login
  if (!authCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
