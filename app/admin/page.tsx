import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="bg-dark text-white min-vh-100">
            <header className="p-3 mb-4 border-bottom border-secondary">
                <h1 className="h4">Painel Administrativo</h1>
            </header>
            <main className="container">
                <p>Bem-vindo ao painel de administração. Use o menu para gerenciar sua comunidade.</p>
                <div className="list-group">
                    <Link href="/admin/courses" className="list-group-item list-group-item-action bg-secondary text-white">Gerenciar Cursos</Link>
                    <Link href="/admin/videos" className="list-group-item list-group-item-action bg-secondary text-white">Gerenciar Vídeos</Link>
                    <Link href="/admin/posts" className="list-group-item list-group-item-action bg-secondary text-white">Moderar Posts</Link>
                    <Link href="/admin/users" className="list-group-item list-group-item-action bg-secondary text-white">Gerenciar Usuários</Link>
                </div>
            </main>
        </div>
    );
}