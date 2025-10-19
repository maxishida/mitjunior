'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { ProgressSummary } from '@/types';

export function useProgressSummary(userId: string | undefined) {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    // Query all progress documents for this user
    const progressQuery = query(
      collection(db, 'userProgress'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      progressQuery,
      async (querySnapshot) => {
        try {
          const progressDocs = querySnapshot.docs;
          const courseIds = new Set<string>();
          const completedCourses = new Set<string>();
          const totalWatchTime = 0;
          const videosCompleted = 0;

          let totalWatchTimeAccumulator = 0;
          let videosCompletedAccumulator = 0;

          // Calculate weekly progress for the last 4 weeks
          const weeklyProgress: {
            week: string;
            minutesWatched: number;
            videosCompleted: number;
          }[] = [];

          const now = new Date();
          for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - (i * 7));
            weekStart.setHours(0, 0, 0, 0);

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 7);

            weeklyProgress.push({
              week: `Week ${4 - i}`,
              minutesWatched: 0,
              videosCompleted: 0
            });
          }

          for (const progressDoc of progressDocs) {
            const progress = progressDoc.data();

            courseIds.add(progress.courseId);

            if (progress.isCompleted) {
              completedCourses.add(progress.courseId);
              videosCompletedAccumulator++;
            }

            totalWatchTimeAccumulator += progress.watchedSeconds || 0;

            // Calculate weekly progress
            if (progress.updatedAt) {
              const updateDate = progress.updatedAt.toDate();
              for (let i = 0; i < weeklyProgress.length; i++) {
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - ((3 - i) * 7));
                weekStart.setHours(0, 0, 0, 0);

                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 7);

                if (updateDate >= weekStart && updateDate < weekEnd) {
                  weeklyProgress[i].minutesWatched += (progress.watchedSeconds || 0) / 60;
                  if (progress.isCompleted) {
                    weeklyProgress[i].videosCompleted++;
                  }
                }
              }
            }
          }

          // Calculate streaks (simplified version - you might want to implement more sophisticated logic)
          const dailyActivity = new Map<string, boolean>();

          for (const progressDoc of progressDocs) {
            const progress = progressDoc.data();
            if (progress.updatedAt) {
              const dateStr = progress.updatedAt.toDate().toISOString().split('T')[0];
              dailyActivity.set(dateStr, true);
            }
          }

          const sortedDates = Array.from(dailyActivity.keys()).sort();
          let currentStreak = 0;
          let longestStreak = 0;
          let tempStreak = 0;

          // Simple streak calculation
          for (let i = sortedDates.length - 1; i >= 0; i--) {
            const currentDate = new Date(sortedDates[i]);
            const nextDate = i < sortedDates.length - 1 ? new Date(sortedDates[i + 1]) : new Date();

            const daysDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff === 1 || i === sortedDates.length - 1) {
              tempStreak++;
            } else {
              longestStreak = Math.max(longestStreak, tempStreak);
              tempStreak = 1;
            }
          }

          longestStreak = Math.max(longestStreak, tempStreak);
          currentStreak = tempStreak;

          const summaryData: ProgressSummary = {
            totalCoursesStarted: courseIds.size,
            totalCoursesCompleted: completedCourses.size,
            totalVideosWatched: progressDocs.length,
            totalWatchTime: totalWatchTimeAccumulator,
            currentStreak,
            longestStreak,
            weeklyProgress
          };

          setSummary(summaryData);
          setLoading(false);
          setError(null);

        } catch (err) {
          console.error('Error calculating progress summary:', err);
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to progress summary:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return {
    summary,
    loading,
    error
  };
}