/**
 * COURSE DETAIL API - COMUNIDADE FLIX
 * Individual course operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api/core.service';
import { db } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return apiService.withApiMiddleware(request, async (userId, userToken) => {
    const courseId = params.id;

    try {
      const courseDoc = await db.collection('courses').doc(courseId).get();

      if (!courseDoc.exists) {
        return apiService.createErrorResponse('Course not found', 404);
      }

      const courseData = { id: courseDoc.id, ...courseDoc.data() };

      // Check access permissions
      const isInstructor = courseData.instructorId === userId;
      const isAdmin = apiService.isAdmin(userToken);
      const hasOrgAccess = apiService.hasOrganizationAccess(userToken, courseData.organizationId);

      // Check if user is enrolled
      let isEnrolled = false;
      let enrollmentData = null;

      if (userId) {
        const enrollmentSnapshot = await db.collection('enrollments')
          .where('userId', '==', userId)
          .where('courseId', '==', courseId)
          .limit(1)
          .get();

        if (!enrollmentSnapshot.empty) {
          isEnrolled = true;
          enrollmentData = {
            id: enrollmentSnapshot.docs[0].id,
            ...enrollmentSnapshot.docs[0].data()
          };
        }
      }

      // Check visibility rules
      if (!isAdmin && !isInstructor && !hasOrgAccess) {
        if (courseData.status !== 'published') {
          return apiService.createErrorResponse('Course not available', 403);
        }

        if (courseData.visibility === 'private') {
          return apiService.createErrorResponse('Access denied', 403);
        }

        if (courseData.visibility === 'organization' && !hasOrgAccess) {
          return apiService.createErrorResponse('Access denied', 403);
        }
      }

      // Filter sensitive data
      const responseCourse = {
        ...courseData,
        // Always include basic info
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        instructorId: courseData.instructorId,
        instructorName: courseData.instructorName,
        category: courseData.category,
        level: courseData.level,
        thumbnail: courseData.thumbnail,
        duration: courseData.duration,
        status: courseData.status,
        visibility: courseData.visibility,
        tags: courseData.tags,
        objectives: courseData.objectives,
        requirements: courseData.requirements,
        skills: courseData.skills,
        pricing: courseData.pricing,
        stats: {
          enrollmentCount: courseData.stats?.enrollmentCount || 0,
          averageRating: courseData.stats?.averageRating || 0,
          ratingCount: courseData.stats?.ratingCount || 0,
        },
        // Conditional data
        ...(isEnrolled || isInstructor || isAdmin ? {
          modules: courseData.modules || [],
          certificate: courseData.certificate,
        } : {}),
        ...(isInstructor || isAdmin ? {
          settings: courseData.settings || {},
          seo: courseData.seo || {},
          metadata: courseData.metadata || {},
        } : {}),
        // Enrollment info
        isEnrolled,
        isInstructor,
        enrollmentData,
      };

      return apiService.createSuccessResponse(responseCourse);
    } catch (error) {
      throw new Error('Failed to retrieve course');
    }
  }, {
    requireAuth: true,
    rateLimit: 50,
    allowedMethods: ['GET']
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return apiService.withApiMiddleware(request, async (userId, userToken) => {
    const courseId = params.id;
    const body = await request.json();
    const sanitizedBody = apiService.sanitizeInput(body);

    try {
      const courseDoc = await db.collection('courses').doc(courseId).get();

      if (!courseDoc.exists) {
        return apiService.createErrorResponse('Course not found', 404);
      }

      const courseData = courseDoc.data();

      // Check permissions
      const isInstructor = courseData.instructorId === userId;
      const isAdmin = apiService.isAdmin(userToken);
      const isOrgAdmin = apiService.hasOrganizationAccess(userToken, courseData.organizationId);

      if (!isInstructor && !isAdmin && !isOrgAdmin) {
        return apiService.createErrorResponse('Access denied', 403);
      }

      // Validate updates
      const validationErrors = [];

      if (sanitizedBody.title && !apiService.validateStringLength(sanitizedBody.title, 5, 200)) {
        validationErrors.push('Title must be between 5 and 200 characters');
      }

      if (sanitizedBody.description && !apiService.validateStringLength(sanitizedBody.description, 10, 2000)) {
        validationErrors.push('Description must be between 10 and 2000 characters');
      }

      if (validationErrors.length > 0) {
        return apiService.createValidationErrorResponse(validationErrors);
      }

      // Prepare update data
      const updateData: any = {
        ...sanitizedBody,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Handle status changes
      if (sanitizedBody.status === 'published' && courseData.status !== 'published') {
        updateData.publishedAt = admin.firestore.FieldValue.serverTimestamp();
      }

      // Handle SEO slug generation if title changed
      if (sanitizedBody.title && sanitizedBody.title !== courseData.title) {
        updateData.seo = {
          ...courseData.seo,
          slug: sanitizedBody.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
          metaTitle: sanitizedBody.title,
          metaDescription: sanitizedBody.description?.substring(0, 160) || courseData.seo?.metaDescription,
        };
      }

      // Restrict certain fields to admins only
      if (!isAdmin && !isOrgAdmin) {
        delete updateData.organizationId;
        delete updateData.instructorId;
      }

      await courseDoc.ref.update(updateData);

      // Get updated course
      const updatedDoc = await courseDoc.ref.get();
      const updatedCourse = { id: updatedDoc.id, ...updatedDoc.data() };

      return apiService.createSuccessResponse(
        updatedCourse,
        'Course updated successfully'
      );
    } catch (error) {
      throw new Error('Failed to update course');
    }
  }, {
    requireAuth: true,
    rateLimit: 20,
    allowedMethods: ['PUT']
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return apiService.withApiMiddleware(request, async (userId, userToken) => {
    const courseId = params.id;

    try {
      const courseDoc = await db.collection('courses').doc(courseId).get();

      if (!courseDoc.exists) {
        return apiService.createErrorResponse('Course not found', 404);
      }

      const courseData = courseDoc.data();

      // Check permissions
      const isInstructor = courseData.instructorId === userId;
      const isAdmin = apiService.isAdmin(userToken);
      const isOrgAdmin = apiService.hasOrganizationAccess(userToken, courseData.organizationId);

      if (!isInstructor && !isAdmin && !isOrgAdmin) {
        return apiService.createErrorResponse('Access denied', 403);
      }

      // Check if course has enrollments
      const enrollmentsSnapshot = await db.collection('enrollments')
        .where('courseId', '==', courseId)
        .limit(1)
        .get();

      if (!enrollmentsSnapshot.empty) {
        // Soft delete instead of hard delete if there are enrollments
        await courseDoc.ref.update({
          status: 'deleted',
          deletedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return apiService.createSuccessResponse(
          { id: courseId, status: 'deleted' },
          'Course soft deleted successfully'
        );
      } else {
        // Hard delete if no enrollments
        await courseDoc.ref.delete();

        // Delete related data
        const batch = db.batch();

        // Delete videos
        const videosSnapshot = await db.collection('videos')
          .where('courseId', '==', courseId)
          .get();

        videosSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });

        // Delete search index
        const searchIndexRef = db.collection('searchIndexes').doc(courseId);
        batch.delete(searchIndexRef);

        await batch.commit();

        return apiService.createSuccessResponse(
          { id: courseId, deleted: true },
          'Course deleted successfully'
        );
      }
    } catch (error) {
      throw new Error('Failed to delete course');
    }
  }, {
    requireAuth: true,
    rateLimit: 10,
    allowedMethods: ['DELETE']
  });
}