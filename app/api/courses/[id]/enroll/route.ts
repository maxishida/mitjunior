/**
 * COURSE ENROLLMENT API - COMUNIDADE FLIX
 * User enrollment management
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api/core.service';
import { db } from '@/lib/firebase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return apiService.withApiMiddleware(request, async (userId, userToken) => {
    const courseId = params.id;
    const body = await request.json();
    const sanitizedBody = apiService.sanitizeInput(body);

    try {
      // Check if course exists and is enrollable
      const courseDoc = await db.collection('courses').doc(courseId).get();

      if (!courseDoc.exists) {
        return apiService.createErrorResponse('Course not found', 404);
      }

      const courseData = { id: courseDoc.id, ...courseDoc.data() };

      // Check if course is published and enrollable
      if (courseData.status !== 'published') {
        return apiService.createErrorResponse('Course is not available for enrollment', 400);
      }

      // Check organization access
      if (courseData.visibility === 'organization' &&
          !apiService.hasOrganizationAccess(userToken, courseData.organizationId)) {
        return apiService.createErrorResponse('Access denied', 403);
      }

      // Check if user is already enrolled
      const existingEnrollmentSnapshot = await db.collection('enrollments')
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .limit(1)
        .get();

      if (!existingEnrollmentSnapshot.empty) {
        return apiService.createErrorResponse('Already enrolled in this course', 409);
      }

      // Check prerequisites if any
      if (courseData.settings?.prerequisiteCourses &&
          courseData.settings.prerequisiteCourses.length > 0) {

        const prerequisiteEnrollments = await db.collection('enrollments')
          .where('userId', '==', userId)
          .where('courseId', 'in', courseData.settings.prerequisiteCourses)
          .where('status', '==', 'completed')
          .get();

        if (prerequisiteEnrollments.size < courseData.settings.prerequisiteCourses.length) {
          return apiService.createErrorResponse('Prerequisites not met', 400);
        }
      }

      // Handle pricing
      let paymentType = 'free';
      let paymentAmount = 0;

      if (courseData.pricing?.type === 'paid') {
        paymentType = 'paid';
        paymentAmount = courseData.pricing.amount || 0;

        // Check for promotional codes
        if (sanitizedBody.promotionalCode) {
          // This would integrate with a payment service
          // For now, we'll just apply a simple discount
          paymentAmount *= 0.9; // 10% discount
        }

        if (paymentAmount > 0) {
          // In a real implementation, this would integrate with Stripe/Mercado Pago
          return apiService.createErrorResponse(
            'Payment processing not implemented in this demo',
            501
          );
        }
      }

      // Create enrollment
      const enrollmentData = {
        userId,
        courseId,
        organizationId: courseData.organizationId,
        status: paymentAmount > 0 ? 'pending_payment' : 'active',
        progress: 0,
        progressData: {
          videosCompleted: [],
          videosWatched: [],
          timeSpent: 0,
          lastPosition: 0,
          lastVideoId: null,
          completionPercentage: 0,
        },
        notes: [],
        bookmarks: [],
        rating: null,
        certificate: {
          issued: false,
          issuedAt: null,
          url: null,
          verificationCode: null,
          score: null,
        },
        stats: {
          sessionsCount: 0,
          totalWatchTime: 0,
          averageSessionTime: 0,
          streakDays: 0,
          lastStudyDate: null,
        },
        payment: {
          type: paymentType,
          amount: paymentAmount,
          currency: courseData.pricing?.currency || 'BRL',
          transactionId: sanitizedBody.transactionId || null,
          promotionalCode: sanitizedBody.promotionalCode || null,
        },
        enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
        completedAt: null,
        lastAccessAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const enrollmentRef = await db.collection('enrollments').add(enrollmentData);
      const createdEnrollment = {
        id: enrollmentRef.id,
        ...enrollmentData,
      };

      // Update course stats
      await courseDoc.ref.update({
        'stats.enrollmentCount': admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update user stats
      const userStatsRef = db.collection('userStats').doc(userId);
      const userStatsDoc = await userStatsRef.get();

      if (userStatsDoc.exists) {
        await userStatsRef.update({
          'courses.started': admin.firestore.FieldValue.increment(1),
          'courses.inProgress': admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Send enrollment notification
      await db.collection('notifications').add({
        userId,
        type: 'course_enrollment',
        title: 'Inscrição Confirmada!',
        message: `Você foi inscrito no curso "${courseData.title}" com sucesso.`,
        data: { courseId, enrollmentId: enrollmentRef.id },
        actionUrl: `/course/${courseId}`,
        channels: {
          inApp: true,
          email: true,
          push: true,
          sms: false,
        },
        priority: 'normal',
        category: 'learning',
        isRead: false,
        expiresAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Log analytics event
      await db.collection('analyticsEvents').add({
        userId,
        name: 'course_enrolled',
        category: 'engagement',
        properties: {
          courseId,
          courseCategory: courseData.category,
          courseLevel: courseData.level,
          enrollmentId: enrollmentRef.id,
          paymentType,
        },
        metadata: {
          platform: 'web',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        processedAt: null,
      });

      return apiService.createSuccessResponse(
        createdEnrollment,
        'Enrollment successful'
      );
    } catch (error) {
      throw new Error('Failed to create enrollment');
    }
  }, {
    requireAuth: true,
    rateLimit: 20,
    allowedMethods: ['POST']
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return apiService.withApiMiddleware(request, async (userId, userToken) => {
    const courseId = params.id;

    try {
      // Check if user is enrolled
      const enrollmentSnapshot = await db.collection('enrollments')
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .limit(1)
        .get();

      if (enrollmentSnapshot.empty) {
        return apiService.createErrorResponse('Not enrolled in this course', 404);
      }

      const enrollmentDoc = enrollmentSnapshot.docs[0];
      const enrollmentData = {
        id: enrollmentDoc.id,
        ...enrollmentDoc.data()
      };

      // Get course data for additional context
      const courseDoc = await db.collection('courses').doc(courseId).get();
      const courseData = { id: courseDoc.id, ...courseDoc.data() };

      // Calculate additional progress metrics
      const totalVideos = courseData.modules?.reduce((acc: number, module: any) =>
        acc + (module.videos?.length || 0), 0) || 0;

      const completedVideos = enrollmentData.progressData?.videosCompleted?.length || 0;
      const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

      // Get recent activity
      const recentActivitySnapshot = await db.collection('userActivity')
        .where('userId', '==', userId)
        .where('context.courseId', '==', courseId)
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();

      const recentActivity = recentActivitySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const enrichedEnrollment = {
        ...enrollmentData,
        courseInfo: {
          title: courseData.title,
          thumbnail: courseData.thumbnail,
          duration: courseData.duration,
          totalVideos,
          instructorName: courseData.instructorName,
        },
        calculatedProgress: {
          completedVideos,
          totalVideos,
          progressPercentage: Math.round(progressPercentage),
          timeSpentFormatted: formatTime(enrollmentData.progressData?.timeSpent || 0),
        },
        recentActivity,
      };

      return apiService.createSuccessResponse(
        enrichedEnrollment,
        'Enrollment data retrieved successfully'
      );
    } catch (error) {
      throw new Error('Failed to retrieve enrollment');
    }
  }, {
    requireAuth: true,
    rateLimit: 50,
    allowedMethods: ['GET']
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return apiService.withApiMiddleware(request, async (userId, userToken) => {
    const courseId = params.id;

    try {
      // Find enrollment
      const enrollmentSnapshot = await db.collection('enrollments')
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .limit(1)
        .get();

      if (enrollmentSnapshot.empty) {
        return apiService.createErrorResponse('Not enrolled in this course', 404);
      }

      const enrollmentDoc = enrollmentSnapshot.docs[0];
      const enrollmentData = enrollmentDoc.data();

      // Soft delete enrollment
      await enrollmentDoc.ref.update({
        status: 'cancelled',
        cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update course stats
      const courseRef = db.collection('courses').doc(courseId);
      await courseRef.update({
        'stats.enrollmentCount': admin.firestore.FieldValue.increment(-1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update user stats
      const userStatsRef = db.collection('userStats').doc(userId);
      const userStatsDoc = await userStatsRef.get();

      if (userStatsDoc.exists) {
        const currentStats = userStatsDoc.data();
        await userStatsRef.update({
          'courses.inProgress': Math.max(0, currentStats.courses.inProgress - 1),
          'courses.started': Math.max(0, currentStats.courses.started - 1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Send cancellation notification
      await db.collection('notifications').add({
        userId,
        type: 'course_cancellation',
        title: 'Inscrição Cancelada',
        message: 'Sua inscrição no curso foi cancelada conforme solicitado.',
        data: { courseId },
        actionUrl: '/courses',
        channels: {
          inApp: true,
          email: true,
          push: false,
          sms: false,
        },
        priority: 'normal',
        category: 'learning',
        isRead: false,
        expiresAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return apiService.createSuccessResponse(
        { id: enrollmentDoc.id, status: 'cancelled' },
        'Enrollment cancelled successfully'
      );
    } catch (error) {
      throw new Error('Failed to cancel enrollment');
    }
  }, {
    requireAuth: true,
    rateLimit: 10,
    allowedMethods: ['DELETE']
  });
}

// Helper function to format time in seconds to human readable format
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}