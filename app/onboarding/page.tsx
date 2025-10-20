'use client';

import { useAuth } from '@/context/AuthContext';
import OnboardingFlow from '@/components/auth/OnboardingFlow';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const canRender = Boolean(user) || isDevelopment;

  useEffect(() => {
    if (!loading && !user && !isDevelopment) {
      router.push('/login');
    }
  }, [user, loading, router, isDevelopment]);

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

  return <OnboardingFlow />;
}
