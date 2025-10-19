export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface CardProps extends ComponentProps {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface InputProps extends ComponentProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'instagram' | 'facebook';
  href: string;
  label?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating?: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: 'month' | 'year' | 'lifetime';
  features: string[];
  highlighted?: boolean;
  cta: {
    text: string;
    href: string;
  };
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

// User Progress Types
export interface UserProgress {
  id: string;
  userId: string;
  videoId: string;
  courseId: string;
  watchedSeconds: number;
  totalSeconds: number;
  isCompleted: boolean;
  lastPosition: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoProgress {
  videoId: string;
  title: string;
  watchedSeconds: number;
  totalSeconds: number;
  isCompleted: boolean;
  lastPosition: number;
  thumbnail?: string;
}

export interface CourseProgress {
  courseId: string;
  title: string;
  totalVideos: number;
  completedVideos: number;
  totalDuration: number;
  watchedDuration: number;
  isCompleted: boolean;
  lastAccessedAt: Date;
  coverImage?: string;
}

export interface ProgressSummary {
  totalCoursesStarted: number;
  totalCoursesCompleted: number;
  totalVideosWatched: number;
  totalWatchTime: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: {
    week: string;
    minutesWatched: number;
    videosCompleted: number;
  }[];
}

export interface ContinueWatchingItem {
  id: string;
  videoId: string;
  courseId: string;
  videoTitle: string;
  courseTitle: string;
  thumbnail?: string;
  watchedSeconds: number;
  totalSeconds: number;
  lastPosition: number;
  lastWatchedAt: Date;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Gamification Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'dedicated' | 'expert' | 'master' | 'special' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  requirements?: string[];
  rewards?: {
    points: number;
    badge?: string;
    title?: string;
  };
}

export interface UserStats {
  totalPoints: number;
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  levelTitle: string;
  rankPosition: number;
  totalUsers: number;
  streak: number;
  totalWatchTime: number; // em minutos
  completedVideos: number;
  completedCourses: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  certificates: number;
  joinDate: Date;
  lastActivity: Date;
  weeklyProgress: {
    week: string;
    points: number;
    videosCompleted: number;
  }[];
  monthlyProgress: {
    month: string;
    points: number;
    videosCompleted: number;
    coursesCompleted: number;
  }[];
}

export interface Certificate {
  id: string;
  title: string;
  description: string;
  courseName: string;
  instructorName: string;
  instructorTitle: string;
  issueDate: Date;
  completionDate: Date;
  hoursCompleted: number;
  score?: number;
  grade?: 'A' | 'B' | 'C' | 'D' | 'F';
  verificationCode: string;
  certificateUrl: string;
  thumbnailUrl: string;
  skills: string[];
  shareUrl: string;
  isPublic: boolean;
  badge: {
    icon: string;
    color: string;
    title: string;
  };
}

export interface PointsAnimation {
  id: string;
  points: number;
  type: 'gain' | 'loss' | 'bonus' | 'streak' | 'achievement';
  reason: string;
  timestamp: Date;
  animationType: 'float-up' | 'burst' | 'rainbow' | 'star';
  position: { x: number; y: number };
}

export interface LevelReward {
  level: number;
  title: string;
  pointsBonus: number;
  features: string[];
  badge: {
    icon: string;
    color: string;
    glow: boolean;
  };
  nextLevelTitle: string;
}

export interface Activity {
  id: string;
  type: 'video_completed' | 'course_completed' | 'achievement_unlocked' | 'level_up' | 'certificate_earned' | 'streak_milestone';
  title: string;
  description: string;
  points: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  userTitle: string;
  totalPoints: number;
  level: number;
  achievements: number;
  change: number; // mudança na posição (+1, -2, 0)
  badges: string[];
}

export interface GamificationContextType {
  userStats: UserStats | null;
  achievements: Achievement[];
  certificates: Certificate[];
  activities: Activity[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  addPoints: (points: number, reason: string, type?: PointsAnimation['type']) => Promise<void>;
  markVideoCompleted: (videoId: string, courseId: string) => Promise<void>;
  markCourseCompleted: (courseId: string) => Promise<void>;
  generateCertificate: (courseId: string) => Promise<Certificate>;
  shareCertificate: (certificateId: string, platform: 'twitter' | 'linkedin' | 'facebook') => Promise<void>;
  updateStreak: () => Promise<void>;
}

// Engagement System Types
export interface FavoriteItem {
  id: string;
  userId: string;
  type: 'course' | 'video';
  itemId: string;
  courseId?: string;
  videoId?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  instructor?: string;
  duration?: number;
  category?: string;
  addedAt: Date;
}

export interface ViewHistoryItem {
  id: string;
  userId: string;
  type: 'course' | 'video';
  itemId: string;
  courseId?: string;
  videoId?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  instructor?: string;
  duration?: number;
  category?: string;
  viewedAt: Date;
  watchDuration: number;
  completed: boolean;
}

export interface RecommendationItem {
  id: string;
  type: 'course' | 'video';
  itemId: string;
  courseId?: string;
  videoId?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  instructor?: string;
  duration?: number;
  category?: string;
  score: number;
  reason: 'trending' | 'similar' | 'continue' | 'new' | 'recommended';
  metadata?: {
    viewsCount?: number;
    rating?: number;
    completionRate?: number;
    similarItems?: string[];
  };
}

export interface EngagementContextType {
  favorites: FavoriteItem[];
  viewHistory: ViewHistoryItem[];
  recommendations: RecommendationItem[];
  loading: {
    favorites: boolean;
    viewHistory: boolean;
    recommendations: boolean;
  };
  error: string | null;

  // Favorites actions
  addToFavorites: (type: 'course' | 'video', itemId: string, metadata: Partial<FavoriteItem>) => Promise<void>;
  removeFromFavorites: (itemId: string) => Promise<void>;
  isFavorite: (itemId: string) => boolean;

  // View history actions
  addToViewHistory: (type: 'course' | 'video', itemId: string, metadata: Partial<ViewHistoryItem>) => Promise<void>;
  clearViewHistory: () => Promise<void>;
  getViewStats: () => {
    totalViews: number;
    totalWatchTime: number;
    mostViewedCategory: string;
    averageSessionDuration: number;
  };

  // Recommendations actions
  refreshRecommendations: () => Promise<void>;
  getRecommendationsByCategory: (category: string) => RecommendationItem[];
  markInteraction: (itemId: string, interaction: 'click' | 'dismiss' | 'not_interested') => Promise<void>;
}