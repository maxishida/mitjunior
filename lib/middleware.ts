import { NextRequest, NextResponse } from 'next/server';
import { admin } from './firebase-admin.config';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/cadastro',
  '/esqueci-senha',
  '/api/auth',
  '/api/welcome-email',
  '/termos',
  '/privacidade',
  '/sobre',
  '/contato'
];

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/cursos',
  '/perfil',
  '/progresso',
  '/comunidade',
  '/configuracoes',
  '/api/user',
  '/api/courses',
  '/api/achievements',
  '/api/certificates',
  '/api/leaderboard'
];

// Routes that redirect to onboarding if not completed
const onboardingRequiredRoutes = [
  '/dashboard',
  '/cursos',
  '/perfil',
  '/progresso'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') || // Files with extensions
    pathname.startsWith('/api/health')
  ) {
    return NextResponse.next();
  }

  try {
    // Get session cookie
    const sessionCookie = request.cookies.get('session')?.value;

    // Check if route is public
    const isPublicRoute = publicRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    );

    // If no session and trying to access protected route, redirect to login
    if (!sessionCookie && !isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If there's a session, verify it
    if (sessionCookie) {
      try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);

        // User is authenticated
        const response = NextResponse.next();

        // Add user info to headers for client-side usage
        response.headers.set('x-user-id', decodedClaims.uid);
        response.headers.set('x-user-email', decodedClaims.email || '');

        // Check if user needs onboarding
        if (onboardingRequiredRoutes.some(route => pathname.startsWith(route))) {
          const userDoc = await admin.firestore().collection('users').doc(decodedClaims.uid).get();
          const userData = userDoc.data();

          if (!userData?.onboardingCompleted) {
            const onboardingUrl = new URL('/onboarding', request.url);
            return NextResponse.redirect(onboardingUrl);
          }
        }

        // Redirect authenticated users away from auth pages
        if (isPublicRoute && pathname.startsWith('/login')) {
          const dashboardUrl = new URL('/dashboard', request.url);
          return NextResponse.redirect(dashboardUrl);
        }

        return response;

      } catch (error) {
        console.error('Session verification error:', error);

        // Clear invalid session cookie
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('session');
        return response;
      }
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);

    // In case of any error, allow the request to proceed
    // The pages themselves should handle authentication checks
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};