'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
    uid: string;
    email?: string;
    displayName?: string;
}

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error('Falha ao buscar usuários.');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="bg-dark text-white min-vh-100">
            <header className="p-3 mb-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
                <h1 className="h4">Gerenciar Usuários</h1>
                <Link href="/admin" className="btn btn-secondary">Voltar ao Painel</Link>
            </header>
            <main className="container">
                {loading && <p>Carregando usuários...</p>}
                {error && <p className="text-danger">{error}</p>}
                {!loading && !error && (
                    <ul className="list-group">
                        {users.map(user => (
                            <li key={user.uid} className="list-group-item bg-secondary text-white d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="mb-1">{user.displayName || 'Sem nome'}</p>
                                    <small>{user.email || 'Sem email'}</small>
                                </div>
                                <button className="btn btn-danger btn-sm">Banir</button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}
