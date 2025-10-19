'use client';

import { useState } from 'react';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase.config';
import { Loader2 } from 'lucide-react';

interface SocialAuthButtonsProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

const SocialAuthButtons = ({
  onSuccess,
  onError,
  className = '',
  disabled = false
}: SocialAuthButtonsProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    if (disabled) return;

    setLoading(provider);

    try {
      let authProvider;

      if (provider === 'google') {
        authProvider = new GoogleAuthProvider();
        authProvider.addScope('profile');
        authProvider.addScope('email');
        // Configure provider for better user experience
        authProvider.setCustomParameters({
          prompt: 'select_account',
          access_type: 'offline'
        });
      } else {
        authProvider = new FacebookAuthProvider();
        authProvider.addScope('email');
        authProvider.addScope('public_profile');
      }

      const result = await signInWithPopup(auth, authProvider);

      // Get user info for analytics
      const user = result.user;
      const additionalData = result.additionalUserInfo;

      // Extract user profile information
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: provider,
        isNewUser: additionalData?.isNewUser,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      // Get ID token for session management
      const idToken = await user.getIdToken();

      // Call API to create session and sync user data
      const response = await fetch('/api/auth/social-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          provider,
          userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const sessionData = await response.json();

      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'social_login', {
          provider: provider,
          user_id: user.uid,
          is_new_user: additionalData?.isNewUser
        });
      }

      // Call success callback
      if (onSuccess) {
        onSuccess({ ...userProfile, ...sessionData });
      } else {
        // Default redirect behavior
        const isNewUser = additionalData?.isNewUser;
        window.location.href = isNewUser ? '/onboarding' : '/dashboard';
      }

    } catch (error: any) {
      console.error(`${provider} auth error:`, error);

      let errorMessage = `Erro ao fazer login com ${provider}`;

      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          // User closed popup, don't show error
          return;
        case 'auth/popup-blocked':
          errorMessage = 'Popup bloqueado pelo navegador. Permita popups e tente novamente.';
          break;
        case 'auth/cancelled-popup-request':
          return; // Multiple popup requests, ignore
        case 'auth/network-request-failed':
          errorMessage = 'Falha de conexão. Verifique sua internet e tente novamente.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta conta foi desativada.';
          break;
        default:
          if (error.message) {
            errorMessage = error.message;
          }
      }

      // Track error in analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'auth_error', {
          provider: provider,
          error_code: error.code,
          error_message: error.message
        });
      }

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Google Login */}
      <button
        onClick={() => handleSocialAuth('google')}
        disabled={disabled || loading !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
      >
        {loading === 'google' ? (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        <span className="font-medium text-gray-700 group-hover:text-gray-900">
          {loading === 'google' ? 'Conectando...' : 'Continuar com Google'}
        </span>
      </button>

      {/* Facebook Login */}
      <button
        onClick={() => handleSocialAuth('facebook')}
        disabled={disabled || loading !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] border border-[#1877F2] rounded-xl hover:bg-[#166FE5] focus:ring-2 focus:ring-[#1877F2] focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
      >
        {loading === 'facebook' ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )}
        <span className="font-medium text-white">
          {loading === 'facebook' ? 'Conectando...' : 'Continuar com Facebook'}
        </span>
      </button>

      {/* Additional Social Options (future expansion) */}
      {/*
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Outras opções</span>
        </div>
      </div>

      <button
        onClick={() => handleSocialAuth('apple')}
        disabled={disabled || loading !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black border border-black rounded-xl hover:bg-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
      >
        {loading === 'apple' ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        )}
        <span className="font-medium text-white">
          {loading === 'apple' ? 'Conectando...' : 'Continuar com Apple'}
        </span>
      </button>
      */}
    </div>
  );
};

export default SocialAuthButtons;