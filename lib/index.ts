// Main library exports
export { analyticsService } from './analytics.service';
export { performanceService } from './performance.service';
export { errorTrackingService } from './error-tracking.service';

// Re-export convenience functions
export {
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
} from './analytics.service';

export {
  recordMetric,
  recordVideoLoadTime,
  recordVideoBufferTime,
  recordApiCall,
  recordDatabaseQuery,
  recordClickTime,
  recordFormSubmitTime,
  recordMemoryUsage,
  recordNetworkInfo,
  startCustomTrace,
  getCurrentMetrics,
  calculatePerformanceScore,
  reportPerformanceIssue
} from './performance.service';

export {
  captureError,
  captureAuthError,
  captureNetworkError,
  captureVideoError,
  captureDatabaseError,
  captureValidationError,
  capturePerformanceError,
  captureReactError,
  getErrorStats,
  getErrorSuggestion
} from './error-tracking.service';