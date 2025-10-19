import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin.config';
import type { NextRequest } from 'next/server';
import type { AnalyticsEvent } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json();

    // Validate required fields
    if (!event.event_name || !event.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: event_name, timestamp' },
        { status: 400 }
      );
    }

    // Add server-side data
    const serverEvent = {
      ...event,
      server_timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      user_agent: request.headers.get('user-agent')
    };

    // Store in Firestore
    await admin.firestore().collection('analytics_events').add(serverEvent);

    // Update real-time analytics (for dashboards)
    await updateRealtimeAnalytics(event);

    // Trigger any automated workflows based on events
    await triggerEventWorkflows(event);

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    });

  } catch (error: any) {
    console.error('Analytics tracking error:', error);

    return NextResponse.json(
      { error: 'Failed to track event', details: error.message },
      { status: 500 }
    );
  }
}

async function updateRealtimeAnalytics(event: AnalyticsEvent) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // Update daily stats
  const dailyStatsRef = admin.firestore().collection('analytics_daily').doc(today);
  await admin.firestore().runTransaction(async (transaction) => {
    const doc = await transaction.get(dailyStatsRef);
    const data = doc.exists ? doc.data() : { events: {}, uniqueUsers: new Set() };

    // Increment event count
    data.events[event.event_name] = (data.events[event.event_name] || 0) + 1;

    // Track unique users if user_id is present
    if (event.user_id) {
      if (!data.uniqueUsers) data.uniqueUsers = [];
      if (!data.uniqueUsers.includes(event.user_id)) {
        data.uniqueUsers.push(event.user_id);
      }
    }

    transaction.set(dailyStatsRef, {
      ...data,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  // Update funnel analytics for conversion events
  if (['sign_up', 'login', 'course_start', 'course_complete'].includes(event.event_name)) {
    await updateFunnelAnalytics(event);
  }
}

async function updateFunnelAnalytics(event: AnalyticsEvent) {
  const funnelRef = admin.firestore().collection('analytics_funnel').doc('current');

  await admin.firestore().runTransaction(async (transaction) => {
    const doc = await transaction.get(funnelRef);
    const funnel = doc.exists ? doc.data() : { stages: {} };

    // Map events to funnel stages
    const stageMapping: Record<string, string> = {
      'page_view': 'visitors',
      'sign_up': 'signups',
      'login': 'active_users',
      'course_start': 'course_starters',
      'course_complete': 'course_completers'
    };

    const stage = stageMapping[event.event_name];
    if (stage) {
      funnel.stages[stage] = (funnel.stages[stage] || 0) + 1;

      // Calculate conversion rates
      if (stage === 'signups' && funnel.stages.visitors) {
        funnel.conversion_rate_signup = (funnel.stages.signups / funnel.stages.visitors) * 100;
      }
      if (stage === 'course_starters' && funnel.stages.signups) {
        funnel.conversion_rate_course_start = (funnel.stages.course_starters / funnel.stages.signups) * 100;
      }
    }

    transaction.set(funnelRef, {
      ...funnel,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
  });
}

async function triggerEventWorkflows(event: AnalyticsEvent) {
  // Example workflows based on specific events

  // Welcome sequence for new users
  if (event.event_name === 'sign_up' && event.user_id) {
    // Schedule welcome emails
    await scheduleWelcomeSequence(event.user_id);
  }

  // Course completion rewards
  if (event.event_name === 'course_complete' && event.user_id) {
    await handleCourseCompletion(event.user_id, event.event_params?.course_id);
  }

  // Engagement-based notifications
  if (event.event_name === 'engagement' && event.user_id) {
    await trackUserEngagement(event.user_id, event.event_params);
  }
}

async function scheduleWelcomeSequence(userId: string) {
  // This would integrate with your email/marketing automation system
  console.log(`Scheduling welcome sequence for user: ${userId}`);

  // Store in automation queue
  await admin.firestore().collection('automation_queue').add({
    type: 'welcome_sequence',
    userId,
    scheduledAt: new Date(),
    status: 'pending'
  });
}

async function handleCourseCompletion(userId: string, courseId?: string) {
  if (!courseId) return;

  // Update user achievements
  await admin.firestore().collection('users').doc(userId).update({
    'gamification.completedCourses': admin.firestore.FieldValue.arrayUnion(courseId),
    'gamification.totalCompleted': admin.firestore.FieldValue.increment(1)
  });

  // Check for badges/achievements
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  const userData = userDoc.data();

  if (userData?.gamification?.totalCompleted === 1) {
    // First course completion badge
    await admin.firestore().collection('users').doc(userId).update({
      'gamification.badges': admin.firestore.FieldValue.arrayUnion('first_course_complete'),
      'gamification.achievements': admin.firestore.FieldValue.arrayUnion('course_starter')
    });

    // Send achievement notification
    await sendAchievementNotification(userId, 'first_course_complete');
  }
}

async function trackUserEngagement(userId: string, params?: Record<string, any>) {
  if (!params?.action) return;

  // Update user engagement score
  const engagementScores: Record<string, number> = {
    'video_watch': 5,
    'quiz_complete': 10,
    'comment_post': 3,
    'course_start': 8,
    'profile_update': 2
  };

  const score = engagementScores[params.action] || 1;

  await admin.firestore().collection('users').doc(userId).update({
    'engagement.lastActivity': admin.firestore.FieldValue.serverTimestamp(),
    'engagement.score': admin.firestore.FieldValue.increment(score)
  });
}

async function sendAchievementNotification(userId: string, achievement: string) {
  // This would integrate with your notification system
  console.log(`Sending achievement notification: ${achievement} to user: ${userId}`);

  await admin.firestore().collection('notifications').add({
    userId,
    type: 'achievement',
    achievement,
    title: 'Nova Conquista!',
    message: 'Você desbloqueou um novo achievement na plataforma!',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    read: false
  });
}