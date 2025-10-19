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
  getDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { FavoriteItem } from '@/types';

interface UseFavoritesOptions {
  limit?: number;
  autoRefresh?: boolean;
  orderBy?: 'addedAt' | 'title';
  sortOrder?: 'desc' | 'asc';
}

export function useFavorites(
  userId: string | undefined,
  options: UseFavoritesOptions = {}
) {
  const {
    limit: limitCount = 50,
    autoRefresh = true,
    orderBy: orderByField = 'addedAt',
    sortOrder = 'desc'
  } = options;

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load favorites
  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let favoritesQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId)
    );

    // Apply ordering
    if (orderByField === 'addedAt') {
      favoritesQuery = query(
        favoritesQuery,
        orderBy('addedAt', sortOrder)
      );
    } else if (orderByField === 'title') {
      favoritesQuery = query(
        favoritesQuery,
        orderBy('title', sortOrder)
      );
    }

    // Apply limit
    if (limitCount > 0) {
      favoritesQuery = query(favoritesQuery, limit(limitCount));
    }

    const unsubscribe = onSnapshot(
      favoritesQuery,
      (querySnapshot) => {
        try {
          const favoritesData: FavoriteItem[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            favoritesData.push({
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
            });
          });

          setFavorites(favoritesData);
          setLoading(false);
          setError(null);

        } catch (err) {
          console.error('Error processing favorites:', err);
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error loading favorites:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, limitCount, orderByField, sortOrder, autoRefresh]);

  // Add to favorites
  const addToFavorites = useCallback(async (
    type: 'course' | 'video',
    itemId: string,
    metadata: Partial<FavoriteItem>
  ) => {
    if (!userId) {
      throw new Error('User must be authenticated to add favorites');
    }

    try {
      // Check if already in favorites
      const existingQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('itemId', '==', itemId)
      );

      const existingSnapshot = await getDocs(existingQuery);
      if (!existingSnapshot.empty) {
        throw new Error('Item already in favorites');
      }

      // Add to favorites
      const favoriteData = {
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
        addedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'favorites'), favoriteData);

    } catch (err) {
      console.error('Error adding to favorites:', err);
      throw err;
    }
  }, [userId]);

  // Remove from favorites
  const removeFromFavorites = useCallback(async (itemId: string) => {
    if (!userId) {
      throw new Error('User must be authenticated to remove favorites');
    }

    try {
      const queryRef = query(
        collection(db, 'favorites'),
        where('userId', '==', userId),
        where('itemId', '==', itemId)
      );

      const snapshot = await getDocs(queryRef);

      if (snapshot.empty) {
        throw new Error('Item not found in favorites');
      }

      // Remove all matching documents (should be only one)
      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

    } catch (err) {
      console.error('Error removing from favorites:', err);
      throw err;
    }
  }, [userId]);

  // Check if item is favorite
  const isFavorite = useCallback((itemId: string) => {
    return favorites.some(fav => fav.itemId === itemId);
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (
    type: 'course' | 'video',
    itemId: string,
    metadata: Partial<FavoriteItem>
  ) => {
    try {
      if (isFavorite(itemId)) {
        await removeFromFavorites(itemId);
      } else {
        await addToFavorites(type, itemId, metadata);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  // Get favorites by type
  const getFavoritesByType = useCallback((type: 'course' | 'video') => {
    return favorites.filter(fav => fav.type === type);
  }, [favorites]);

  // Get favorites by category
  const getFavoritesByCategory = useCallback((category: string) => {
    return favorites.filter(fav => fav.category === category);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(async () => {
    if (!userId) {
      throw new Error('User must be authenticated to clear favorites');
    }

    try {
      const queryRef = query(
        collection(db, 'favorites'),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(queryRef);

      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

    } catch (err) {
      console.error('Error clearing favorites:', err);
      throw err;
    }
  }, [userId]);

  // Get favorites count by type
  const getFavoritesCount = useCallback(() => {
    const counts = {
      total: favorites.length,
      courses: favorites.filter(fav => fav.type === 'course').length,
      videos: favorites.filter(fav => fav.type === 'video').length
    };
    return counts;
  }, [favorites]);

  // Search favorites
  const searchFavorites = useCallback((searchTerm: string) => {
    const lowercasedSearch = searchTerm.toLowerCase();
    return favorites.filter(fav =>
      fav.title.toLowerCase().includes(lowercasedSearch) ||
      fav.description?.toLowerCase().includes(lowercasedSearch) ||
      fav.instructor?.toLowerCase().includes(lowercasedSearch) ||
      fav.category?.toLowerCase().includes(lowercasedSearch)
    );
  }, [favorites]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    getFavoritesByCategory,
    clearFavorites,
    getFavoritesCount,
    searchFavorites
  };
}