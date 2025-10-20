'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Clock, MoreVertical, X, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Video } from '@/types/course';

interface ContinueWatchingProps {
  videos: (Video & { course: any })[];
}

export default function ContinueWatching({ videos }: ContinueWatchingProps) {
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize progress from mock data
    const initialProgress: Record<string, number> = {};
    videos.forEach(video => {
      initialProgress[video.id] = (video.watchTime / video.duration) * 100;
    });
    setProgress(initialProgress);

    return () => {
      const currentInterval = intervalRef.current;
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    };
  }, [videos]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = (video: Video) => {
    const remaining = video.duration - video.watchTime;
    return formatTime(Math.floor(remaining));
  };

  const handleVideoHover = (videoId: string) => {
    setExpandedVideo(videoId);
  };

  const handleVideoLeave = () => {
    setExpandedVideo(null);
  };

  const markAsCompleted = (videoId: string) => {
    setProgress(prev => ({ ...prev, [videoId]: 100 }));
    // Here you would typically call an API to mark the video as completed
    setTimeout(() => {
      // Remove video from continue watching after completion
      const videoElement = document.getElementById(`continue-video-${videoId}`);
      if (videoElement) {
        videoElement.style.opacity = '0';
        videoElement.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          videoElement.style.display = 'none';
        }, 300);
      }
    }, 500);
  };

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Continuar Assistindo</h2>
        <Link href="/app/continue-watching" className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
          Ver todos →
        </Link>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <div
            key={video.id}
            id={`continue-video-${video.id}`}
            className={`
              group relative bg-neutral-800 rounded-lg overflow-hidden
              transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-xl hover:shadow-black/50
              hover:border hover:border-brand-500/50
            `}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
            onMouseEnter={() => handleVideoHover(video.id)}
            onMouseLeave={handleVideoLeave}
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-video">
              <Image
                src={video.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop'}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Link href={`/app/cursos/${video.course.id}/aula/${video.id}`}>
                  <button className="p-4 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 hover:bg-brand-600">
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </button>
                </Link>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                <div
                  className="h-full bg-brand-500 transition-all duration-300"
                  style={{ width: `${progress[video.id] || 0}%` }}
                ></div>
              </div>

              {/* Remaining Time Badge */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
                <Clock className="w-3 h-3 inline mr-1" />
                {getRemainingTime(video)}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-brand-400 transition-colors">
                {video.title}
              </h3>

              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-neutral-400 line-clamp-1">
                  {video.course.title}
                </p>

                <div className="flex items-center space-x-1">
                  <span className="text-xs text-neutral-400">
                    Aula {video.lessonNumber}
                  </span>
                  {progress[video.id] === 100 && (
                    <Check className="w-3 h-3 text-green-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Actions on Hover */}
            <div className={`
              absolute top-2 left-2 flex items-center space-x-2
              transition-all duration-300
              ${expandedVideo === video.id ? 'opacity-100' : 'opacity-0'}
            `}>
              <button
                onClick={() => markAsCompleted(video.id)}
                className="p-2 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full transition-colors"
                title="Marcar como concluído"
              >
                <Check className="w-4 h-4 text-green-400" />
              </button>

              <button
                className="p-2 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full transition-colors"
                title="Mais opções"
              >
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Completion Checkmark Overlay */}
            {progress[video.id] === 100 && (
              <div className="absolute top-2 right-2">
                <div className="p-1 bg-green-500 rounded-full">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-neutral-300">
              <span className="text-white font-semibold">{videos.length}</span> vídeo{videos.length !== 1 ? 's' : ''} em andamento
            </div>
            <div className="text-sm text-neutral-300">
              <span className="text-white font-semibold">
                {videos.reduce((acc, video) => acc + video.watchTime, 0) / 60 > 60
                  ? `${Math.floor(videos.reduce((acc, video) => acc + video.watchTime, 0) / 3600)}h`
                  : `${Math.floor(videos.reduce((acc, video) => acc + video.watchTime, 0) / 60)}min`
                }
              </span> assistidos
            </div>
          </div>

          <Link
            href="/app/continue-watching"
            className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
          >
            Ver histórico completo →
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}