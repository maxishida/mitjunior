export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  thumbnailBlur?: string;
  duration: number; // em minutos
  level: 'iniciante' | 'intermediario' | 'avancado';
  instructor: Instructor;
  category: string;
  tags: string[];
  rating?: number;
  studentsCount: number;
  price: number;
  promotionalPrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isLocked?: boolean;
  progress?: number; // percentual de conclusão
  totalLessons: number;
  completedLessons: number;
  certificateAvailable?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  specialties?: string[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number; // em segundos
  thumbnail?: string;
  thumbnailBlur?: string;
  videoUrl?: string;
  courseId: string;
  lessonNumber: number;
  order: number;
  isPreview?: boolean;
  watchTime?: number; // tempo assistido em segundos
  completed?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  videoId?: string;
  watchTime: number;
  duration: number;
  completed: boolean;
  lastWatchedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  courseId: string;
  videos: Video[];
  isLocked?: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number; // percentual geral do curso
  certificateIssued?: boolean;
  certificateUrl?: string;
}

export interface CourseReview {
  id: string;
  userId: string;
  courseId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Watchlist {
  id: string;
  userId: string;
  courseId: string;
  addedAt: string;
}

export interface CourseSearchFilters {
  category?: string;
  level?: string;
  instructor?: string;
  priceRange?: [number, number];
  rating?: number;
  duration?: [number, number];
  tags?: string[];
  sortBy?: 'recent' | 'popular' | 'rating' | 'price-low' | 'price-high' | 'duration';
  hasCertificate?: boolean;
  isFree?: boolean;
}

export interface CourseSearchParams {
  q?: string; // query de busca
  page?: number;
  limit?: number;
  filters?: CourseSearchFilters;
}

export interface PaginatedCourses {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Tipos para o player de vídeo
export interface VideoPlayerConfig {
  autoplay?: boolean;
  muted?: boolean;
  startTime?: number;
  quality?: 'auto' | '1080p' | '720p' | '480p' | '360p';
  playbackRate?: number;
  subtitles?: boolean;
  pictureInPicture?: boolean;
}

export interface VideoBookmark {
  id: string;
  userId: string;
  videoId: string;
  timestamp: number; // em segundos
  note?: string;
  createdAt: string;
}