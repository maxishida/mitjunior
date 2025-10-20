'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function MeusCursosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isDevelopment = process.env.NODE_ENV !== 'production';

  useEffect(() => {
    if (!loading && !user && !isDevelopment) {
      router.push('/login');
    }
  }, [user, loading, router, isDevelopment]);

  if (loading) {
    return (
      <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user && !isDevelopment) return null;

  return (
    <div className="bg-dark text-white min-vh-100">
      <Navbar />
      <main className="container py-5" style={{ marginTop: '80px' }}>
        <h1 className="mb-4">Meus Cursos</h1>

        <div className="alert alert-info">
          <h4 className="alert-heading">Em Desenvolvimento</h4>
          <p className="mb-0">
            Esta funcionalidade está sendo desenvolvida. Em breve você poderá acompanhar
            seus cursos em andamento, ver seu progresso e certificados.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card bg-secondary">
              <div className="card-body">
                <h5 className="card-title">Cursos em Andamento</h5>
                <p className="card-text text-muted">Nenhum curso em andamento no momento.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card bg-secondary">
              <div className="card-body">
                <h5 className="card-title">Cursos Concluídos</h5>
                <p className="card-text text-muted">Nenhum curso concluído ainda.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <a href="/" className="btn btn-success">
            Explorar Cursos
          </a>
        </div>
      </main>
    </div>
  );
}
