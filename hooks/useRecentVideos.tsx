'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { ContinueWatchingItem } from '@/types';

export function useRecentVideos(userId: string | undefined, limitCount: number = 20) {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);

    // Query for all recently watched videos (both completed and incomplete)
    const progressQuery = query(
      collection(db, 'userProgress'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      progressQuery,
      async (querySnapshot) => {
        try {
          const recentVideoItems: ContinueWatchingItem[] = [];

          for (const progressDoc of querySnapshot.docs) {
            const progress = progressDoc.data();

            // Get video information
            const videoRef = doc(db, 'courses', progress.courseId, 'videos', progress.videoId);
            const videoSnap = await getDoc(videoRef);

            if (!videoSnap.exists()) continue;

            const videoData = videoSnap.data();

            // Get course information
            const courseRef = doc(db, 'courses', progress.courseId);
            const courseSnap = await getDoc(courseRef);

            if (!courseSnap.exists()) continue;

            const courseData = courseSnap.data();

            recentVideoItems.push({
              id: progressDoc.id,
              videoId: progress.videoId,
              courseId: progress.courseId,
              videoTitle: videoData.title || 'Unknown Video',
              courseTitle: courseData.title || 'Unknown Course',
              thumbnail: videoData.thumbnailURL || courseData.coverURL,
              watchedSeconds: progress.watchedSeconds || 0,
              totalSeconds: progress.totalSeconds || 0,
              lastPosition: progress.lastPosition || 0,
              lastWatchedAt: progress.updatedAt?.toDate() || new Date()
            });
          }

          setItems(recentVideoItems);
          setLoading(false);
          setError(null);

        } catch (err) {
          console.error('Error loading recent videos:', err);
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to recent videos:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, limitCount]);

  return {
    items,
    loading,
    error
  };
}
