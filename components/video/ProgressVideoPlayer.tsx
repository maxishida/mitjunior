'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useVideoProgress } from '@/hooks/useVideoProgress';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  Loader2
} from 'lucide-react';

interface ProgressVideoPlayerProps {
  videoId: string;
  courseId: string;
  videoURL: string;
  title: string;
  thumbnail?: string;
  totalSeconds?: number;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  onVideoEnd?: () => void;
  onProgressUpdate?: (watchedSeconds: number, currentTime: number) => void;
}

export function ProgressVideoPlayer({
  videoId,
  courseId,
  videoURL,
  title,
  thumbnail,
  totalSeconds = 0,
  autoPlay = false,
  showControls = true,
  className,
  onVideoEnd,
  onProgressUpdate
}: ProgressVideoPlayerProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Progress tracking
  const {
    progress,
    loading: progressLoading,
    error: progressError,
    updateProgress,
    markAsComplete,
    isCompleted,
    watchProgress
  } = useVideoProgress(
    user?.uid,
    videoId,
    courseId,
    totalSeconds,
    {
      autoSave: true,
      saveInterval: 10000, // Save every 10 seconds
      completionThreshold: 0.9 // 90% watched = completed
    }
  );

  // Initialize video with saved position
  useEffect(() => {
    if (videoRef.current && progress && !progressLoading) {
      const video = videoRef.current;

      // Set video to last watched position
      if (progress.lastPosition > 0 && !progress.isCompleted) {
        video.currentTime = progress.lastPosition;
      }

      // Set volume
      video.volume = isMuted ? 0 : volume;

      // Auto play if requested
      if (autoPlay) {
        video.play().catch(console.error);
      }
    }
  }, [progress, progressLoading, autoPlay, isMuted, volume]);

  // Auto-save progress periodically
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(async () => {
        if (videoRef.current && user) {
          const currentTime = videoRef.current.currentTime;
          await updateProgress(
            Math.max(progress?.watchedSeconds || 0, currentTime),
            currentTime
          );
          onProgressUpdate?.(Math.max(progress?.watchedSeconds || 0, currentTime), currentTime);
        }
      }, 10000); // Save every 10 seconds
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, progress?.watchedSeconds, updateProgress, user, onProgressUpdate]);

  // Handle video events
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      // Check if video should be marked as complete
      if (duration > 0 && time >= duration * 0.9 && !isCompleted) {
        markAsComplete();
      }
    }
  }, [duration, isCompleted, markAsComplete]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsBuffering(false);
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    // Save progress when pausing
    if (videoRef.current && user) {
      const currentTime = videoRef.current.currentTime;
      updateProgress(
        Math.max(progress?.watchedSeconds || 0, currentTime),
        currentTime
      );
      onProgressUpdate?.(Math.max(progress?.watchedSeconds || 0, currentTime), currentTime);
    }
  }, [progress?.watchedSeconds, updateProgress, user, onProgressUpdate]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    markAsComplete();
    onVideoEnd?.();
  }, [markAsComplete, onVideoEnd]);

  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
  }, []);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('Video error:', e);
    setIsBuffering(false);
  }, []);

  // Control functions
  const togglePlay = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error('Error playing video:', error);
        }
      }
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
    setShowSettings(false);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Check for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (progressLoading) {
    return (
      <div className={cn('aspect-video bg-gray-900 rounded-lg flex items-center justify-center', className)}>
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (progressError) {
    return (
      <div className={cn('aspect-video bg-gray-900 rounded-lg flex items-center justify-center', className)}>
        <div className="text-center text-white">
          <p className="mb-2">Erro ao carregar progresso do vídeo</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('overflow-hidden bg-black', className)}>
      <div className="relative aspect-video">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onWaiting={handleWaiting}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onClick={togglePlay}
          poster={thumbnail}
        >
          <source src={videoURL} type="video/mp4" />
          Seu navegador não suporta o player de vídeo.
        </video>

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Play/Pause Overlay */}
        {!isPlaying && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
            >
              <Play className="w-8 h-8 text-gray-900 ml-1" />
            </button>
          </div>
        )}

        {/* Controls */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-3">
              <ProgressBar
                progress={duration > 0 ? (currentTime / duration) * 100 : 0}
                color="primary"
                size="sm"
              />
              <div className="flex justify-between text-xs text-white mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                {/* Skip Backward */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipBackward}
                  className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                {/* Skip Forward */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipForward}
                  className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-white bg-opacity-50 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                {/* Playback Speed */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>

                  {showSettings && (
                    <div className="absolute bottom-8 left-0 bg-black bg-opacity-90 rounded-lg p-2 min-w-[120px]">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => changePlaybackSpeed(speed)}
                          className={cn(
                            'block w-full text-left px-2 py-1 text-sm text-white hover:bg-white hover:bg-opacity-20 rounded',
                            playbackSpeed === speed && 'bg-white bg-opacity-20'
                          )}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Video Info */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black bg-opacity-50 rounded-lg p-2 text-white">
            <h3 className="font-medium text-sm truncate">{title}</h3>
            {isCompleted && (
              <p className="text-xs text-green-400">✓ Vídeo concluído</p>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        {progress && !isCompleted && (
          <div className="absolute top-4 right-4">
            <div className="bg-black bg-opacity-50 rounded-full px-2 py-1 text-white text-xs">
              {Math.round(watchProgress)}% assistido
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}