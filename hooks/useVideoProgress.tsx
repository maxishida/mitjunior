'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { UserProgress, VideoProgress } from '@/types';

interface UseVideoProgressOptions {
  autoSave?: boolean;
  saveInterval?: number;
  completionThreshold?: number;
}

export function useVideoProgress(
  userId: string | undefined,
  videoId: string,
  courseId: string,
  totalSeconds: number = 0,
  options: UseVideoProgressOptions = {}
) {
  const {
    autoSave = true,
    saveInterval = 10000, // 10 seconds
    completionThreshold = 0.9 // 90%
  } = options;

  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Generate document ID
  const docId = `${userId}_${videoId}`;
  const progressRef = doc(db, 'userProgress', docId);

  // Load initial progress
  useEffect(() => {
    if (!userId || !videoId) return;

    const unsubscribe = onSnapshot(
      progressRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProgress;
          setProgress({
            videoId: data.videoId,
            title: '', // Will be populated by caller
            watchedSeconds: data.watchedSeconds,
            totalSeconds: data.totalSeconds,
            isCompleted: data.isCompleted,
            lastPosition: data.lastPosition
          });
        } else {
          setProgress({
            videoId,
            title: '',
            watchedSeconds: 0,
            totalSeconds,
            isCompleted: false,
            lastPosition: 0
          });
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error loading video progress:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, videoId, totalSeconds, progressRef]);

  // Update progress function
  const updateProgress = useCallback(async (
    watchedSeconds: number,
    currentTime: number
  ) => {
    if (!userId || !videoId) return;

    const isCompleted = watchedSeconds >= totalSeconds * completionThreshold;

    try {
      const progressData: Partial<UserProgress> = {
        userId,
        videoId,
        courseId,
        watchedSeconds,
        totalSeconds,
        isCompleted,
        lastPosition: currentTime,
        updatedAt: serverTimestamp(),
        ...(isCompleted && !progress?.isCompleted && {
          completedAt: serverTimestamp()
        })
      };

      await setDoc(progressRef, progressData, { merge: true });

      setProgress(prev => prev ? {
        ...prev,
        watchedSeconds,
        totalSeconds,
        isCompleted,
        lastPosition: currentTime
      } : null);

    } catch (err) {
      console.error('Error updating video progress:', err);
      setError(err as Error);
    }
  }, [userId, videoId, courseId, totalSeconds, completionThreshold, progress?.isCompleted, progressRef]);

  // Auto-save progress
  useEffect(() => {
    if (!autoSave || !progress) return;

    const interval = setInterval(() => {
      // This will be triggered by video player events
      // The actual update logic will be called by the video component
    }, saveInterval);

    return () => clearInterval(interval);
  }, [autoSave, saveInterval, progress]);

  // Mark as complete
  const markAsComplete = useCallback(async () => {
    if (!userId || !videoId) return;

    await updateProgress(progress?.watchedSeconds || 0, progress?.lastPosition || 0);
  }, [userId, videoId, progress, updateProgress]);

  // Reset progress
  const resetProgress = useCallback(async () => {
    if (!userId || !videoId) return;

    try {
      await updateDoc(progressRef, {
        watchedSeconds: 0,
        isCompleted: false,
        lastPosition: 0,
        updatedAt: serverTimestamp(),
        completedAt: null
      });

      setProgress(prev => prev ? {
        ...prev,
        watchedSeconds: 0,
        isCompleted: false,
        lastPosition: 0
      } : null);

    } catch (err) {
      console.error('Error resetting video progress:', err);
      setError(err as Error);
    }
  }, [userId, videoId, progressRef]);

  return {
    progress,
    loading,
    error,
    updateProgress,
    markAsComplete,
    resetProgress,
    isCompleted: progress?.isCompleted || false,
    watchProgress: progress ? (progress.watchedSeconds / progress.totalSeconds) * 100 : 0
  };
}