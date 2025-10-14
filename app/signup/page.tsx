'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase.config';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
        setError('Por favor, preencha todos os campos.');
        return;
    }

    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      // TODO: Redirecionar para a página principal após o cadastro
      alert('Cadastro bem-sucedido! Você será redirecionado.');
    } catch (err: any) {
      setError('Falha no cadastro. O email pode já estar em uso.');
      console.error(err);
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card bg-secondary p-4" style={{width: '100%', maxWidth: '400px'}}>
          <div className="card-body">
              <h3 className="card-title text-center mb-4">Criar Conta</h3>
              <form onSubmit={handleSignup}>
                  <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input 
                          type="email" 
                          className="form-control" 
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  <div className="mb-3">
                      <label htmlFor="password" className="form-label">Senha</label>
                      <input 
                          type="password" 
                          className="form-control" 
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                  </div>
                  {error && <p className="text-danger">{error}</p>}
                  <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
              </form>
              <div className="text-center mt-3">
                <p>Já tem uma conta? <Link href="/login">Entrar</Link></p>
              </div>
          </div>
      </div>
    </div>
  );
}
