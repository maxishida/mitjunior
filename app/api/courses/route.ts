/**
 * COURSES API - COMUNIDADE FLIX
 * CRUD operations for courses management
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api/core.service';
import { db } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  return apiService.withApiMiddleware(request, async (userId, userToken) => {
    const pagination = apiService.parsePaginationParams(request);
    const { searchParams } = new URL(request.url);

    // Build query
    let query = apiService.buildQuery('courses', searchParams);

    // Apply visibility rules
    if (!apiService.isAdmin(userToken)) {
      // Non-admins can only see published courses
      query = query.where('status', '==', 'published');

      // Check organization access
      if (searchParams.get('organizationId')) {
        const orgId = searchParams.get('organizationId');
        if (!apiService.hasOrganizationAccess(userToken, orgId)) {
          return apiService.createErrorResponse('Access denied', 403);
        }
      }
    }

    // Apply search filter
    const search = searchParams.get('search');
    if (search) {
      // This would require a more complex search implementation
      // For now, we'll filter by title containing the search term
      query = query.where('title', '>=', search)
                  .where('title', '<=', search + '\uf8ff');
    }

    // Apply category filter
    const category = searchParams.get('category');
    if (category) {
      query = query.where('category', '==', category);
    }

    // Apply level filter
    const level = searchParams.get('level');
    if (level) {
      query = query.where('level', '==', level);
    }

    // Apply instructor filter
    const instructorId = searchParams.get('instructorId');
    if (instructorId) {
      query = query.where('instructorId', '==', instructorId);
    }

    // Execute query with pagination
    const { data, pagination: paginationMeta } = await apiService.paginateQuery(
      query,
      pagination
    );

    // Filter results based on enrollment if user is authenticated
    let courses = data;
    if (userId && !apiService.isAdmin(userToken)) {
      courses = await Promise.all(data.map(async (course: any) => {
        // Check if user is enrolled
        const enrollmentSnapshot = await db.collection('enrollments')
          .where('userId', '==', userId)
          .where('courseId', '==', course.id)
          .limit(1)
          .get();

        const isEnrolled = !enrollmentSnapshot.empty;

        // Check if user is the instructor
        const isInstructor = course.instructorId === userId;

        return {
          ...course,
          isEnrolled,
          isInstructor,
          // Hide sensitive data for non-enrolled users
          modules: isEnrolled || isInstructor ? course.modules : [],
          settings: isInstructor ? course.settings : {},
        };
      }));
    }

    return apiService.createSuccessResponse(
      courses,
      'Courses retrieved successfully',
      paginationMeta
    );
  }, {
    requireAuth: true,
    rateLimit: 100,
    allowedMethods: ['GET']
  });
}

export async function POST(request: NextRequest) {
  return apiService.withApiMiddleware(request, async (userId, userToken) => {
    const body = await request.json();
    const sanitizedBody = apiService.sanitizeInput(body);

    // Validate required fields
    const validationErrors = apiService.validateRequiredFields(sanitizedBody, [
      'title',
      'description',
      'category',
      'level',
    ]);

    if (validationErrors.length > 0) {
      return apiService.createValidationErrorResponse(validationErrors);
    }

    // Validate field lengths
    if (!apiService.validateStringLength(sanitizedBody.title, 5, 200)) {
      validationErrors.push('Title must be between 5 and 200 characters');
    }

    if (!apiService.validateStringLength(sanitizedBody.description, 10, 2000)) {
      validationErrors.push('Description must be between 10 and 2000 characters');
    }

    if (validationErrors.length > 0) {
      return apiService.createValidationErrorResponse(validationErrors);
    }

    // Validate category and level
    const validCategories = ['investment', 'budgeting', 'credit', 'retirement', 'taxes', 'insurance', 'cryptocurrency', 'real_estate'];
    const validLevels = ['beginner', 'intermediate', 'advanced', 'all_levels'];

    if (!validCategories.includes(sanitizedBody.category)) {
      return apiService.createErrorResponse('Invalid category', 400);
    }

    if (!validLevels.includes(sanitizedBody.level)) {
      return apiService.createErrorResponse('Invalid level', 400);
    }

    // Prepare course data
    const courseData = {
      ...sanitizedBody,
      instructorId: userId,
      organizationId: userToken.organizationId || 'default',
      status: 'draft',
      visibility: sanitizedBody.visibility || 'organization',
      stats: {
        enrollmentCount: 0,
        completionCount: 0,
        averageRating: 0,
        ratingCount: 0,
        totalWatchTime: 0,
        averageCompletion: 0,
      },
      seo: {
        slug: sanitizedBody.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        metaTitle: sanitizedBody.title,
        metaDescription: sanitizedBody.description.substring(0, 160),
        keywords: sanitizedBody.tags || [],
      },
      settings: {
        allowComments: sanitizedBody.settings?.allowComments ?? true,
        allowDownload: sanitizedBody.settings?.allowDownload ?? false,
        certificateEnabled: sanitizedBody.settings?.certificateEnabled ?? false,
        autoProgress: sanitizedBody.settings?.autoProgress ?? true,
        prerequisiteCourses: sanitizedBody.settings?.prerequisiteCourses || [],
        ...sanitizedBody.settings,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishedAt: null,
    };

    try {
      const docRef = await db.collection('courses').add(courseData);
      const createdCourse = {
        id: docRef.id,
        ...courseData,
      };

      return apiService.createSuccessResponse(
        createdCourse,
        'Course created successfully',
        undefined
      );
    } catch (error) {
      throw new Error('Failed to create course');
    }
  }, {
    requireAuth: true,
    rateLimit: 10,
    allowedMethods: ['POST']
  });
}