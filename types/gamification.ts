export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'first_steps' | 'engagement' | 'completion' | 'social' | 'milestone';
  type: 'automatic' | 'manual';
  points: number;
  badge: {
    color: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  requirements: {
    type: 'video_completed' | 'course_completed' | 'streak_days' | 'courses_explored' | 'total_progress' | 'points_threshold';
    value: number;
    operator?: 'equals' | 'greater_than' | 'greater_than_or_equal';
  };
  secret?: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  isCompleted: boolean;
  notificationSent: boolean;
  metadata?: {
    context?: string;
    triggerData?: any;
  };
}

export interface UserStats {
  id: string;
  userId: string;
  totalPoints: number;
  level: number;
  experiencePoints: number;
  currentStreak: number;
  longestStreak: number;
  videosCompleted: number;
  coursesCompleted: number;
  coursesStarted: number;
  totalWatchTime: number;
  averageSessionTime: number;
  lastActiveDate: Date;
  achievementsCount: number;
  certificatesCount: number;
  leaderboardRank?: number;
  weeklyProgress: {
    week: string;
    pointsEarned: number;
    videosWatched: number;
    activeDays: number;
  }[];
  monthlyProgress: {
    month: string;
    pointsEarned: number;
    videosWatched: number;
    coursesCompleted: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  instructorName: string;
  completionDate: Date;
  score: number;
  totalModules: number;
  completedModules: number;
  certificateUrl: string;
  verificationCode: string;
  issuedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  metadata: {
    duration: number;
    skills: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'bonus' | 'penalty';
  amount: number;
  source: 'video_completion' | 'course_completion' | 'achievement' | 'streak_bonus' | 'referral' | 'daily_bonus';
  description: string;
  metadata?: {
    videoId?: string;
    courseId?: string;
    achievementId?: string;
    multiplier?: number;
  };
  balance: number;
  createdAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  totalPoints: number;
  level: number;
  rank: number;
  previousRank?: number;
  achievementsCount: number;
  coursesCompleted: number;
  streakDays: number;
  badge?: {
    type: string;
    icon: string;
  };
  change?: 'up' | 'down' | 'same';
}

export interface GamificationNotification {
  id: string;
  userId: string;
  type: 'achievement_unlocked' | 'level_up' | 'streak_milestone' | 'certificate_earned' | 'leaderboard_rank_change';
  title: string;
  message: string;
  data?: {
    achievement?: Achievement;
    newLevel?: number;
    streakDays?: number;
    certificate?: Certificate;
    newRank?: number;
  };
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  totalVideos: number;
  completedVideos: string[];
  progressPercentage: number;
  lastAccessedAt: Date;
  completedAt?: Date;
  timeSpent: number;
  certificateEligible: boolean;
  score: number;
}

export interface StreakData {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  streakHistory: {
    date: string;
    active: boolean;
    videosWatched: number;
    timeSpent: number;
  }[];
}

export interface AchievementRule {
  trigger: string;
  conditions: {
    field: string;
    operator: '==' | '>' | '>=' | '<' | '<=' | 'array-contains' | 'array-contains-any';
    value: any;
  }[];
  actions: {
    type: 'award_points' | 'unlock_achievement' | 'update_level' | 'send_notification';
    parameters: any;
  }[];
  cooldown?: number; // em horas
}

export interface GamificationConfig {
  pointsPerVideo: number;
  pointsPerCourse: number;
  streakBonusMultiplier: number;
  levelUpThreshold: number;
  maxDailyBonus: number;
  achievementRefreshInterval: number;
  leaderboardUpdateInterval: number;
  certificateTemplate: string;
  badgeTemplates: {
    [key: string]: {
      common: string;
      rare: string;
      epic: string;
      legendary: string;
    };
  };
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'video_watched' | 'course_started' | 'course_completed' | 'achievement_unlocked' | 'certificate_earned';
  timestamp: Date;
  metadata: {
    videoId?: string;
    courseId?: string;
    achievementId?: string;
    duration?: number;
    score?: number;
  };
  sessionId: string;
  device: string;
  ipAddress?: string;
}

export interface GamificationAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  engagement: {
    totalSessions: number;
    averageSessionTime: number;
    retentionRate: number;
    churnRisk: 'low' | 'medium' | 'high';
  };
  progress: {
    pointsGrowth: number[];
    levelProgression: number[];
    achievementRate: number;
    completionRate: number;
  };
  behavior: {
    mostActiveHours: number[];
    preferredContent: string[];
    learningPath: string[];
    interactionPatterns: any;
  };
}