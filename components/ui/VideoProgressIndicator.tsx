'use client';

import React from 'react';
import { ProgressBar } from './ProgressBar';
import { Card } from './card';
import { cn } from '@/lib/utils';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';

interface VideoProgressIndicatorProps {
  title: string;
  watchedSeconds: number;
  totalSeconds: number;
  isCompleted: boolean;
  lastPosition?: number;
  thumbnail?: string;
  className?: string;
  showTime?: boolean;
  showThumbnail?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export function VideoProgressIndicator({
  title,
  watchedSeconds,
  totalSeconds,
  isCompleted,
  lastPosition,
  thumbnail,
  className,
  showTime = true,
  showThumbnail = false,
  compact = false,
  onClick
}: VideoProgressIndicatorProps) {
  const progressPercentage = totalSeconds > 0 ? (watchedSeconds / totalSeconds) * 100 : 0;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatProgress = (): string => {
    if (isCompleted) return 'Concluído';
    if (watchedSeconds === 0) return 'Não iniciado';

    const percentage = Math.round(progressPercentage);
    return `${percentage}% assistido`;
  };

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <div className="flex-shrink-0">
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <PlayCircle className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
          <ProgressBar
            progress={progressPercentage}
            size="sm"
            color={isCompleted ? 'success' : 'primary'}
            className="mt-1"
          />
        </div>

        {showTime && (
          <div className="flex-shrink-0 text-xs text-gray-500">
            {formatProgress()}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card
      className={cn(
        'p-4 hover:shadow-md transition-all cursor-pointer',
        isCompleted && 'border-green-200 bg-green-50',
        className
      )}
      onClick={onClick}
    >
      <div className="flex gap-4">
        {showThumbnail && thumbnail && (
          <div className="flex-shrink-0 w-24 h-16 bg-gray-200 rounded overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 truncate flex-1">
              {title}
            </h3>

            <div className="flex items-center gap-1 flex-shrink-0">
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : watchedSeconds > 0 ? (
                <Clock className="w-5 h-5 text-blue-600" />
              ) : (
                <PlayCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          <ProgressBar
            progress={progressPercentage}
            size="sm"
            color={isCompleted ? 'success' : 'primary'}
            className="mb-2"
          />

          <div className="flex items-center justify-between text-sm">
            {showTime && (
              <div className="flex items-center gap-2 text-gray-600">
                <span>{formatTime(watchedSeconds)}</span>
                <span>/</span>
                <span>{formatTime(totalSeconds)}</span>
              </div>
            )}

            <span className={cn(
              'text-xs font-medium',
              isCompleted ? 'text-green-600' : 'text-gray-500'
            )}>
              {formatProgress()}
            </span>
          </div>

          {lastPosition !== undefined && !isCompleted && watchedSeconds > 0 && (
            <div className="mt-2 text-xs text-blue-600">
              Continuar de {formatTime(lastPosition)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface VideoProgressListProps {
  videos: Array<{
    id: string;
    title: string;
    watchedSeconds: number;
    totalSeconds: number;
    isCompleted: boolean;
    lastPosition?: number;
    thumbnail?: string;
  }>;
  className?: string;
  onVideoClick?: (videoId: string) => void;
  showThumbnails?: boolean;
  compact?: boolean;
}

export function VideoProgressList({
  videos,
  className,
  onVideoClick,
  showThumbnails = false,
  compact = false
}: VideoProgressListProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <PlayCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Nenhum vídeo assistido ainda</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {videos.map((video) => (
        <VideoProgressIndicator
          key={video.id}
          title={video.title}
          watchedSeconds={video.watchedSeconds}
          totalSeconds={video.totalSeconds}
          isCompleted={video.isCompleted}
          lastPosition={video.lastPosition}
          thumbnail={video.thumbnail}
          showThumbnail={showThumbnails}
          compact={compact}
          onClick={() => onVideoClick?.(video.id)}
        />
      ))}
    </div>
  );
}