'use client';

import { useAuth } from '@/context/AuthContext';
import { useProgressSummary } from '@/hooks/useProgressSummary';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useRecentVideos } from '@/hooks/useRecentVideos';
import { CourseCompletionCard } from '@/components/ui/CourseCompletionCard';
import { VideoProgressList } from '@/components/ui/VideoProgressIndicator';
import { CircularProgress, ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Trophy,
  TrendingUp,
  Clock,
  BookOpen,
  Target,
  Flame,
  Calendar,
  Award,
  BarChart3,
  PlayCircle
} from 'lucide-react';

export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth();
  const { summary, loading: summaryLoading, error: summaryError } = useProgressSummary(user?.uid);
  const [courseProgresses, setCourseProgresses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const { items: recentVideos } = useRecentVideos(user?.uid, 10);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadCourseProgresses = async () => {
      if (!user) return;

      try {
        // Get all unique course IDs from user progress
        const response = await fetch('/api/user/courses');
        if (response.ok) {
          const courses = await response.json();
          setCourseProgresses(courses);
        }
      } catch (error) {
        console.error('Error loading course progresses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    if (user) {
      loadCourseProgresses();
    }
  }, [user]);

  if (authLoading || summaryLoading || loadingCourses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  if (summaryError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md mx-auto">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar progresso
            </h2>
            <p className="text-gray-600 mb-4">
              {summaryError.message}
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

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const handleVideoClick = (videoId: string) => {
    // This would need to be implemented to navigate to specific video
    console.log('Navigate to video:', videoId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Meu Progresso
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
        {summary ? (
          <div className="space-y-8">
            {/* Overview Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cursos Iniciados</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {summary.totalCoursesStarted}
                    </p>
                    <p className="text-xs text-gray-500">
                      {summary.totalCoursesCompleted} concluídos
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <PlayCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vídeos Assistidos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {summary.totalVideosWatched}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tempo de Estudo</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(summary.totalWatchTime / 60)}h
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sequência Atual</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {summary.currentStreak} dias
                    </p>
                    <p className="text-xs text-gray-500">
                      Recorde: {summary.longestStreak} dias
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Weekly Progress Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Progresso Semanal
                </h2>
                <span className="text-sm text-gray-500">
                  Últimas 4 semanas
                </span>
              </div>

              <div className="space-y-4">
                {summary.weeklyProgress.map((week, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-gray-600">
                      {week.week}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">
                          {Math.round(week.minutesWatched)} minutos
                        </span>
                        <span className="text-xs text-gray-600">
                          {week.videosCompleted} vídeos
                        </span>
                      </div>
                      <ProgressBar
                        progress={Math.min(100, (week.minutesWatched / 300) * 100)} // 5 hours = 100%
                        size="sm"
                        color="primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Course Progress */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Progresso por Curso
              </h2>

              {courseProgresses.length === 0 ? (
                <Card className="p-8 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum curso iniciado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comece a assistir aos vídeos para acompanhar seu progresso
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Explorar Cursos
                  </button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courseProgresses.map((course) => (
                    <CourseCompletionCard
                      key={course.id}
                      title={course.title}
                      totalVideos={course.totalVideos}
                      completedVideos={course.completedVideos}
                      totalDuration={course.totalDuration}
                      watchedDuration={course.watchedDuration}
                      isCompleted={course.isCompleted}
                      lastAccessedAt={course.lastAccessedAt}
                      coverImage={course.coverImage}
                      onClick={() => handleCourseClick(course.id)}
                      showProgressBar={true}
                      showCircularProgress={false}
                      size="md"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Videos */}
            {recentVideos.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Vídeos Recentes
                </h2>

                <VideoProgressList
                  videos={recentVideos.map(video => ({
                    id: video.id,
                    title: video.videoTitle,
                    watchedSeconds: video.watchedSeconds,
                    totalSeconds: video.totalSeconds,
                    isCompleted: video.watchedSeconds >= video.totalSeconds * 0.9,
                    lastPosition: video.lastPosition,
                    thumbnail: video.thumbnail
                  }))}
                  onVideoClick={handleVideoClick}
                  compact={true}
                  showThumbnails={false}
                />
              </div>
            )}

            {/* Achievements Section */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Próximas Conquistas
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Primeiro Curso</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Conclua seu primeiro curso
                  </p>
                  {summary.totalCoursesCompleted > 0 && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      ✓ Desbloqueado
                    </div>
                  )}
                </div>

                <div className="text-center p-4 bg-white rounded-lg">
                  <Flame className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Dedicado</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Mantenha uma sequência de 7 dias
                  </p>
                  {summary.currentStreak >= 7 && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      ✓ Desbloqueado
                    </div>
                  )}
                </div>

                <div className="text-center p-4 bg-white rounded-lg">
                  <Target className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Maratonista</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Assista 50 vídeos
                  </p>
                  {summary.totalVideosWatched >= 50 && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      ✓ Desbloqueado
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center py-16">
            <BarChart3 className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Comece sua jornada de aprendizado
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Seu progresso aparecerá aqui assim que você começar a assistir aos vídeos dos cursos.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Explorar Cursos
            </button>
          </div>
        )}
      </main>
    </div>
  );
}