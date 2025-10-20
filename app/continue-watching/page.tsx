'use client';

import { useAuth } from '@/context/AuthContext';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import { ContinueWatchingSection } from '@/components/ui/ContinueWatchingSection';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  PlayCircle,
  History,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function ContinueWatchingPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, loading: progressLoading, error } = useContinueWatching(user?.uid);
  const router = useRouter();
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const canAccess = Boolean(user) || isDevelopment;

  useEffect(() => {
    if (!authLoading && !user && !isDevelopment) {
      router.push('/login');
    }
  }, [user, authLoading, router, isDevelopment]);

  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!canAccess) {
    return null; // Will redirect
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md mx-auto">
          <div className="text-center">
            <History className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar vídeos
            </h2>
            <p className="text-gray-600 mb-4">
              {error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const handleVideoClick = (videoId: string, courseId: string, lastPosition: number) => {
    router.push(`/course/${courseId}?video=${videoId}&position=${Math.floor(lastPosition)}`);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Continuar Assistindo
              </h1>
            </div>

            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <PlayCircle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Nenhum vídeo em andamento
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Você ainda não começou a assistir nenhum vídeo. Explore nossos cursos e comece a aprender hoje mesmo!
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Explorar Cursos
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <PlayCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vídeos em andamento</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {items.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tempo total assistido</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        items.reduce((total, item) => total + item.watchedSeconds, 0) / 60
                      )} min
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Progresso médio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        items.reduce((total, item) => {
                          const progress = item.totalSeconds > 0
                            ? (item.watchedSeconds / item.totalSeconds) * 100
                            : 0;
                          return total + progress;
                        }, 0) / items.length
                      )}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Continue Watching Section */}
            <ContinueWatchingSection
              items={items}
              onVideoClick={handleVideoClick}
              onCourseClick={handleCourseClick}
              maxItems={20}
              showViewAll={false}
              gridCols={3}
            />
          </div>
        )}
      </main>
    </div>
  );
}
