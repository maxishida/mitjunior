'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function PerfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-dark text-white min-vh-100">
      <Navbar />
      <main className="container py-5" style={{ marginTop: '80px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="mb-4">Meu Perfil</h1>

            <div className="card bg-secondary mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Usuário'}
                      className="rounded-circle me-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle me-3 d-flex align-items-center justify-content-center bg-success"
                      style={{ width: '80px', height: '80px', fontSize: '32px', fontWeight: 'bold' }}
                    >
                      {(user?.displayName || user?.email || 'U')?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <h2 className="h4 mb-1">{user?.displayName || 'Usuário'}</h2>
                    <p className="text-muted mb-0">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-secondary">
              <div className="card-body">
                <h3 className="h5 mb-3">Informações da Conta</h3>
                <dl className="row mb-0">
                  <dt className="col-sm-4">Nome:</dt>
                  <dd className="col-sm-8">{user.displayName || 'Não informado'}</dd>

                  <dt className="col-sm-4">E-mail:</dt>
                  <dd className="col-sm-8">{user.email}</dd>

                  <dt className="col-sm-4">UID:</dt>
                  <dd className="col-sm-8">
                    <code className="text-success">{user.uid}</code>
                  </dd>

                  <dt className="col-sm-4">Verificado:</dt>
                  <dd className="col-sm-8">
                    {user.emailVerified ? (
                      <span className="badge bg-success">Sim</span>
                    ) : (
                      <span className="badge bg-warning">Não</span>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
