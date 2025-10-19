// Analytics Service - Unified Analytics and Monitoring
import { getAnalytics, logEvent as fbLogEvent, setUserProperties as fbSetUserProperties, setUserId as fbSetUserId } from 'firebase/analytics';
import { app } from './firebase.config';

class AnalyticsService {
  private analytics: any = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined' && !this.isInitialized) {
      try {
        this.analytics = getAnalytics(app);
        this.isInitialized = true;
        console.log('Analytics initialized successfully');
      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    }
  }

  // User Identification
  setUserId(userId: string) {
    if (this.analytics && userId) {
      try {
        fbSetUserId(this.analytics, userId);
        this.logEvent('user_identified', { user_id: userId });
      } catch (error) {
        console.warn('Failed to set user ID:', error);
      }
    }
  }

  setUserProperties(properties: Record<string, any>) {
    if (this.analytics && properties) {
      try {
        fbSetUserProperties(this.analytics, properties);
        this.logEvent('user_properties_set', { properties: Object.keys(properties) });
      } catch (error) {
        console.warn('Failed to set user properties:', error);
      }
    }
  }

  // Custom Events
  logEvent(eventName: string, parameters?: Record<string, any>) {
    if (this.analytics && eventName) {
      try {
        const eventParams = {
          timestamp: new Date().toISOString(),
          ...parameters
        };
        fbLogEvent(this.analytics, eventName, eventParams);

        // Console logging for development
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 Analytics Event: ${eventName}`, eventParams);
        }
      } catch (error) {
        console.warn(`Failed to log event ${eventName}:`, error);
      }
    }
  }

  // Video Engagement Events
  videoPlay(videoId: string, courseId: string, title: string) {
    this.logEvent('video_play', {
      video_id: videoId,
      course_id: courseId,
      video_title: title,
      content_type: 'video'
    });
  }

  videoComplete(videoId: string, courseId: string, duration: number) {
    this.logEvent('video_complete', {
      video_id: videoId,
      course_id: courseId,
      video_duration: duration,
      content_type: 'video'
    });
  }

  videoProgress(videoId: string, progress: number, duration: number) {
    this.logEvent('video_progress', {
      video_id: videoId,
      progress_percentage: progress,
      video_duration: duration,
      content_type: 'video'
    });
  }

  // Course Events
  courseEnroll(courseId: string, title: string, category: string) {
    this.logEvent('course_enroll', {
      course_id: courseId,
      course_title: title,
      course_category: category,
      content_type: 'course'
    });
  }

  courseComplete(courseId: string, title: string, duration: number) {
    this.logEvent('course_complete', {
      course_id: courseId,
      course_title: title,
      completion_time: duration,
      content_type: 'course'
    });
  }

  courseStart(courseId: string, title: string) {
    this.logEvent('course_start', {
      course_id: courseId,
      course_title: title,
      content_type: 'course'
    });
  }

  // Gamification Events
  achievementUnlock(achievementId: string, title: string, points: number) {
    this.logEvent('achievement_unlock', {
      achievement_id: achievementId,
      achievement_title: title,
      points_earned: points,
      content_type: 'achievement'
    });
  }

  levelUp(newLevel: number, totalPoints: number) {
    this.logEvent('level_up', {
      new_level: newLevel,
      total_points: totalPoints,
      content_type: 'gamification'
    });
  }

  streakMilestone(streakDays: number) {
    this.logEvent('streak_milestone', {
      streak_days: streakDays,
      content_type: 'gamification'
    });
  }

  // Community Events
  postCreate(postId: string, category: string) {
    this.logEvent('post_create', {
      post_id: postId,
      post_category: category,
      content_type: 'community'
    });
  }

  commentCreate(postId: string) {
    this.logEvent('comment_create', {
      post_id: postId,
      content_type: 'community'
    });
  }

  // Engagement Events
  login(method: string = 'email') {
    this.logEvent('login', {
      method: method,
      content_type: 'authentication'
    });
  }

  signup(method: string = 'email') {
    this.logEvent('sign_up', {
      method: method,
      content_type: 'authentication'
    });
  }

  pageView(pagePath: string, pageTitle?: string) {
    this.logEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle || pagePath,
      content_type: 'navigation'
    });
  }

  search(query: string, category?: string) {
    this.logEvent('search', {
      search_term: query.toLowerCase(),
      search_category: category || 'all',
      content_type: 'search'
    });
  }

  favoriteContent(contentId: string, contentType: 'course' | 'video', title: string) {
    this.logEvent('favorite_add', {
      content_id: contentId,
      content_type: contentType,
      content_title: title
    });
  }

  shareContent(contentId: string, contentType: 'course' | 'video', platform: string) {
    this.logEvent('share', {
      content_id: contentId,
      content_type: contentType,
      platform: platform,
      method: 'social_share'
    });
  }

  // Performance Events
  performanceMetric(metricName: string, value: number) {
    this.logEvent('performance_metric', {
      metric_name: metricName,
      metric_value: value,
      content_type: 'performance'
    });
  }

  // Error Events
  errorEvent(errorName: string, errorMessage: string, context?: string) {
    this.logEvent('error', {
      error_name: errorName,
      error_message: errorMessage,
      error_context: context || 'unknown',
      content_type: 'error_tracking'
    });
  }

  // Conversion Events
  subscriptionStart(planId: string, planAmount: number) {
    this.logEvent('begin_checkout', {
      item_id: planId,
      value: planAmount,
      currency: 'BRL',
      content_type: 'subscription'
    });
  }

  subscriptionComplete(planId: string, planAmount: number) {
    this.logEvent('purchase', {
      transaction_id: `sub_${Date.now()}`,
      item_id: planId,
      value: planAmount,
      currency: 'BRL',
      content_type: 'subscription'
    });
  }

  // Certificate Events
  certificateEarned(courseId: string, courseName: string) {
    this.logEvent('certificate_earned', {
      course_id: courseId,
      course_name: courseName,
      content_type: 'certificate'
    });
  }

  certificateShare(certificateId: string, platform: string) {
    this.logEvent('certificate_share', {
      certificate_id: certificateId,
      platform: platform,
      content_type: 'certificate'
    });
  }

  // Learning Progress Events
  studySessionStart(courseId: string, sessionType: 'video' | 'reading' | 'quiz') {
    this.logEvent('study_session_start', {
      course_id: courseId,
      session_type: sessionType,
      content_type: 'learning'
    });
  }

  studySessionComplete(courseId: string, duration: number, sessionType: 'video' | 'reading' | 'quiz') {
    this.logEvent('study_session_complete', {
      course_id: courseId,
      session_duration: duration,
      session_type: sessionType,
      content_type: 'learning'
    });
  }

  // Custom Business Metrics
  userRetention(daysSinceLastVisit: number) {
    this.logEvent('user_retention', {
      days_since_last_visit: daysSinceLastVisit,
      content_type: 'retention'
    });
  }

  contentInteraction(contentType: string, action: string, contentId: string) {
    this.logEvent('content_interaction', {
      content_type: contentType,
      interaction_type: action,
      content_id: contentId
    });
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Export convenience functions for easy usage
export const {
  setUserId,
  setUserProperties,
  videoPlay,
  videoComplete,
  videoProgress,
  courseEnroll,
  courseComplete,
  courseStart,
  achievementUnlock,
  levelUp,
  streakMilestone,
  postCreate,
  commentCreate,
  login,
  signup,
  pageView,
  search,
  favoriteContent,
  shareContent,
  subscriptionStart,
  subscriptionComplete,
  certificateEarned,
  studySessionStart,
  studySessionComplete
} = analyticsService;

export default analyticsService;