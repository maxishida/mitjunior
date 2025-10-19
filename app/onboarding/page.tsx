'use client';

import { useAuth } from '@/context/AuthContext';
import OnboardingFlow from '@/components/auth/OnboardingFlow';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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

  if (!user) {
    return null;
  }

  return <OnboardingFlow />;
}