'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  writeBatch,
  startAfter,
  endBefore,
  limitToLast
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { ViewHistoryItem } from '@/types';

interface UseViewHistoryOptions {
  limit?: number;
  autoRefresh?: boolean;
  includeCompleted?: boolean;
  type?: 'all' | 'course' | 'video';
  timeframe?: 'all' | 'today' | 'week' | 'month';
}

interface PaginationOptions {
  cursor?: any;
  direction?: 'forward' | 'backward';
  pageSize?: number;
}

export function useViewHistory(
  userId: string | undefined,
  options: UseViewHistoryOptions = {}
) {
  const {
    limit: limitCount = 50,
    autoRefresh = true,
    includeCompleted = true,
    type = 'all',
    timeframe = 'all'
  } = options;

  const [viewHistory, setViewHistory] = useState<ViewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocument, setLastDocument] = useState<any>(null);

  // Load view history
  useEffect(() => {
    if (!userId) {
      setViewHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let historyQuery = query(
      collection(db, 'viewHistory'),
      where('userId', '==', userId)
    );

    // Apply type filter
    if (type !== 'all') {
      historyQuery = query(historyQuery, where('type', '==', type));
    }

    // Apply completion filter
    if (!includeCompleted) {
      historyQuery = query(historyQuery, where('completed', '==', false));
    }

    // Apply timeframe filter
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    historyQuery = query(
      historyQuery,
      where('viewedAt', '>=', startDate)
    );

    // Apply ordering and limit
    historyQuery = query(
      historyQuery,
      orderBy('viewedAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      historyQuery,
      (querySnapshot) => {
        try {
          const historyData: ViewHistoryItem[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            historyData.push({
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
            });
          });

          setViewHistory(historyData);
          setHasMore(querySnapshot.docs.length === limitCount);
          setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setLoading(false);
          setError(null);

        } catch (err) {
          console.error('Error processing view history:', err);
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error loading view history:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, limitCount, includeCompleted, type, timeframe, autoRefresh]);

  // Add to view history
  const addToViewHistory = useCallback(async (
    type: 'course' | 'video',
    itemId: string,
    metadata: Partial<ViewHistoryItem>
  ) => {
    if (!userId) {
      throw new Error('User must be authenticated to add to view history');
    }

    try {
      const historyData = {
        userId,
        type,
        itemId,
        courseId: metadata.courseId,
        videoId: metadata.videoId,
        title: metadata.title || '',
        description: metadata.description || '',
        thumbnail: metadata.thumbnail || '',
        instructor: metadata.instructor || '',
        duration: metadata.duration || 0,
        category: metadata.category || '',
        viewedAt: serverTimestamp(),
        watchDuration: metadata.watchDuration || 0,
        completed: metadata.completed || false
      };

      await addDoc(collection(db, 'viewHistory'), historyData);

    } catch (err) {
      console.error('Error adding to view history:', err);
      throw err;
    }
  }, [userId]);

  // Update view history item
  const updateViewHistoryItem = useCallback(async (
    itemId: string,
    updates: Partial<ViewHistoryItem>
  ) => {
    if (!userId) {
      throw new Error('User must be authenticated to update view history');
    }

    try {
      const queryRef = query(
        collection(db, 'viewHistory'),
        where('userId', '==', userId),
        where('itemId', '==', itemId),
        orderBy('viewedAt', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(queryRef);

      if (snapshot.empty) {
        throw new Error('Item not found in view history');
      }

      const docRef = doc(db, 'viewHistory', snapshot.docs[0].id);
      const updateData = {
        ...updates,
        viewedAt: updates.viewedAt || serverTimestamp()
      };

      await updateDoc(docRef, updateData);

    } catch (err) {
      console.error('Error updating view history:', err);
      throw err;
    }
  }, [userId]);

  // Clear view history
  const clearViewHistory = useCallback(async (type?: 'all' | 'course' | 'video') => {
    if (!userId) {
      throw new Error('User must be authenticated to clear view history');
    }

    try {
      let queryRef = query(
        collection(db, 'viewHistory'),
        where('userId', '==', userId)
      );

      if (type && type !== 'all') {
        queryRef = query(queryRef, where('type', '==', type));
      }

      const snapshot = await getDocs(queryRef);

      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

    } catch (err) {
      console.error('Error clearing view history:', err);
      throw err;
    }
  }, [userId]);

  // Get view statistics
  const getViewStats = useCallback(() => {
    const stats = {
      totalViews: viewHistory.length,
      totalWatchTime: viewHistory.reduce((sum, item) => sum + item.watchDuration, 0),
      mostViewedCategory: '',
      averageSessionDuration: 0,
      completedVideos: viewHistory.filter(item => item.completed).length,
      categories: {} as Record<string, number>
    };

    // Calculate most viewed category
    viewHistory.forEach(item => {
      if (item.category) {
        stats.categories[item.category] = (stats.categories[item.category] || 0) + 1;
      }
    });

    stats.mostViewedCategory = Object.entries(stats.categories)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    // Calculate average session duration
    if (viewHistory.length > 0) {
      stats.averageSessionDuration = stats.totalWatchTime / viewHistory.length;
    }

    return stats;
  }, [viewHistory]);

  // Get recently viewed
  const getRecentlyViewed = useCallback((limit = 10) => {
    return viewHistory.slice(0, limit);
  }, [viewHistory]);

  // Get most watched
  const getMostWatched = useCallback((limit = 10) => {
    return [...viewHistory]
      .sort((a, b) => b.watchDuration - a.watchDuration)
      .slice(0, limit);
  }, [viewHistory]);

  // Search view history
  const searchViewHistory = useCallback((searchTerm: string) => {
    const lowercasedSearch = searchTerm.toLowerCase();
    return viewHistory.filter(item =>
      item.title.toLowerCase().includes(lowercasedSearch) ||
      item.description?.toLowerCase().includes(lowercasedSearch) ||
      item.instructor?.toLowerCase().includes(lowercasedSearch) ||
      item.category?.toLowerCase().includes(lowercasedSearch)
    );
  }, [viewHistory]);

  // Load more items (pagination)
  const loadMore = useCallback(async () => {
    if (!userId || !hasMore || !lastDocument) {
      return;
    }

    try {
      setLoading(true);

      let queryRef = query(
        collection(db, 'viewHistory'),
        where('userId', '==', userId),
        orderBy('viewedAt', 'desc'),
        startAfter(lastDocument),
        limit(limitCount)
      );

      if (type !== 'all') {
        queryRef = query(queryRef, where('type', '==', type));
      }

      const snapshot = await getDocs(queryRef);

      const newItems: ViewHistoryItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newItems.push({
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
        });
      });

      setViewHistory(prev => [...prev, ...newItems]);
      setHasMore(snapshot.docs.length === limitCount);
      setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
      setLoading(false);

    } catch (err) {
      console.error('Error loading more view history:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [userId, hasMore, lastDocument, limitCount, type]);

  return {
    viewHistory,
    loading,
    error,
    hasMore,
    addToViewHistory,
    updateViewHistoryItem,
    clearViewHistory,
    getViewStats,
    getRecentlyViewed,
    getMostWatched,
    searchViewHistory,
    loadMore
  };
}