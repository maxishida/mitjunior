import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;

  // Se o usuário está tentando acessar o painel de admin sem um cookie de sessão,
  // redirecione para a página de login.
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Se o usuário está logado e tenta acessar a página de login ou signup,
  // redirecione para a página inicial (ou outra página, como o feed).
  if ((request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) && sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Se nenhuma das condições acima for atendida, permita que a solicitação continue.
  return NextResponse.next();
}

// Configuração para aplicar o middleware nas rotas relevantes.
export const config = {
  matcher: ['/admin/:path*', '/login', '/signup'],
};
