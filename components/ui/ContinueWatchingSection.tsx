'use client';

import React from 'react';
import { Card } from './card';
import { Button } from './button';
import { VideoProgressIndicator } from './VideoProgressIndicator';
import { cn } from '@/lib/utils';
import {
  PlayCircle,
  Clock,
  ChevronRight,
  MoreVertical,
  Eye
} from 'lucide-react';

interface ContinueWatchingItem {
  id: string;
  videoId: string;
  courseId: string;
  videoTitle: string;
  courseTitle: string;
  thumbnail?: string;
  watchedSeconds: number;
  totalSeconds: number;
  lastPosition: number;
  lastWatchedAt: Date;
}

interface ContinueWatchingSectionProps {
  items: ContinueWatchingItem[];
  loading?: boolean;
  className?: string;
  onVideoClick?: (videoId: string, courseId: string, lastPosition: number) => void;
  onCourseClick?: (courseId: string) => void;
  maxItems?: number;
  showViewAll?: boolean;
  compact?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
}

export function ContinueWatchingSection({
  items,
  loading = false,
  className,
  onVideoClick,
  onCourseClick,
  maxItems = 6,
  showViewAll = true,
  compact = false,
  gridCols = 3
}: ContinueWatchingSectionProps) {
  const displayItems = items.slice(0, maxItems);

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours}h`;
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return `Há ${Math.floor(diffDays / 7)} sem`;
  };

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Continuar Assistindo</h2>
          <div className="animate-pulse bg-gray-200 h-6 w-20 rounded" />
        </div>
        <div className={cn('grid gap-4', gridColsClass[gridCols])}>
          {[...Array(Math.min(3, maxItems))].map((_, index) => (
            <Card key={index} className="p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-24 h-16 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 rounded w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Nenhum vídeo em andamento</h3>
        <p className="text-sm">
          Comece a assistir um vídeo para ele aparecer aqui
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Continuar Assistindo
          </h2>
          <span className="text-sm text-gray-500">
            ({items.length} {items.length === 1 ? 'vídeo' : 'vídeos'})
          </span>
        </div>

        {showViewAll && items.length > maxItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCourseClick?.('continue-watching')}
            className="flex items-center gap-1"
          >
            Ver todos
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Grid */}
      <div className={cn('grid gap-4', gridColsClass[gridCols])}>
        {displayItems.map((item) => {
          const progressPercentage = item.totalSeconds > 0
            ? (item.watchedSeconds / item.totalSeconds) * 100
            : 0;

          return (
            <Card
              key={item.id}
              className={cn(
                'group overflow-hidden hover:shadow-lg transition-all cursor-pointer',
                compact ? 'p-3' : 'p-4'
              )}
              onClick={() => onVideoClick?.(item.videoId, item.courseId, item.lastPosition)}
            >
              {/* Thumbnail with play button overlay */}
              <div className="relative mb-3 rounded-lg overflow-hidden bg-gray-200">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.videoTitle}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white opacity-50" />
                  </div>
                )}

                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white rounded-full p-2">
                      <PlayCircle className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Progress bar overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-30">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                {/* Video title */}
                <h3 className={cn(
                  'font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors',
                  compact ? 'text-sm' : 'text-base'
                )}>
                  {item.videoTitle}
                </h3>

                {/* Course name */}
                <p className="text-sm text-gray-600 line-clamp-1">
                  {item.courseTitle}
                </p>

                {/* Progress info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(item.lastWatchedAt)}</span>
                  </div>
                  <span>
                    {Math.round(progressPercentage)}% assistido
                  </span>
                </div>

                {/* Continue from position */}
                {!compact && item.lastPosition > 0 && !item.isCompleted && (
                  <div className="text-xs text-blue-600 font-medium">
                    Continuar de {Math.floor(item.lastPosition / 60)}:{(item.lastPosition % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* View All Button */}
      {showViewAll && items.length > maxItems && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => onCourseClick?.('continue-watching')}
            className="flex items-center gap-2 mx-auto"
          >
            Ver todos os {items.length} vídeos
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Compact version for sidebars or smaller areas
export function ContinueWatchingCompact({
  items,
  onVideoClick,
  className,
  maxItems = 5
}: {
  items: ContinueWatchingItem[];
  onVideoClick?: (videoId: string, courseId: string, lastPosition: number) => void;
  className?: string;
  maxItems?: number;
}) {
  const displayItems = items.slice(0, maxItems);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 px-1">
        <Eye className="w-4 h-4 text-blue-600" />
        <h3 className="font-medium text-gray-900 text-sm">Continuar Assistindo</h3>
      </div>

      {displayItems.map((item) => {
        const progressPercentage = item.totalSeconds > 0
          ? (item.watchedSeconds / item.totalSeconds) * 100
          : 0;

        return (
          <div
            key={item.id}
            className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onVideoClick?.(item.videoId, item.courseId, item.lastPosition)}
          >
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.videoTitle}
                className="w-16 h-12 object-cover rounded flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex-shrink-0 flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-white opacity-50" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                {item.videoTitle}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                {item.courseTitle}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}