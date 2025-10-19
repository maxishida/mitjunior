'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase.config';

interface PasswordRecoveryProps {
  onBack?: () => void;
  className?: string;
}

interface PasswordRecoveryState {
  step: 'email' | 'sent' | 'success';
  email: string;
  loading: boolean;
  error: string;
  countdown: number;
}

const PasswordRecovery = ({ onBack, className = '' }: PasswordRecoveryProps) => {
  const [state, setState] = useState<PasswordRecoveryState>({
    step: 'email',
    email: '',
    loading: false,
    error: '',
    countdown: 0
  });

  const emailRef = useRef<HTMLInputElement>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (state.countdown > 0) {
      countdownInterval.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          countdown: prev.countdown - 1
        }));
      }, 1000);
    } else if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }

    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, [state.countdown]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.email.trim()) {
      setState(prev => ({ ...prev, error: 'Email é obrigatório' }));
      return;
    }

    if (!validateEmail(state.email)) {
      setState(prev => ({ ...prev, error: 'Email inválido' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      await sendPasswordResetEmail(auth, state.email, {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      });

      setState(prev => ({
        ...prev,
        step: 'sent',
        loading: false,
        countdown: 60
      }));
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro. Tente novamente.';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Nenhuma conta encontrada com este email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
          break;
        default:
          console.error('Password reset error:', error);
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  };

  const handleResendEmail = async () => {
    if (state.countdown > 0) return;

    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      await sendPasswordResetEmail(auth, state.email, {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      });

      setState(prev => ({
        ...prev,
        loading: false,
        countdown: 60,
        step: 'sent'
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao reenviar email. Tente novamente.'
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setState(prev => ({ ...prev, email, error: '' }));
  };

  if (state.step === 'sent') {
    return (
      <div className={`password-recovery ${className}`}>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Email de recuperação enviado!
          </h3>

          <p className="text-gray-600 mb-6">
            Enviamos instruções para <strong>{state.email}</strong>.<br />
            Verifique sua caixa de entrada e siga as orientações.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Não recebeu o email?
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Verifique sua pasta de spam</li>
                  <li>• Confirme se o email está correto</li>
                  <li>• Aguarde alguns minutos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={state.loading || state.countdown > 0}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {state.countdown > 0
                      ? `Reenviar em ${state.countdown}s`
                      : 'Reenviar email'
                    }
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => {
                setState(prev => ({ ...prev, step: 'email' }));
              }}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Usar outro email
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`password-recovery ${className}`}>
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Recuperar senha
        </h3>
        <p className="text-gray-600 text-sm">
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={emailRef}
              type="email"
              id="email"
              value={state.email}
              onChange={handleEmailChange}
              disabled={state.loading}
              className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                state.error
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>
          {state.error && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {state.error}
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            🔒 <strong>Segurança garantida:</strong> O link de recuperação expira em 1 hora
            e só pode ser usado uma vez.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button
            type="submit"
            disabled={state.loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {state.loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enviando...</span>
              </div>
            ) : (
              'Enviar link de recuperação'
            )}
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PasswordRecovery;