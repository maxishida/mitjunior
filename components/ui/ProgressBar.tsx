'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
  thickness?: 'thin' | 'normal' | 'thick';
}

export function ProgressBar({
  progress,
  className,
  size = 'md',
  color = 'primary',
  showLabel = false,
  animated = true,
  thickness = 'normal'
}: ProgressBarProps) {
  const clampProgress = Math.min(100, Math.max(0, progress));

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const thicknessClasses = {
    thin: 'h-1',
    normal: 'h-2',
    thick: 'h-3'
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'w-full bg-gray-200 rounded-full overflow-hidden',
          thicknessClasses[thickness]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            colorClasses[color],
            animated && 'animate-pulse'
          )}
          style={{
            width: `${clampProgress}%`,
            transition: 'width 0.5s ease-out'
          }}
        />
      </div>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-900 bg-white bg-opacity-75 px-1 rounded">
            {Math.round(clampProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
}

export function CircularProgress({
  progress,
  size = 100,
  strokeWidth = 8,
  className,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showLabel = true
}: CircularProgressProps) {
  const clampProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clampProgress / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-900">
            {Math.round(clampProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}