'use client';

import { useState, useCallback } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase.config';
import { useAuth } from '@/context/AuthContext';
import { AuthForm, SocialAuthButtons } from '@/components/auth';
import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    termsAccepted: false,
    phone: '',
    birthDate: '',
    profession: '',
    howDidYouFindUs: '',
    newsletterConsent: false
  });
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Professions options
  const professions = [
    'Empresário(a)',
    'Freelancer',
    'Funcionário(a) CLT',
    'Estudante',
    'Investidor(a)',
    'Aposentado(a)',
    'Autônomo(a)',
    'Outro'
  ];

  // How did you find us options
  const discoveryOptions = [
    'Instagram',
    'YouTube',
    'Google',
    'Indicação de amigo',
    'Facebook',
    'LinkedIn',
    'TikTok',
    'Outro'
  ];

  const handleFormSubmit = async (formData: any) => {
    setLoading(true);
    setCurrentStep(2);
  };

  const handleFinalSubmit = async () => {
    if (!signupData.termsAccepted) {
      alert('Você precisa aceitar os termos de uso para continuar.');
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );
      const { user: firebaseUser } = userCredential;

      // Get ID token
      const idToken = await firebaseUser.getIdToken();

      // Create user document in Firestore
      const userData = {
        uid: firebaseUser.uid,
        email: signupData.email,
        displayName: signupData.name,
        photoURL: null,
        phone: signupData.phone || null,
        birthDate: signupData.birthDate || null,
        profession: signupData.profession || null,
        howDidYouFindUs: signupData.howDidYouFindUs || null,
        newsletterConsent: signupData.newsletterConsent,
        emailVerified: false,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        onboardingCompleted: false,
        subscription: {
          status: 'trial',
          plan: 'free',
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
        },
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo'
        },
        gamification: {
          level: 1,
          xp: 0,
          streak: 0,
          badges: [],
          achievements: []
        }
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // Create session cookie
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          rememberMe: false,
          loginType: 'signup'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      // Send welcome email
      await fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupData.email,
          name: signupData.name
        }),
      });

      // Track signup analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'sign_up', {
          method: 'email',
          user_id: firebaseUser.uid
        });

        // Track custom conversion
        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL'
        });
      }

      // Redirect to onboarding
      router.push('/onboarding');

    } catch (error: any) {
      console.error('Signup error:', error);

      let errorMessage = 'Ocorreu um erro ao criar sua conta. Tente novamente.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha é muito fraca. Use uma senha mais forte.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
          break;
      }

      alert(errorMessage);
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuthSuccess = async (userProfile: any) => {
    try {
      const userData = {
        uid: userProfile.uid,
        email: userProfile.email,
        displayName: userProfile.displayName,
        photoURL: userProfile.photoURL,
        provider: userProfile.provider,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        onboardingCompleted: false,
        subscription: {
          status: 'trial',
          plan: 'free',
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo'
        },
        gamification: {
          level: 1,
          xp: 0,
          streak: 0,
          badges: ['social_signup'],
          achievements: ['first_login']
        }
      };

      // Create or update user document
      await setDoc(doc(db, 'users', userProfile.uid), userData, { merge: true });

      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'sign_up', {
          method: userProfile.provider,
          user_id: userProfile.uid
        });
      }

      // Redirect based on whether it's a new user
      const redirectPath = userProfile.isNewUser ? '/onboarding' : '/dashboard';
      router.push(redirectPath);

    } catch (error) {
      console.error('Social auth error:', error);
      alert('Ocorreu um erro ao processar seu cadastro. Tente novamente.');
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
    router.push('/dashboard');
    return null;
  }

  const updateSignupData = (field: string, value: any) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
  };

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CF</span>
              </div>
              <span className="text-xl font-bold">Comunidade Flix</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Já tem conta?</span>
              <Link
                href="/login"
                className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 font-medium border border-white/20"
              >
                Fazer Login
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Benefits */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Comece sua jornada para
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {' '}liberdade financeira
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Junte-se a mais de 10.000 alunos transformando suas vidas
                  com educação financeira prática e aplicada.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Acesso Vitalício</h3>
                    <p className="text-gray-400 text-sm">Todo o conteúdo por um único pagamento</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Garantia de 7 dias</h3>
                    <p className="text-gray-400 text-sm">Reembolso total se não gostar</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Comunidade Ativa</h3>
                    <p className="text-gray-400 text-sm">Suporte direto com especialistas e alunos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Atualizações Gratuitas</h3>
                    <p className="text-gray-400 text-sm">Novos módulos e aulas todo mês</p>
                  </div>
                </div>
              </div>

              {/* Special Offer */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-8 w-8 text-yellow-300" />
                  <h3 className="text-xl font-bold text-white">Oferta Limitada</h3>
                </div>
                <p className="text-white mb-4">
                  Cadastre-se hoje e ganhe acesso ao módulo bônus:
                  <strong> "Primeiros Passos em Investimentos"</strong>
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-white">GRÁTIS</span>
                  <span className="text-white/70 line-through">R$ 197</span>
                </div>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Criar sua conta gratuita
                    </h2>
                    <p className="text-gray-400">
                      Comece em menos de 2 minutos
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Social Auth */}
                    <SocialAuthButtons
                      onSuccess={handleSocialAuthSuccess}
                      onError={(error) => alert(error)}
                    />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-transparent text-gray-400">ou cadastre-se com email</span>
                      </div>
                    </div>

                    {/* Email/Password Form */}
                    <AuthForm
                      type="signup"
                      onSubmit={handleFormSubmit}
                      loading={loading}
                      className="space-y-4"
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="text-center text-sm text-gray-400">
                      <p>Ao criar sua conta, você concorda com nossos</p>
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
                      Cadastro 100% seguro e criptografado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Additional Information
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/cadastro" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">2</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Quase lá! 🎉
          </h1>
          <p className="text-xl text-gray-300">
            Precisamos de mais algumas informações para personalizar sua experiência
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <div className="space-y-6">
            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Telefone (opcional)
              </label>
              <input
                type="tel"
                value={signupData.phone}
                onChange={(e) => updateSignupData('phone', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(00) 00000-0000"
              />
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Data de nascimento (opcional)
              </label>
              <input
                type="date"
                value={signupData.birthDate}
                onChange={(e) => updateSignupData('birthDate', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Profession */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Profissão
              </label>
              <select
                value={signupData.profession}
                onChange={(e) => updateSignupData('profession', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" className="bg-gray-900">Selecione sua profissão</option>
                {professions.map(prof => (
                  <option key={prof} value={prof} className="bg-gray-900">{prof}</option>
                ))}
              </select>
            </div>

            {/* How did you find us */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Como nos conheceu?
              </label>
              <select
                value={signupData.howDidYouFindUs}
                onChange={(e) => updateSignupData('howDidYouFindUs', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" className="bg-gray-900">Selecione uma opção</option>
                {discoveryOptions.map(option => (
                  <option key={option} value={option} className="bg-gray-900">{option}</option>
                ))}
              </select>
            </div>

            {/* Newsletter Consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="newsletter"
                checked={signupData.newsletterConsent}
                onChange={(e) => updateSignupData('newsletterConsent', e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="newsletter" className="text-sm text-gray-300">
                Quero receber dicas exclusivas e conteúdo especial por email
              </label>
            </div>

            {/* Terms Acceptance */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={signupData.termsAccepted}
                onChange={(e) => updateSignupData('termsAccepted', e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                Li e aceito os{' '}
                <Link href="/termos" className="text-blue-400 hover:text-blue-300 underline">
                  Termos de Uso
                </Link>
                {' '}e a{' '}
                <Link href="/privacidade" className="text-blue-400 hover:text-blue-300 underline">
                  Política de Privacidade
                </Link>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleFinalSubmit}
            disabled={loading || !signupData.termsAccepted}
            className="w-full mt-8 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Criando sua conta...</span>
              </div>
            ) : (
              <span>🚀 Criar minha conta gratuita</span>
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">
                Seus dados estão seguros e criptografados
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
