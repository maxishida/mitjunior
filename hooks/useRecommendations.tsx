'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getDoc,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { RecommendationItem, ViewHistoryItem, FavoriteItem } from '@/types';

interface UseRecommendationsOptions {
  limit?: number;
  refreshInterval?: number; // in minutes
  includeInteracted?: boolean;
  algorithm?: 'collaborative' | 'content' | 'hybrid';
}

interface UserInteraction {
  itemId: string;
  interaction: 'click' | 'dismiss' | 'not_interested' | 'completed';
  timestamp: Date;
}

export function useRecommendations(
  userId: string | undefined,
  options: UseRecommendationsOptions = {}
) {
  const {
    limit: limitCount = 20,
    refreshInterval = 60, // 60 minutes
    includeInteracted = false,
    algorithm = 'hybrid'
  } = options;

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);

  // Load recommendations
  const loadRecommendations = useCallback(async () => {
    if (!userId) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get user's view history and favorites for personalization
      const viewHistoryQuery = query(
        collection(db, 'viewHistory'),
        where('userId', '==', userId),
        orderBy('viewedAt', 'desc'),
        limit(50)
      );

      const viewHistorySnapshot = await getDocs(viewHistoryQuery);
      const viewHistory: ViewHistoryItem[] = viewHistorySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          itemId: data.itemId,
          courseId: data.courseId,
          videoId: data.videoId,
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          instructor: data.instructor,
          duration: data.duration,
          category: data.category,
          viewedAt: data.viewedAt?.toDate() || new Date(),
          watchDuration: data.watchDuration || 0,
          completed: data.completed || false
        };
      });

      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        orderBy('addedAt', 'desc'),
        limit(20)
      );

      const favoritesSnapshot = await getDocs(favoritesQuery);
      const favorites: FavoriteItem[] = favoritesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          itemId: data.itemId,
          courseId: data.courseId,
          videoId: data.videoId,
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          instructor: data.instructor,
          duration: data.duration,
          category: data.category,
          addedAt: data.addedAt?.toDate() || new Date()
        };
      });

      // Get user interactions
      const interactionsDoc = await getDoc(doc(db, 'userInteractions', userId));
      const userInteractions = interactionsDoc.exists() ?
        (interactionsDoc.data().interactions || []).map((int: any) => ({
          ...int,
          timestamp: int.timestamp?.toDate() || new Date()
        })) : [];

      setInteractions(userInteractions);

      // Generate recommendations based on algorithm
      const recs = await generateRecommendations(
        viewHistory,
        favorites,
        userInteractions,
        algorithm,
        limitCount
      );

      setRecommendations(recs);
      setLastRefresh(new Date());
      setLoading(false);
      setError(null);

    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [userId, algorithm, limitCount]);

  useEffect(() => {
    loadRecommendations();

    // Set up refresh interval
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        loadRecommendations();
      }, refreshInterval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [loadRecommendations, refreshInterval]);

  // Generate recommendations algorithm
  const generateRecommendations = async (
    viewHistory: ViewHistoryItem[],
    favorites: FavoriteItem[],
    interactions: UserInteraction[],
    algo: 'collaborative' | 'content' | 'hybrid',
    limit: number
  ): Promise<RecommendationItem[]> => {
    const recommendations: RecommendationItem[] = [];
    const seenItemIds = new Set([
      ...viewHistory.map(h => h.itemId),
      ...favorites.map(f => f.itemId),
      ...interactions.map(i => i.itemId)
    ]);

    // Get trending content
    const trendingRecs = await getTrendingRecommendations(seenItemIds, Math.floor(limit * 0.3));
    recommendations.push(...trendingRecs);

    // Get content-based recommendations
    const contentRecs = await getContentBasedRecommendations(
      viewHistory,
      favorites,
      seenItemIds,
      Math.floor(limit * 0.4)
    );
    recommendations.push(...contentRecs);

    // Get collaborative filtering recommendations
    const collabRecs = await getCollaborativeRecommendations(
      viewHistory,
      favorites,
      seenItemIds,
      Math.floor(limit * 0.3)
    );
    recommendations.push(...collabRecs);

    // Sort by score and limit
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };

  // Get trending recommendations
  const getTrendingRecommendations = async (
    excludeItemIds: Set<string>,
    limit: number
  ): Promise<RecommendationItem[]> => {
    const recommendations: RecommendationItem[] = [];

    try {
      // Get trending videos (most viewed in the last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const trendingQuery = query(
        collection(db, 'viewHistory'),
        where('viewedAt', '>=', sevenDaysAgo),
        orderBy('viewedAt', 'desc'),
        limit(limit * 3) // Get more to filter out excluded items
      );

      const trendingSnapshot = await getDocs(trendingQuery);
      const itemCounts = new Map<string, { count: number; item: any }>();

      // Count views per item
      for (const doc of trendingSnapshot.docs) {
        const data = doc.data();
        const itemId = data.itemId;

        if (excludeItemIds.has(itemId)) continue;

        if (itemCounts.has(itemId)) {
          const existing = itemCounts.get(itemId)!;
          existing.count++;
        } else {
          itemCounts.set(itemId, { count: 1, item: data });
        }
      }

      // Sort by view count and create recommendations
      const sortedItems = Array.from(itemCounts.entries())
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, limit);

      for (const [itemId, { count, item }] of sortedItems) {
        const score = Math.min(count / 10, 1); // Normalize score to 0-1
        recommendations.push({
          id: `trending_${itemId}`,
          type: item.type,
          itemId,
          courseId: item.courseId,
          videoId: item.videoId,
          title: item.title,
          description: item.description,
          thumbnail: item.thumbnail,
          instructor: item.instructor,
          duration: item.duration,
          category: item.category,
          score,
          reason: 'trending',
          metadata: {
            viewsCount: count,
            completionRate: 0.75 // Default trending completion rate
          }
        });
      }

    } catch (err) {
      console.error('Error getting trending recommendations:', err);
    }

    return recommendations;
  };

  // Get content-based recommendations
  const getContentBasedRecommendations = async (
    viewHistory: ViewHistoryItem[],
    favorites: FavoriteItem[],
    excludeItemIds: Set<string>,
    limit: number
  ): Promise<RecommendationItem[]> => {
    const recommendations: RecommendationItemItem[] = [];

    try {
      // Analyze user preferences from history and favorites
      const userCategories = new Map<string, number>();
      const userInstructors = new Map<string, number>();

      const allItems = [...viewHistory, ...favorites];

      for (const item of allItems) {
        if (item.category) {
          userCategories.set(item.category, (userCategories.get(item.category) || 0) + 1);
        }
        if (item.instructor) {
          userInstructors.set(item.instructor, (userInstructors.get(item.instructor) || 0) + 1);
        }
      }

      // Get similar content based on categories and instructors
      const topCategories = Array.from(userCategories.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category);

      const topInstructors = Array.from(userInstructors.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([instructor]) => instructor);

      // Query for similar content
      for (const category of topCategories) {
        const categoryQuery = query(
          collection(db, 'courses'),
          where('category', '==', category),
          limit(5)
        );

        const categorySnapshot = await getDocs(categoryQuery);

        for (const doc of categorySnapshot.docs) {
          const courseData = doc.data();
          const itemId = doc.id;

          if (excludeItemIds.has(itemId)) continue;

          const categoryScore = userCategories.get(category) || 0;
          const score = Math.min(categoryScore / 5, 1); // Normalize score

          recommendations.push({
            id: `content_${itemId}`,
            type: 'course',
            itemId,
            courseId: itemId,
            title: courseData.title,
            description: courseData.description,
            thumbnail: courseData.coverURL,
            instructor: courseData.instructor,
            duration: courseData.duration,
            category,
            score,
            reason: 'similar',
            metadata: {
              similarItems: [],
              rating: courseData.rating || 0
            }
          });
        }
      }

      // Query for videos by preferred instructors
      for (const instructor of topInstructors) {
        const instructorQuery = query(
          collection(db, 'videos'),
          where('instructor', '==', instructor),
          limit(3)
        );

        const instructorSnapshot = await getDocs(instructorQuery);

        for (const doc of instructorSnapshot.docs) {
          const videoData = doc.data();
          const itemId = doc.id;

          if (excludeItemIds.has(itemId)) continue;

          const instructorScore = userInstructors.get(instructor) || 0;
          const score = Math.min(instructorScore / 3, 1);

          recommendations.push({
            id: `content_${itemId}`,
            type: 'video',
            itemId,
            videoId: itemId,
            courseId: videoData.courseId,
            title: videoData.title,
            description: videoData.description,
            thumbnail: videoData.thumbnailURL,
            instructor,
            duration: videoData.duration,
            category: videoData.category,
            score,
            reason: 'similar',
            metadata: {
              similarItems: [],
              rating: videoData.rating || 0
            }
          });
        }
      }

    } catch (err) {
      console.error('Error getting content-based recommendations:', err);
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };

  // Get collaborative filtering recommendations
  const getCollaborativeRecommendations = async (
    viewHistory: ViewHistoryItem[],
    favorites: FavoriteItem[],
    excludeItemIds: Set<string>,
    limit: number
  ): Promise<RecommendationItem[]> => {
    const recommendations: RecommendationItem[] = [];

    try {
      // Find users with similar viewing patterns
      const userItems = new Set([
        ...viewHistory.map(h => h.itemId),
        ...favorites.map(f => f.itemId)
      ]);

      // This is a simplified collaborative filtering
      // In a real implementation, you'd use more sophisticated algorithms
      const similarUsersQuery = query(
        collection(db, 'viewHistory'),
        where('itemId', 'in', Array.from(userItems).slice(0, 10)),
        limit(100)
      );

      const similarUsersSnapshot = await getDocs(similarUsersQuery);
      const similarUsersItems = new Map<string, number>();

      for (const doc of similarUsersSnapshot.docs) {
        const data = doc.data();
        if (data.userId === userId) continue;

        const itemId = data.itemId;
        if (excludeItemIds.has(itemId)) continue;

        similarUsersItems.set(itemId, (similarUsersItems.get(itemId) || 0) + 1);
      }

      // Convert to recommendations
      const sortedItems = Array.from(similarUsersItems.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit);

      for (const [itemId, count] of sortedItems) {
        // Get item details
        const itemDoc = await getDoc(doc(db, 'content', itemId));
        if (!itemDoc.exists()) continue;

        const itemData = itemDoc.data();
        const score = Math.min(count / 5, 1);

        recommendations.push({
          id: `collab_${itemId}`,
          type: itemData.type,
          itemId,
          courseId: itemData.courseId,
          videoId: itemData.videoId,
          title: itemData.title,
          description: itemData.description,
          thumbnail: itemData.thumbnail,
          instructor: itemData.instructor,
          duration: itemData.duration,
          category: itemData.category,
          score,
          reason: 'recommended',
          metadata: {
            similarItems: []
          }
        });
      }

    } catch (err) {
      console.error('Error getting collaborative recommendations:', err);
    }

    return recommendations;
  };

  // Mark interaction
  const markInteraction = useCallback(async (
    itemId: string,
    interaction: 'click' | 'dismiss' | 'not_interested'
  ) => {
    if (!userId) return;

    try {
      const interactionData: UserInteraction = {
        itemId,
        interaction,
        timestamp: new Date()
      };

      const interactionsRef = doc(db, 'userInteractions', userId);
      await setDoc(
        interactionsRef,
        {
          interactions: arrayUnion({
            ...interactionData,
            timestamp: serverTimestamp()
          })
        },
        { merge: true }
      );

      // Update local state
      setInteractions(prev => [...prev, interactionData]);

      // Remove item from recommendations if dismissed or not interested
      if (interaction === 'dismiss' || interaction === 'not_interested') {
        setRecommendations(prev => prev.filter(rec => rec.itemId !== itemId));
      }

    } catch (err) {
      console.error('Error marking interaction:', err);
    }
  }, [userId]);

  // Refresh recommendations
  const refreshRecommendations = useCallback(async () => {
    await loadRecommendations();
  }, [loadRecommendations]);

  // Get recommendations by category
  const getRecommendationsByCategory = useCallback((category: string) => {
    return recommendations.filter(rec => rec.category === category);
  }, [recommendations]);

  // Get recommendations by reason
  const getRecommendationsByReason = useCallback((reason: RecommendationItem['reason']) => {
    return recommendations.filter(rec => rec.reason === reason);
  }, [recommendations]);

  return {
    recommendations,
    loading,
    error,
    lastRefresh,
    interactions,
    markInteraction,
    refreshRecommendations,
    getRecommendationsByCategory,
    getRecommendationsByReason
  };
}