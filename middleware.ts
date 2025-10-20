import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      if (isDevelopment) {
        // Em desenvolvimento as rotas administrativas permanecem abertas para facilitar o trabalho.
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (
    (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup')) &&
    sessionCookie
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
};
