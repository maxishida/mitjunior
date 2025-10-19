'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        bg-gradient-to-r from-[#242931] via-[#2D333B] to-[#242931]
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={style}
    />
  );
}

// Table Row Skeleton
interface TableRowSkeletonProps {
  rows?: number;
  columns?: number;
  showAvatar?: boolean;
  showActions?: boolean;
}

export function TableRowSkeleton({
  rows = 5,
  columns = 4,
  showAvatar = false,
  showActions = true
}: TableRowSkeletonProps) {
  return (
    <>
      {[...Array(rows)].map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-fade-in" style={{ animationDelay: `${rowIndex * 50}ms` }}>
          {[...Array(columns)].map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <div className="flex items-center gap-3">
                {showAvatar && colIndex === 0 && (
                  <Skeleton variant="circular" width={40} height={40} />
                )}
                <div className="flex-1 space-y-2">
                  <Skeleton
                    height={16}
                    width={colIndex === 0 ? '60%' : '80%'}
                    className="max-w-xs"
                  />
                  {colIndex === 0 && <Skeleton height={12} width="40%" />}
                </div>
              </div>
            </td>
          ))}
          {showActions && (
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <Skeleton variant="rectangular" width={32} height={32} className="rounded-lg" />
                <Skeleton variant="rectangular" width={32} height={32} className="rounded-lg" />
                <Skeleton variant="rectangular" width={32} height={32} className="rounded-lg" />
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}

// Card Skeleton
interface CardSkeletonProps {
  showHeader?: boolean;
  showImage?: boolean;
  lines?: number;
  showActions?: boolean;
}

export function CardSkeleton({
  showHeader = true,
  showImage = true,
  lines = 3,
  showActions = true
}: CardSkeletonProps) {
  return (
    <div className="bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6 animate-fade-in">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <Skeleton height={24} width="40%" />
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width={32} height={32} className="rounded-lg" />
            <Skeleton variant="rectangular" width={32} height={32} className="rounded-lg" />
          </div>
        </div>
      )}

      {showImage && (
        <div className="mb-4">
          <Skeleton height={200} className="rounded-xl" />
        </div>
      )}

      <div className="space-y-3">
        {[...Array(lines)].map((_, i) => (
          <Skeleton
            key={i}
            height={16}
            width={i === 0 ? '90%' : i === lines - 1 ? '70%' : '100%'}
          />
        ))}
      </div>

      {showActions && (
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#2D333B]">
          <Skeleton height={40} width={100} className="rounded-lg" />
          <Skeleton height={40} width={120} className="rounded-lg" />
        </div>
      )}
    </div>
  );
}

// Metric Card Skeleton
export function MetricCardSkeleton() {
  return (
    <div className="bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton height={16} width={120} className="mb-2" />
          <Skeleton height={32} width={80} className="mb-3" />
          <div className="flex items-center gap-2">
            <Skeleton height={12} width={60} />
            <Skeleton height={12} width={40} />
          </div>
        </div>
        <Skeleton variant="rectangular" width={48} height={48} className="rounded-xl" />
      </div>
    </div>
  );
}

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <CardSkeleton
            showHeader={true}
            lines={4}
            showActions={false}
          />
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#00C896] to-[#00A67C] rounded-2xl p-6 text-white">
            <Skeleton height={20} width={120} className="mb-4 bg-white/20" />
            <Skeleton height={32} width={80} className="mb-3 bg-white/20" />
            <Skeleton height={8} width="100%" className="bg-white/20" />
          </div>

          <CardSkeleton
            showHeader={true}
            lines={2}
            showActions={false}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <Skeleton variant="rectangular" width={48} height={48} className="rounded-xl" />
              <div className="flex-1">
                <Skeleton height={16} width={120} className="mb-1" />
                <Skeleton height={12} width={80} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Form Skeleton
interface FormSkeletonProps {
  fields?: number;
  showImage?: boolean;
}

export function FormSkeleton({ fields = 3, showImage = false }: FormSkeletonProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {[...Array(fields)].map((_, i) => (
        <div key={i}>
          <Skeleton height={16} width={120} className="mb-2" />
          <Skeleton height={44} className="rounded-lg" />
        </div>
      ))}

      {showImage && (
        <div>
          <Skeleton height={16} width={120} className="mb-2" />
          <div className="border-2 border-dashed border-[#2D333B] rounded-xl p-8 text-center">
            <Skeleton variant="rectangular" width={48} height={48} className="mx-auto mb-4 rounded-xl" />
            <Skeleton height={20} width={200} className="mx-auto mb-2" />
            <Skeleton height={16} width={150} className="mx-auto" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2D333B]">
        <Skeleton height={44} width={100} className="rounded-lg" />
        <Skeleton height={44} width={140} className="rounded-lg" />
      </div>
    </div>
  );
}

// Loading Spinner with backdrop
interface LoadingOverlayProps {
  message?: string;
  show?: boolean;
}

export function LoadingOverlay({ message = 'Carregando...', show = true }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#0F1419]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-[#242931] border-t-[#00C896] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-[#00C896]/30 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-[#F8FAFC] font-medium">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page Loading State
export function PageLoading() {
  return (
    <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00C896] to-[#00A67C] rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#0F1419] border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#F8FAFC] mb-2">ComunidadeFlix</h1>
          <p className="text-[#64748B]">Carregando painel administrativo...</p>
        </div>
      </div>
    </div>
  );
}