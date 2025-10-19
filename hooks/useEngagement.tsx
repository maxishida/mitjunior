'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useVideoProgress } from './useVideoProgress';
import { useContinueWatching } from './useContinueWatching';
import { useCourseProgress } from './useCourseProgress';
import { useFavorites } from './useFavorites';
import { useViewHistory } from './useViewHistory';
import { useRecommendations } from './useRecommendations';
import { EngagementContextType } from '@/types';

interface EngagementProviderProps {
  children: ReactNode;
  userId: string | undefined;
}

const EngagementContext = createContext<EngagementContextType | null>(null);

export function EngagementProvider({ children, userId }: EngagementProviderProps) {
  // Initialize all engagement hooks
  const {
    favorites,
    loading: favoritesLoading,
    error: favoritesError,
    addToFavorites,
    removeFromFavorites,
    isFavorite: isFavoriteHook,
    getFavoritesByType,
    getFavoritesByCategory,
    clearFavorites,
    getFavoritesCount,
    searchFavorites
  } = useFavorites(userId);

  const {
    viewHistory,
    loading: viewHistoryLoading,
    error: viewHistoryError,
    hasMore,
    addToViewHistory,
    updateViewHistoryItem,
    clearViewHistory: clearViewHistoryHook,
    getViewStats,
    getRecentlyViewed,
    getMostWatched,
    searchViewHistory,
    loadMore
  } = useViewHistory(userId);

  const {
    recommendations,
    loading: recommendationsLoading,
    error: recommendationsError,
    lastRefresh,
    interactions,
    markInteraction,
    refreshRecommendations,
    getRecommendationsByCategory,
    getRecommendationsByReason
  } = useRecommendations(userId);

  // Enhanced addToViewHistory with auto-favorites detection
  const handleAddToViewHistory = async (
    type: 'course' | 'video',
    itemId: string,
    metadata: any
  ) => {
    await addToViewHistory(type, itemId, metadata);

    // Auto-add to favorites if user watches more than 50% of content
    if (metadata.watchDuration && metadata.duration &&
        metadata.watchDuration / metadata.duration > 0.5) {
      await addToFavorites(type, itemId, metadata);
    }
  };

  // Enhanced isFavorite that checks local state first
  const isFavorite = (itemId: string) => {
    return isFavoriteHook(itemId);
  };

  // Enhanced clearViewHistory with confirmation
  const clearViewHistory = async (type?: 'all' | 'course' | 'video') => {
    const confirmed = window.confirm(
      'Tem certeza que deseja limpar seu histórico? Esta ação não pode ser desfeita.'
    );
    if (confirmed) {
      await clearViewHistoryHook(type);
    }
  };

  // Enhanced getViewStats with additional metrics
  const getEnhancedViewStats = () => {
    const baseStats = getViewStats();

    // Add additional engagement metrics
    const favoriteItemsCount = favorites.length;
    const recommendationsCount = recommendations.length;
    const engagementScore = calculateEngagementScore(baseStats, favoriteItemsCount, recommendationsCount);

    return {
      ...baseStats,
      favoriteItemsCount,
      recommendationsCount,
      engagementScore,
      lastActivity: interactions.length > 0 ?
        new Date(Math.max(...interactions.map(i => i.timestamp.getTime()))) :
        new Date()
    };
  };

  // Calculate engagement score (0-100)
  const calculateEngagementScore = (
    viewStats: any,
    favoriteCount: number,
    recommendationCount: number
  ) => {
    const { totalViews, totalWatchTime, completedVideos } = viewStats;

    // Weight different factors
    const viewScore = Math.min(totalViews * 2, 30); // Max 30 points
    const timeScore = Math.min(totalWatchTime / 60, 30); // Max 30 points (1 point per minute)
    const completionScore = Math.min(completedVideos * 5, 25); // Max 25 points
    const favoriteScore = Math.min(favoriteCount * 3, 10); // Max 10 points
    const recommendationScore = Math.min(recommendationCount, 5); // Max 5 points

    return Math.round(viewScore + timeScore + completionScore + favoriteScore + recommendationScore);
  };

  // Combine loading states
  const loading = {
    favorites: favoritesLoading,
    viewHistory: viewHistoryLoading,
    recommendations: recommendationsLoading
  };

  // Combine errors
  const error = favoritesError || viewHistoryError || recommendationsError;

  // Provide context value
  const contextValue: EngagementContextType = {
    favorites,
    viewHistory,
    recommendations,
    loading,
    error: error?.message || null,

    // Favorites actions
    addToFavorites,
    removeFromFavorites,
    isFavorite,

    // View history actions
    addToViewHistory: handleAddToViewHistory,
    clearViewHistory,
    getViewStats: getEnhancedViewStats,

    // Recommendations actions
    refreshRecommendations,
    getRecommendationsByCategory,
    markInteraction
  };

  return (
    <EngagementContext.Provider value={contextValue}>
      {children}
    </EngagementContext.Provider>
  );
}

// Hook to use engagement context
export function useEngagement() {
  const context = useContext(EngagementContext);
  if (!context) {
    throw new Error('useEngagement must be used within an EngagementProvider');
  }
  return context;
}

// Individual hooks for specific use cases
export function useVideoEngagement(
  videoId: string,
  courseId: string,
  totalSeconds: number = 0
) {
  const userId = process.env.NEXT_PUBLIC_USER_ID; // This should come from auth context

  const videoProgress = useVideoProgress(userId, videoId, courseId, totalSeconds);
  const { addToViewHistory, isFavorite, addToFavorites } = useEngagement();

  const handleVideoStart = async (metadata: any) => {
    await addToViewHistory('video', videoId, {
      ...metadata,
      courseId,
      videoId
    });
  };

  const handleVideoComplete = async () => {
    await videoProgress.markAsComplete();

    // Add to favorites on completion
    if (!isFavorite(videoId)) {
      await addToFavorites('video', videoId, {
        videoId,
        courseId,
        title: metadata.title,
        thumbnail: metadata.thumbnail,
        duration: totalSeconds
      });
    }
  };

  return {
    ...videoProgress,
    handleVideoStart,
    handleVideoComplete
  };
}

export function useCourseEngagement(courseId: string) {
  const { courseProgress, loading } = useCourseProgress(userId, courseId);
  const { addToViewHistory, isFavorite, addToFavorites } = useEngagement();

  const handleCourseStart = async (metadata: any) => {
    await addToViewHistory('course', courseId, {
      ...metadata,
      courseId
    });
  };

  const handleCourseComplete = async () => {
    // Add to favorites on completion
    if (!isFavorite(courseId)) {
      await addToFavorites('course', courseId, {
        courseId,
        title: courseProgress?.title,
        thumbnail: courseProgress?.coverImage,
        duration: courseProgress?.totalDuration
      });
    }
  };

  return {
    courseProgress,
    loading,
    handleCourseStart,
    handleCourseComplete
  };
}

export { EngagementContext };