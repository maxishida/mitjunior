'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase.config';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: AuthFormData) => Promise<void>;
  loading?: boolean;
  className?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  termsAccepted?: boolean;
  rememberMe?: boolean;
}

const AuthForm = ({ type, onSubmit, loading = false, className = '' }: AuthFormProps) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
    termsAccepted: false,
    rememberMe: false
  });

  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const passwordRef = useRef<HTMLInputElement>(null);

  // Enhanced password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;
    const hasLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNoCommonPatterns = !/(123|abc|qwe|password|senha)/i.test(password);

    if (hasLength) strength += 20;
    if (hasUpperCase) strength += 20;
    if (hasLowerCase) strength += 20;
    if (hasNumbers) strength += 20;
    if (hasSpecialChar) strength += 15;
    if (hasNoCommonPatterns) strength += 5;

    return Math.min(strength, 100);
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Real-time validation
  const validateField = (name: string, value: any) => {
    const newErrors: Partial<AuthFormData> = {};

    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(value)) {
          newErrors.email = 'Email inválido';
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Senha é obrigatória';
        } else if (value.length < 8) {
          newErrors.password = 'Mínimo 8 caracteres';
        } else if (passwordStrength < 60 && type === 'signup') {
          newErrors.password = 'Senha muito fraca';
        }
        break;

      case 'name':
        if (type === 'signup' && !value?.trim()) {
          newErrors.name = 'Nome é obrigatório';
        } else if (value?.trim().length < 3) {
          newErrors.name = 'Mínimo 3 caracteres';
        }
        break;

      case 'termsAccepted':
        if (type === 'signup' && !value) {
          newErrors.termsAccepted = 'Aceite os termos para continuar';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: newErrors[name as keyof AuthFormData] }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (touched.has(name)) {
      validateField(name, fieldValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setTouched(prev => new Set([...prev, name]));
    validateField(name, fieldValue);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);

    try {
      let authProvider;
      if (provider === 'google') {
        authProvider = new GoogleAuthProvider();
        authProvider.addScope('profile');
        authProvider.addScope('email');
      } else {
        authProvider = new FacebookAuthProvider();
      }

      const result = await signInWithPopup(auth, authProvider);
      const idToken = await result.user.getIdToken();

      // Call API to create session
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, provider }),
      });

      window.location.assign('/onboarding');
    } catch (error: any) {
      console.error('Social login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed popup, don't show error
        return;
      }
      setErrors(prev => ({
        ...prev,
        email: `Erro ao fazer login com ${provider}: ${error.message}`
      }));
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const allTouched = new Set(['email', 'password', ...(type === 'signup' ? ['name', 'termsAccepted'] : [])]);
    setTouched(allTouched);

    Object.keys(formData).forEach(key => {
      validateField(key, formData[key as keyof AuthFormData]);
    });

    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) return;

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setErrors({ email: error.message || 'Ocorreu um erro. Tente novamente.' });
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Fraca';
    if (passwordStrength < 70) return 'Média';
    return 'Forte';
  };

  return (
    <div className={`auth-form ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={!!socialLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {socialLoading === 'google' ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="font-medium">
              {socialLoading === 'google' ? 'Conectando...' : 'Continuar com Google'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            disabled={!!socialLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {socialLoading === 'facebook' ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )}
            <span className="font-medium">
              {socialLoading === 'facebook' ? 'Conectando...' : 'Continuar com Facebook'}
            </span>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {/* Name field for signup */}
        {type === 'signup' && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.name
                    ? 'border-red-300 bg-red-50'
                    : touched.has('name') && !errors.name
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Seu nome completo"
                autoComplete="name"
              />
              {touched.has('name') && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {errors.name ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : formData.name ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : null}
                </div>
              )}
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </p>
            )}
          </div>
        )}

        {/* Email field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.email
                  ? 'border-red-300 bg-red-50'
                  : touched.has('email') && !errors.email
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="seu@email.com"
              autoComplete="email"
            />
            {touched.has('email') && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {errors.email ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : formData.email ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : null}
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.password
                  ? 'border-red-300 bg-red-50'
                  : touched.has('password') && !errors.password
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="••••••••"
              autoComplete={type === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Password strength indicator for signup */}
          {type === 'signup' && formData.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Força da senha</span>
                <span className={`font-medium ${
                  passwordStrength < 40 ? 'text-red-500' :
                  passwordStrength < 70 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="h-4 w-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember me / Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Lembrar de mim
            </label>
          </div>
          {type === 'login' && (
            <a
              href="/esqueci-senha"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Esqueceu a senha?
            </a>
          )}
        </div>

        {/* Terms for signup */}
        {type === 'signup' && (
          <div className="space-y-2">
            <div className="flex items-start">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-700">
                Eu concordo com os{' '}
                <a href="/termos" className="text-blue-600 hover:text-blue-700 font-medium">
                  Termos de Uso
                </a>
                {' '}e{' '}
                <a href="/privacidade" className="text-blue-600 hover:text-blue-700 font-medium">
                  Política de Privacidade
                </a>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.termsAccepted}
              </p>
            )}
          </div>
        )}

        {/* Security badges */}
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>Segurança bancária</span>
          </div>
          <span className="text-gray-300">•</span>
          <span>SSL 256-bit</span>
          <span className="text-gray-300">•</span>
          <span>LGPD compliant</span>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !!socialLoading || (type === 'signup' && !formData.termsAccepted)}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processando...</span>
            </div>
          ) : (
            <span>{type === 'login' ? 'Entrar na Comunidade' : 'Criar Conta Gratuita'}</span>
          )}
        </button>

        {/* Form switcher */}
        <div className="text-center text-sm text-gray-600">
          {type === 'login' ? (
            <>
              Novo por aqui?{' '}
              <a href="/cadastro" className="text-blue-600 hover:text-blue-700 font-medium">
                Crie sua conta gratuita
              </a>
            </>
          ) : (
            <>
              Já tem uma conta?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Faça login
              </a>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;