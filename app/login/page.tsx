'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase.config';
import { useAuth } from '@/context/AuthContext';
import { AuthForm } from '@/components/auth';
import PasswordRecovery from '@/components/auth/PasswordRecovery';
import Link from 'next/link';
import { ArrowLeft, LogIn, Shield, Star } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const { user, loading: authLoading } = useAuth();

  const handleLogin = async (formData: { email: string; password: string; rememberMe?: boolean }) => {
    setLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCredential.user.getIdToken();

      // Create session cookie
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          rememberMe: formData.rememberMe,
          loginType: 'email'
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar sessão');
      }

      const sessionData = await response.json();

      // Track login analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'login', {
          method: 'email',
          user_id: userCredential.user.uid
        });
      }

      // Check if user needs onboarding
      if (sessionData.needsOnboarding) {
        window.location.href = '/onboarding';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (error: any) {
      console.error('Login error:', error);

      let errorMessage = 'Falha no login. Verifique suas credenciais.';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Nenhuma conta encontrada com este email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta. Tente novamente.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta conta foi desativada.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
    return null;
  }

  if (showRecovery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <button
            onClick={() => setShowRecovery(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <PasswordRecovery
              onBack={() => setShowRecovery(false)}
              className="max-w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CF</span>
              </div>
              <span className="text-xl font-bold">Comunidade Flix</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Ainda não tem conta?</span>
              <Link
                href="/cadastro"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Marketing Content */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Entre para a maior
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {' '}comunidade de educação financeira
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Transforme sua vida financeira com conteúdo prático,
                  comunidade ativa e estratégias que realmente funcionam.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Conteúdo Premium</h3>
                    <p className="text-gray-400 text-sm">Aulas exclusivas com especialistas do mercado</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LogIn className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Acesso Vitalício</h3>
                    <p className="text-gray-400 text-sm">Todo o conteúdo por um único pagamento</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Garantia de 7 dias</h3>
                    <p className="text-gray-400 text-sm">Reembolso total se não gostar</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-5 h-5 bg-orange-400 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Comunidade Ativa</h3>
                    <p className="text-gray-400 text-sm">Mais de 10.000 alunos transformando vidas</p>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-gray-900"></div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-gray-900"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">
                      <strong>4.9/5</strong> de mais de 2.000 avaliações
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "A Comunidade Flix transformou minha vida financeira em apenas 3 meses!"
                </p>
                <p className="text-sm text-gray-500 mt-2">— Maria Santos, Aluna</p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Bem-vindo de volta
                    </h2>
                    <p className="text-gray-400">
                      Entre na sua conta para continuar sua jornada
                    </p>
                  </div>

                  <AuthForm
                    type="login"
                    onSubmit={handleLogin}
                    loading={loading}
                    className="space-y-4"
                  />

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowRecovery(true)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="text-center text-sm text-gray-400">
                      <p>Ao entrar, você concorda com nossos</p>
                      <div className="flex justify-center gap-2 mt-1">
                        <Link href="/termos" className="text-blue-400 hover:text-blue-300 transition-colors">
                          Termos de Uso
                        </Link>
                        <span>e</span>
                        <Link href="/privacidade" className="text-blue-400 hover:text-blue-300 transition-colors">
                          Política de Privacidade
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                      Conexão segura e criptografada
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
