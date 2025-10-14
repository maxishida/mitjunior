import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase.admin.config';

export async function GET() {
    // TODO: Proteger esta rota para que apenas administradores possam acessá-la.
    try {
        const userRecords = await admin.auth().listUsers();
        const users = userRecords.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
        }));
        return NextResponse.json(users);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        return new NextResponse('Erro interno do servidor', { status: 500 });
    }
}
