'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Play,
  Download,
  Gift
} from 'lucide-react';

export default function BemVindoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const canRender = Boolean(user) || isDevelopment;

  useEffect(() => {
    if (!loading && !user && !isDevelopment) {
      router.push('/login');
    }
  }, [user, loading, router, isDevelopment]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!canRender) {
    return null;
  }

  const startOnboarding = () => {
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo à Comunidade Flix! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua jornada para liberdade financeira começa agora. Estamos muito felizes em ter você conosco!
          </p>
        </div>

        {/* Success Message */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Cadastro realizado com sucesso!</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Sua conta foi criada e você já tem acesso a todo o conteúdo da plataforma.
            Vamos te guiar nos primeiros passos para aproveitar ao máximo.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Redirecionando para o onboarding em</span>
            <span className="font-mono font-bold text-blue-600">{countdown}</span>
            <span>segundos...</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Welcome Gift */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Seu Presente de Boas-Vindas</h3>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white mb-6">
                <h4 className="text-2xl font-bold mb-2">
                  Módulo Bônus Exclusivo
                </h4>
                <p className="mb-4">
                  "Primeiros Passos em Investimentos" - Normalmente R$197, agora GRÁTIS para você!
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => window.open('/cursos/primeiros-passos', '_blank')}
                    className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Acessar Agora
                  </button>
                  <span className="text-sm opacity-90">Vitalício</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">+50 Aulas</h4>
                  <p className="text-sm text-gray-600">Conteúdo prático e aplicável</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <Users className="h-8 w-8 text-green-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Comunidade Ativa</h4>
                  <p className="text-sm text-gray-600">Mais de 10.000 alunos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Próximos Passos</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Complete seu perfil</h4>
                  <p className="text-sm text-gray-600">Personalize sua experiência</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Defina seus objetivos</h4>
                  <p className="text-sm text-gray-600">Metas personalizadas para você</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Comece a aprender</h4>
                  <p className="text-sm text-gray-600">Acesse seu primeiro módulo</p>
                </div>
              </div>
            </div>

            <button
              onClick={startOnboarding}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Começar Onboarding
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Comece Imediatamente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/cursos/introducao"
              className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all duration-200 text-center"
            >
              <Play className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Módulo 1: Introdução</h4>
              <p className="text-sm text-gray-600 mb-4">
                Fundamentos de educação financeira
              </p>
              <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                Começar agora →
              </span>
            </Link>

            <Link
              href="/comunidade"
              className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all duration-200 text-center"
            >
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Comunidade</h4>
              <p className="text-sm text-gray-600 mb-4">
                Conecte-se com outros alunos
              </p>
              <span className="text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                Entrar agora →
              </span>
            </Link>

            <Link
              href="/calculadoras"
              className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all duration-200 text-center"
            >
              <TrendingUp className="h-12 w-6 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Calculadoras</h4>
              <p className="text-sm text-gray-600 mb-4">
                Ferramentas financeiras gratuitas
              </p>
              <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors">
                Usar agora →
              </span>
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Precisa de Ajuda?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nossa equipe de suporte está disponível para ajudar você em cada passo da sua jornada.
              Não hesite em nos contatar!
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:suporte@comunidadeflix.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Email Suporte
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
