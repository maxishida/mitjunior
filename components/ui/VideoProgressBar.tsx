'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Maximize, Settings, SkipForward, SkipBack } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoProgressBarProps {
  progress: number; // 0-100
  duration: number; // in seconds
  currentTime: number; // in seconds
  buffered: number; // 0-100
  isPlaying: boolean;
  isMuted: boolean;
  volume: number; // 0-100
  isFullscreen: boolean;
  showControls: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  onUnmute: () => void;
  onFullscreen: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  className?: string;
}

export function VideoProgressBar({
  progress,
  duration,
  currentTime,
  buffered,
  isPlaying,
  isMuted,
  volume,
  isFullscreen,
  showControls,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onMute,
  onUnmute,
  onFullscreen,
  onSkipForward,
  onSkipBackward,
  className
}: VideoProgressBarProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click/drag
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercentage = clickX / rect.width;
    const seekTime = clickPercentage * duration;

    onSeek(seekTime);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mousePercentage = mouseX / rect.width;
    const previewSeconds = mousePercentage * duration;

    setPreviewTime(previewSeconds);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressClick(e);
    }
    handleProgressMouseMove(e);
  };

  // Global mouse events for dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mousePercentage = Math.max(0, Math.min(1, mouseX / rect.width));
        const seekTime = mousePercentage * duration;
        onSeek(seekTime);
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, duration, onSeek]);

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange(newVolume);

    if (newVolume === 0) {
      onMute();
    } else {
      onUnmute();
    }
  };

  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent',
        'transition-opacity duration-300',
        showControls ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {/* Progress Bar */}
      <div className="relative h-1 bg-gray-600 cursor-pointer group">
        <div
          ref={progressBarRef}
          className="absolute inset-0 cursor-pointer"
          onClick={handleProgressClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Buffered Progress */}
          <div
            className="absolute h-full bg-gray-500 transition-all duration-300"
            style={{ width: `${buffered}%` }}
          />

          {/* Played Progress */}
          <div
            className="absolute h-full bg-red-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />

          {/* Progress Handle */}
          <div
            className={cn(
              'absolute top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              isHovering || isDragging ? 'opacity-100' : 'opacity-0'
            )}
            style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
          />

          {/* Preview Tooltip */}
          {isHovering && !isDragging && (
            <div
              className="absolute bottom-full mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap pointer-events-none"
              style={{
                left: `${(previewTime / duration) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {formatTime(previewTime)}
            </div>
          )}
        </div>

        {/* Chapter Markers */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-1/4 h-full border-r-2 border-white/20" />
          <div className="w-1/4 h-full border-r-2 border-white/20" />
          <div className="w-1/4 h-full border-r-2 border-white/20" />
          <div className="w-1/4 h-full" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left Controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-red-500 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          {/* Skip Backward */}
          <button
            onClick={onSkipBackward}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-red-500 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Skip Forward */}
          <button
            onClick={onSkipForward}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-red-500 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Volume */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={isMuted ? onUnmute : onMute}
              className="w-8 h-8 flex items-center justify-center text-white hover:text-red-500 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* Volume Slider */}
            <div
              className={cn(
                'absolute left-10 bottom-0 flex items-center gap-2 bg-black/80 rounded px-2 py-1',
                'transition-all duration-200',
                showVolumeSlider ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
              )}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`
                }}
              />
              <span className="text-white text-xs w-8 text-center">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-1 text-white text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Settings */}
          <button className="w-8 h-8 flex items-center justify-center text-white hover:text-red-500 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={onFullscreen}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-red-500 transition-colors"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}