'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { CourseProgress, VideoProgress } from '@/types';

export function useCourseProgress(userId: string | undefined, courseId: string) {
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [videos, setVideos] = useState<VideoProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !courseId) {
      setCourseProgress(null);
      setVideos([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);

    // Query progress documents for this course
    const progressQuery = query(
      collection(db, 'userProgress'),
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );

    const unsubscribe = onSnapshot(
      progressQuery,
      async (querySnapshot) => {
        try {
          const progressDocs = querySnapshot.docs;

          // Get course information
          const courseRef = doc(db, 'courses', courseId);
          const courseSnap = await getDoc(courseRef);

          if (!courseSnap.exists()) {
            throw new Error('Course not found');
          }

          const courseData = courseSnap.data();
          const courseTitle = courseData.title || 'Unknown Course';
          const courseCoverImage = courseData.coverURL;

          // Get all videos in this course
          const videosCollection = collection(courseRef, 'videos');
          const videosSnapshot = await getDocs(videosCollection);
          const totalVideos = videosSnapshot.docs.length;

          // Calculate progress
          let completedVideos = 0;
          let totalDuration = 0;
          let watchedDuration = 0;
          let lastAccessedAt = new Date(0);

          const videoProgressList: VideoProgress[] = [];

          for (const videoDoc of progressDocs) {
            const progress = videoDoc.data();
            const videoRef = doc(videosCollection, progress.videoId);
            const videoSnap = await getDoc(videoRef);

            if (videoSnap.exists()) {
              const videoData = videoSnap.data();

              completedVideos += progress.isCompleted ? 1 : 0;
              totalDuration += progress.totalSeconds || 0;
              watchedDuration += progress.watchedSeconds || 0;

              if (progress.updatedAt && progress.updatedAt.toDate() > lastAccessedAt) {
                lastAccessedAt = progress.updatedAt.toDate();
              }

              videoProgressList.push({
                videoId: progress.videoId,
                title: videoData.title || 'Unknown Video',
                watchedSeconds: progress.watchedSeconds || 0,
                totalSeconds: progress.totalSeconds || 0,
                isCompleted: progress.isCompleted || false,
                lastPosition: progress.lastPosition || 0,
                thumbnail: videoData.thumbnailURL
              });
            }
          }

          const isCourseCompleted = completedVideos === totalVideos && totalVideos > 0;

          const courseProgressData: CourseProgress = {
            courseId,
            title: courseTitle,
            totalVideos,
            completedVideos,
            totalDuration,
            watchedDuration,
            isCompleted: isCourseCompleted,
            lastAccessedAt,
            coverImage: courseCoverImage
          };

          setCourseProgress(courseProgressData);
          setVideos(videoProgressList);
          setLoading(false);
          setError(null);

        } catch (err) {
          console.error('Error calculating course progress:', err);
          setError(err as Error);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to course progress:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, courseId]);

  return {
    courseProgress,
    videos,
    loading,
    error,
    completionPercentage: courseProgress ?
      (courseProgress.completedVideos / courseProgress.totalVideos) * 100 : 0,
    timeWatchedPercentage: courseProgress ?
      (courseProgress.watchedDuration / courseProgress.totalDuration) * 100 : 0
  };
}
