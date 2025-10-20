'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function ConfiguracoesPage() {
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
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="mb-4">Configurações</h1>

            <div className="card bg-secondary mb-4">
              <div className="card-header">
                <h5 className="mb-0">Preferências de Conta</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Tema</label>
                  <select className="form-select bg-dark text-white" disabled>
                    <option>Dark Mode (Padrão)</option>
                    <option>Light Mode (Em breve)</option>
                  </select>
                  <small className="text-muted">Modo escuro está ativo por padrão.</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Idioma</label>
                  <select className="form-select bg-dark text-white" disabled>
                    <option>Português (BR)</option>
                  </select>
                </div>

                <hr className="my-4" />

                <div className="mb-3">
                  <h6>Notificações</h6>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emailNotifications"
                      disabled
                    />
                    <label className="form-check-label" htmlFor="emailNotifications">
                      Receber notificações por e-mail
                    </label>
                  </div>
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="pushNotifications"
                      disabled
                    />
                    <label className="form-check-label" htmlFor="pushNotifications">
                      Notificações push no navegador
                    </label>
                  </div>
                  <small className="text-muted d-block mt-2">
                    Configurações de notificação em desenvolvimento.
                  </small>
                </div>
              </div>
            </div>

            <div className="card bg-secondary">
              <div className="card-header">
                <h5 className="mb-0">Segurança</h5>
              </div>
              <div className="card-body">
                <button className="btn btn-outline-warning" disabled>
                  Alterar Senha
                </button>
                <p className="text-muted mt-2 mb-0">
                  Funcionalidade em desenvolvimento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
