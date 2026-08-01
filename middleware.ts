import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET === "default_secret" || JWT_SECRET === "super_secret_jwt_key_change_in_production") {
  if (process.env.NODE_ENV === 'production') {
    throw new Error("FATAL: JWT_SECRET environment variable is missing or insecure in production.");
  }
}

const finalSecret = JWT_SECRET || "default_secret";
const key = new TextEncoder().encode(finalSecret);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      await jwtVerify(token, key);
      return NextResponse.next();
    } catch (err) {
      // Token invalid or expired
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
