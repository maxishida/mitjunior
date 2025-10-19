'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  return (
    <div
      className={cn(
        'bg-gray-200',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: width || '100%',
        height: height || variant === 'text' ? '1em' : '40px'
      }}
    />
  );
}

// Card Skeleton for content cards
export function CardSkeleton({
  className,
  showImage = true,
  showTitle = true,
  showDescription = true,
  showMetadata = true,
  lines = 3
}: {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showMetadata?: boolean;
  lines?: number;
}) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-4', className)}>
      {showImage && (
        <Skeleton
          variant="rounded"
          height={200}
          className="mb-4"
        />
      )}

      <div className="space-y-3">
        {showTitle && (
          <Skeleton
            variant="text"
            height={24}
            width="70%"
          />
        )}

        {showDescription && (
          <div className="space-y-2">
            {[...Array(lines)].map((_, i) => (
              <Skeleton
                key={i}
                variant="text"
                height={16}
                width={i === lines - 1 ? '80%' : '100%'}
              />
            ))}
          </div>
        )}

        {showMetadata && (
          <div className="flex items-center gap-4">
            <Skeleton variant="text" width={80} height={14} />
            <Skeleton variant="text" width={60} height={14} />
            <Skeleton variant="text" width={40} height={14} />
          </div>
        )}
      </div>
    </div>
  );
}

// Video Card Skeleton
export function VideoCardSkeleton({
  className,
  showProgress = false
}: {
  className?: string;
  showProgress?: boolean;
}) {
  return (
    <div className={cn('bg-white rounded-lg overflow-hidden shadow-sm', className)}>
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-video bg-gray-200">
        <Skeleton variant="rectangular" className="w-full h-full" />
        <div className="absolute bottom-2 right-2">
          <Skeleton variant="text" width={60} height={20} className="bg-black/20" />
        </div>
        {showProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <Skeleton variant="rectangular" height={4} className="bg-blue-500/20" />
          </div>
        )}
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-2">
        <Skeleton variant="text" height={20} width="90%" />
        <Skeleton variant="text" height={16} width="70%" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" height={14} width={100} />
        </div>
      </div>
    </div>
  );
}

// List Item Skeleton
export function ListItemSkeleton({
  className,
  showImage = true,
  showActions = true
}: {
  className?: string;
  showImage?: boolean;
  showActions?: boolean;
}) {
  return (
    <div className={cn('bg-white rounded-lg p-4 flex items-center gap-4', className)}>
      {showImage && (
        <Skeleton
          variant="rounded"
          width={80}
          height={60}
        />
      )}

      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={20} width="70%" />
        <Skeleton variant="text" height={16} width="50%" />
        <div className="flex items-center gap-4">
          <Skeleton variant="text" height={14} width={80} />
          <Skeleton variant="text" height={14} width={60} />
        </div>
      </div>

      {showActions && (
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      )}
    </div>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton({
  className
}: {
  className?: string;
}) {
  return (
    <div className={cn('bg-white rounded-lg p-6', className)}>
      <div className="flex items-center gap-4">
        <Skeleton
          variant="circular"
          width={48}
          height={48}
        />
        <div className="space-y-2">
          <Skeleton variant="text" height={32} width={80} />
          <Skeleton variant="text" height={16} width={120} />
        </div>
      </div>
    </div>
  );
}

// Grid Skeleton for content grids
export function GridSkeleton({
  className,
  cols = 3,
  rows = 2,
  type = 'card'
}: {
  className?: string;
  cols?: number;
  rows?: number;
  type?: 'card' | 'video' | 'list';
}) {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  };

  return (
    <div className={cn('grid gap-4', gridColsClass[cols as keyof typeof gridColsClass], className)}>
      {[...Array(rows * cols)].map((_, i) => {
        switch (type) {
          case 'video':
            return <VideoCardSkeleton key={i} showProgress />;
          case 'list':
            return <ListItemSkeleton key={i} />;
          default:
            return <CardSkeleton key={i} />;
        }
      })}
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({
  className,
  rows = 5,
  columns = 4,
  showHeader = true
}: {
  className?: string;
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}) {
  return (
    <div className={cn('bg-white rounded-lg overflow-hidden', className)}>
      {showHeader && (
        <div className="border-b border-gray-200 p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, i) => (
              <Skeleton key={i} variant="text" height={20} width="80%" />
            ))}
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  variant="text"
                  height={16}
                  width={colIndex === 0 ? '90%' : '70%'}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sidebar Skeleton
export function SidebarSkeleton({
  className,
  showSections = 3
}: {
  className?: string;
  showSections?: number;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {[...Array(showSections)].map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          <Skeleton variant="text" height={20} width={120} />
          <div className="space-y-2">
            {[...Array(3 + sectionIndex)].map((_, itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-3 p-2">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-1">
                  <Skeleton variant="text" height={14} width="80%" />
                  <Skeleton variant="text" height={12} width="60%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading State Components
export function LoadingState({
  message = 'Carregando...',
  showSpinner = true,
  size = 'md',
  className
}: {
  message?: string;
  showSpinner?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('flex items-center justify-center space-x-2 text-gray-500', className)}>
      {showSpinner && (
        <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', sizeClasses[size])} />
      )}
      <span className={size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}>
        {message}
      </span>
    </div>
  );
}

// Empty State Component
export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && (
        <div className="mb-4 flex justify-center">
          <div className="text-gray-400">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 mb-4">
          {description}
        </p>
      )}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}

// Error State Component
export function ErrorState({
  title = 'Ocorreu um erro',
  description,
  onRetry,
  className
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="mb-4 flex justify-center">
        <div className="text-red-500">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 mb-4">
          {description}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}