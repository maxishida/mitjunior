import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { admin } from '@/lib/firebase.admin.config';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
        return new NextResponse('Token de ID não fornecido', { status: 400 });
    }

    // O cookie expira em 5 dias
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    try {
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
        const options = { name: 'session', value: sessionCookie, maxAge: expiresIn, httpOnly: true, secure: true };

        const response = NextResponse.json({ status: 'success' });
        response.cookies.set(options);

        return response;
    } catch (error) {
        console.error("Erro ao criar cookie de sessão:", error);
        return new NextResponse('Falha na autenticação', { status: 401 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ status: 'success' });
    response.cookies.set({ name: 'session', value: '', maxAge: 0 });
    return response;
}
