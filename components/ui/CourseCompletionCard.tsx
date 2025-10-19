'use client';

import React from 'react';
import { Card } from './card';
import { ProgressBar, CircularProgress } from './ProgressBar';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Trophy,
  Clock,
  PlayCircle,
  CheckCircle,
  Calendar,
  Award,
  Star
} from 'lucide-react';

interface CourseCompletionCardProps {
  title: string;
  totalVideos: number;
  completedVideos: number;
  totalDuration: number;
  watchedDuration: number;
  isCompleted: boolean;
  lastAccessedAt: Date;
  coverImage?: string;
  className?: string;
  onClick?: () => void;
  showProgressBar?: boolean;
  showCircularProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CourseCompletionCard({
  title,
  totalVideos,
  completedVideos,
  totalDuration,
  watchedDuration,
  isCompleted,
  lastAccessedAt,
  coverImage,
  className,
  onClick,
  showProgressBar = true,
  showCircularProgress = false,
  size = 'md'
}: CourseCompletionCardProps) {
  const completionPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;
  const timeWatchedPercentage = totalDuration > 0 ? (watchedDuration / totalDuration) * 100 : 0;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays <= 7) return `Há ${diffDays} dias`;
    if (diffDays <= 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    return `Há ${Math.floor(diffDays / 30)} meses`;
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden hover:shadow-lg transition-all cursor-pointer',
        isCompleted && 'border-green-200 bg-gradient-to-br from-green-50 to-white',
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Trophy className="w-3 h-3" />
          Concluído
        </div>
      )}

      <div className="flex gap-4">
        {/* Cover Image or Icon */}
        <div className="flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className={cn(
                'rounded-lg object-cover',
                size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-16 h-16' : 'w-20 h-20'
              )}
            />
          ) : (
            <div className={cn(
              'bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white',
              size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-16 h-16' : 'w-20 h-20'
            )}>
              <BookOpen className={cn(iconSizes[size])} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={cn(
              'font-semibold text-gray-900 truncate',
              size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
            )}>
              {title}
            </h3>

            {showCircularProgress && (
              <CircularProgress
                progress={completionPercentage}
                size={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
                strokeWidth={size === 'sm' ? 3 : 4}
                color={isCompleted ? '#10B981' : '#3B82F6'}
              />
            )}
          </div>

          {/* Progress Bar */}
          {showProgressBar && (
            <div className="mb-3">
              <ProgressBar
                progress={completionPercentage}
                size="sm"
                color={isCompleted ? 'success' : 'primary'}
              />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <PlayCircle className={cn(iconSizes[size], 'text-blue-500')} />
              <span>{completedVideos}/{totalVideos} vídeos</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className={cn(iconSizes[size], 'text-green-500')} />
              <span>{formatTime(watchedDuration)}</span>
            </div>

            {size !== 'sm' && (
              <>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className={cn(iconSizes[size], 'text-purple-500')} />
                  <span>{Math.round(completionPercentage)}%</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className={cn(iconSizes[size], 'text-orange-500')} />
                  <span className="truncate">{formatDate(lastAccessedAt)}</span>
                </div>
              </>
            )}
          </div>

          {/* Extra info for completed courses */}
          {isCompleted && size !== 'sm' && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <Award className="w-4 h-4" />
                <span className="font-medium">Curso concluído!</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress overlay for visual effect */}
      {showProgressBar && !isCompleted && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      )}
    </Card>
  );
}

interface CourseCompletionListProps {
  courses: Array<{
    id: string;
    title: string;
    totalVideos: number;
    completedVideos: number;
    totalDuration: number;
    watchedDuration: number;
    isCompleted: boolean;
    lastAccessedAt: Date;
    coverImage?: string;
  }>;
  className?: string;
  onCourseClick?: (courseId: string) => void;
  showProgressBar?: boolean;
  showCircularProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CourseCompletionList({
  courses,
  className,
  onCourseClick,
  showProgressBar = true,
  showCircularProgress = false,
  size = 'md'
}: CourseCompletionListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Nenhum curso iniciado ainda</p>
      </div>
    );
  }

  // Sort by completion status and last accessed date
  const sortedCourses = [...courses].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    return b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime();
  });

  return (
    <div className={cn('space-y-4', className)}>
      {sortedCourses.map((course) => (
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
          onClick={() => onCourseClick?.(course.id)}
          showProgressBar={showProgressBar}
          showCircularProgress={showCircularProgress}
          size={size}
        />
      ))}
    </div>
  );
}