import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Sirf /admin routes ko protect karein (Login page ko chhod kar)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Agar already logged in hai aur /admin/login khol raha hai toh dashboard bhej do
  if (path === '/admin/login') {
    const token = req.cookies.get('admin_token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }
  
  return NextResponse.next();    
}

export const config = {
  matcher: ['/admin/:path*'],
};