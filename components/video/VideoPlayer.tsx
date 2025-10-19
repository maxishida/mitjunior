'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  Replay,
  PictureInPicture,
  Subtitles,
  Download,
  Share
} from 'lucide-react';
import type { Video, VideoPlayerConfig } from '@/types/course';

interface VideoPlayerProps {
  video: Video;
  config?: Partial<VideoPlayerConfig>;
  onProgress?: (progress: { currentTime: number; duration: number; watched: number }) => void;
  onComplete?: () => void;
  onBookmark?: (timestamp: number) => void;
  className?: string;
}

export default function VideoPlayer({
  video,
  config = {},
  onProgress,
  onComplete,
  onBookmark,
  className = ''
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');

  // UI State
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPiP, setIsPiP] = useState(false);

  // Auto-hide controls timer
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mergedConfig: VideoPlayerConfig = {
    autoplay: false,
    muted: false,
    startTime: 0,
    quality: 'auto',
    playbackRate: 1,
    subtitles: true,
    pictureInPicture: true,
    ...config
  };

  // Format time utility
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (isPlaying && !showSettings && !showVolume) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, showSettings, showVolume]);

  // Event handlers
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreenToggle = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handlePictureInPicture = async () => {
    if (videoRef.current) {
      try {
        if (isPiP) {
          await document.exitPictureInPicture();
          setIsPiP(false);
        } else {
          await videoRef.current.requestPictureInPicture();
          setIsPiP(true);
        }
      } catch (error) {
        console.error('PiP not supported:', error);
      }
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case ' ':
        e.preventDefault();
        handlePlayPause();
        break;
      case 'ArrowRight':
        if (videoRef.current) {
          videoRef.current.currentTime += 10;
        }
        break;
      case 'ArrowLeft':
        if (videoRef.current) {
          videoRef.current.currentTime -= 10;
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleVolumeChange(Math.min(1, volume + 0.1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleVolumeChange(Math.max(0, volume - 0.1));
        break;
      case 'f':
        handleFullscreenToggle();
        break;
      case 'm':
        handleMuteToggle();
        break;
    }
  }, [isPlaying, volume]);

  // Progress bar dragging
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * duration;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [isDragging, duration]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Video event handlers
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);

      // Report progress
      if (onProgress) {
        onProgress({
          currentTime: videoRef.current.currentTime,
          duration: videoRef.current.duration || 0,
          watched: videoRef.current.currentTime
        });
      }
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);

      // Seek to start time if specified
      if (mergedConfig.startTime) {
        videoRef.current.currentTime = mergedConfig.startTime;
        setCurrentTime(mergedConfig.startTime);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleVideoWaiting = () => {
    setIsBuffering(true);
  };

  const handleVideoCanPlay = () => {
    setIsBuffering(false);
  };

  // Effects
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      video.muted = isMuted;
      video.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimer]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleKeyDown, handleMouseMove, handleMouseUp]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`
        relative bg-black rounded-lg overflow-hidden group
        ${className}
      `}
      onMouseMove={() => {
        setShowControls(true);
        resetControlsTimer();
      }}
      onMouseLeave={() => {
        if (!showSettings && !showVolume) {
          setShowControls(false);
        }
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        onTimeUpdate={handleVideoTimeUpdate}
        onLoadedMetadata={handleVideoLoadedMetadata}
        onEnded={handleVideoEnded}
        onWaiting={handleVideoWaiting}
        onCanPlay={handleVideoCanPlay}
        onClick={handlePlayPause}
        poster={video.thumbnail}
      >
        <source src={video.videoUrl} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>

      {/* Overlay Controls */}
      <div className={`
        absolute inset-0 flex flex-col justify-between p-4
        transition-opacity duration-300
        ${showControls ? 'opacity-100' : 'opacity-0'}
      `}>
        {/* Top Controls */}
        <div className="flex justify-between items-start">
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded">
            <p className="text-white text-sm font-medium">{video.title}</p>
            <p className="text-neutral-300 text-xs">Aula {video.lessonNumber}</p>
          </div>
        </div>

        {/* Center Play Button */}
        {!isPlaying && (
          <div className="flex items-center justify-center">
            <button
              onClick={handlePlay}
              className="p-6 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
            >
              <Play className="w-12 h-12 text-white fill-current ml-2" />
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="relative h-1 bg-white/20 rounded-full cursor-pointer group/progress"
            onClick={handleSeek}
            onMouseDown={handleMouseDown}
          >
            <div
              className="absolute h-full bg-brand-500 rounded-full transition-all duration-100"
              style={{ width: `${progressPercentage}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${progressPercentage}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
              </button>

              {/* Skip Back */}
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime -= 10;
                  }
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime += 10;
                  }
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Volume */}
              <div className="relative">
                <button
                  onClick={() => setShowVolume(!showVolume)}
                  onMouseEnter={() => setShowVolume(true)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                {/* Volume Slider */}
                <div className={`
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-black/80 backdrop-blur-sm rounded-lg
                  transition-opacity duration-200
                  ${showVolume ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}>
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs text-white font-medium">
                      {Math.round(volume * 100)}%
                    </span>
                    <div className="w-20 h-1 bg-white/20 rounded-full">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 opacity-0 absolute"
                    />
                  </div>
                </div>
              </div>

              {/* Time Display */}
              <div className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              {/* Playback Rate */}
              <button className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors">
                {playbackRate}x
              </button>

              {/* Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Settings Menu */}
                <div className={`
                  absolute bottom-full right-0 mb-2 w-48 bg-black/90 backdrop-blur-sm rounded-lg p-2 space-y-1
                  transition-opacity duration-200
                  ${showSettings ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}>
                  {/* Quality Options */}
                  <div className="p-2 space-y-1">
                    <p className="text-xs text-neutral-400 font-medium">Qualidade</p>
                    {['auto', '1080p', '720p', '480p', '360p'].map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`
                          w-full text-left px-2 py-1 text-sm rounded transition-colors
                          ${quality === q ? 'bg-brand-500 text-white' : 'hover:bg-white/10 text-white'}
                        `}
                      >
                        {q === 'auto' ? 'Automática' : q}
                      </button>
                    ))}
                  </div>

                  {/* Playback Rate Options */}
                  <div className="p-2 space-y-1 border-t border-white/10">
                    <p className="text-xs text-neutral-400 font-medium">Velocidade</p>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={`
                          w-full text-left px-2 py-1 text-sm rounded transition-colors
                          ${playbackRate === rate ? 'bg-brand-500 text-white' : 'hover:bg-white/10 text-white'}
                        `}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Picture in Picture */}
              {mergedConfig.pictureInPicture && document.pictureInPictureEnabled && (
                <button
                  onClick={handlePictureInPicture}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <PictureInPicture className="w-5 h-5" />
                </button>
              )}

              {/* Fullscreen */}
              <button
                onClick={handleFullscreenToggle}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-3 border-white/30 border-t-brand-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Replay Overlay when video ends */}
      {!isPlaying && currentTime > 0 && currentTime >= duration - 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="text-center space-y-4">
            <button
              onClick={handlePlay}
              className="p-6 bg-brand-500 rounded-full hover:bg-brand-600 transition-all hover:scale-110"
            >
              <Replay className="w-12 h-12 text-white" />
            </button>
            <p className="text-white font-medium">Reproduzir novamente</p>
          </div>
        </div>
      )}
    </div>
  );
}