/**
 * CORE API SERVICE - COMUNIDADE FLIX
 * Serviço central para APIs REST escaláveis
 */

import { db, auth } from '../firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ApiService {
  private static instance: ApiService;

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // ======== AUTHENTICATION & AUTHORIZATION ========

  /**
   * Verify and decode JWT token from request
   */
  async verifyAuth(request: NextRequest): Promise<{ uid: string; token: any }> {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await auth.verifyIdToken(token);

      if (!decodedToken) {
        throw new Error('Invalid token');
      }

      return {
        uid: decodedToken.uid,
        token: decodedToken
      };
    } catch (error) {
      throw new Error('Failed to verify authentication token');
    }
  }

  /**
   * Check if user has required role
   */
  hasRole(userToken: any, requiredRole: string): boolean {
    return userToken.role === requiredRole ||
           userToken.admin === true ||
           userToken.role === 'super_admin';
  }

  /**
   * Check if user is admin or has specific permissions
   */
  isAdmin(userToken: any): boolean {
    return this.hasRole(userToken, 'admin') ||
           this.hasRole(userToken, 'super_admin');
  }

  /**
   * Check organization access
   */
  hasOrganizationAccess(userToken: any, organizationId: string): boolean {
    return this.isAdmin(userToken) ||
           userToken.organizationId === organizationId;
  }

  // ======== RESPONSE FORMATTING ========

  /**
   * Create standardized success response
   */
  createSuccessResponse<T>(
    data: T,
    message?: string,
    pagination?: any
  ): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
        ...(pagination && { pagination })
      }
    });
  }

  /**
   * Create standardized error response
   */
  createErrorResponse(
    error: string,
    statusCode: number = 400,
    details?: any
  ): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      error,
      ...(details && { details })
    }, { status: statusCode });
  }

  /**
   * Create validation error response
   */
  createValidationErrorResponse(errors: string[]): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      error: 'Validation failed',
      details: { errors }
    }, { status: 400 });
  }

  // ======== PAGINATION & QUERYING ========

  /**
   * Parse pagination parameters from request
   */
  parsePaginationParams(request: NextRequest): PaginationParams {
    const { searchParams } = new URL(request.url);

    return {
      page: Math.max(1, parseInt(searchParams.get('page') || '1')),
      limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20'))),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    };
  }

  /**
   * Apply pagination to Firestore query
   */
  async paginateQuery<T>(
    query: any,
    pagination: PaginationParams
  ): Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const offset = (page - 1) * limit;

    // Get total count
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Apply pagination
    let paginatedQuery = query
      .orderBy(sortBy, sortOrder)
      .offset(offset)
      .limit(limit);

    const snapshot = await paginatedQuery.get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Build Firestore query from URL parameters
   */
  buildQuery(
    collection: string,
    searchParams: URLSearchParams,
    userId?: string
  ) {
    let query = db.collection(collection);

    // Apply filters
    searchParams.forEach((value, key) => {
      if (key.startsWith('where.')) {
        const [, field, operator] = key.split('.');

        switch (operator) {
          case 'eq':
            query = query.where(field, '==', this.parseValue(value));
            break;
          case 'ne':
            query = query.where(field, '!=', this.parseValue(value));
            break;
          case 'gt':
            query = query.where(field, '>', this.parseValue(value));
            break;
          case 'gte':
            query = query.where(field, '>=', this.parseValue(value));
            break;
          case 'lt':
            query = query.where(field, '<', this.parseValue(value));
            break;
          case 'lte':
            query = query.where(field, '<=', this.parseValue(value));
            break;
          case 'in':
            query = query.where(field, 'in', value.split(',').map(v => this.parseValue(v.trim())));
            break;
          case 'array-contains':
            query = query.where(field, 'array-contains', this.parseValue(value));
            break;
        }
      }
    });

    // Apply user filtering for security
    if (userId) {
      query = query.where('userId', '==', userId);
    }

    return query;
  }

  /**
   * Parse string value to appropriate type
   */
  private parseValue(value: string): any {
    // Boolean
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Number
    if (/^\d+$/.test(value)) return parseInt(value);
    if (/^\d+\.\d+$/.test(value)) return parseFloat(value);

    // Timestamp
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return new Date(value);
    }

    return value;
  }

  // ======== VALIDATION ========

  /**
   * Validate required fields
   */
  validateRequiredFields(data: any, requiredFields: string[]): string[] {
    const errors: string[] = [];

    requiredFields.forEach(field => {
      if (!data[field] || data[field] === '') {
        errors.push(`Field '${field}' is required`);
      }
    });

    return errors;
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate string length
   */
  validateStringLength(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  }

  /**
   * Validate numeric range
   */
  validateNumberRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  // ======== ERROR HANDLING ========

  /**
   * Handle API errors consistently
   */
  handleApiError(error: any): NextResponse<ApiResponse> {
    console.error('API Error:', error);

    // Firebase errors
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          return this.createErrorResponse('Permission denied', 403);
        case 'not-found':
          return this.createErrorResponse('Resource not found', 404);
        case 'already-exists':
          return this.createErrorResponse('Resource already exists', 409);
        case 'invalid-argument':
          return this.createErrorResponse('Invalid argument provided', 400);
        case 'resource-exhausted':
          return this.createErrorResponse('Resource limit exceeded', 429);
        default:
          return this.createErrorResponse('Internal server error', 500);
      }
    }

    // Network errors
    if (error.name === 'NetworkError') {
      return this.createErrorResponse('Network error occurred', 503);
    }

    // Validation errors
    if (error.name === 'ValidationError') {
      return this.createValidationErrorResponse(error.errors);
    }

    // Default error
    return this.createErrorResponse(
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message || 'Unknown error occurred',
      500
    );
  }

  // ======== UTILITIES ========

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitize input data
   */
  sanitizeInput(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Remove potentially dangerous characters
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]*>/g, '')
          .trim();
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => this.sanitizeInput(item));
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeInput(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Rate limiting check (basic implementation)
   */
  async checkRateLimit(
    userId: string,
    endpoint: string,
    limit: number = 100,
    windowMs: number = 60000 // 1 minute
  ): Promise<boolean> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);

    // Check recent requests
    const requestsSnapshot = await db.collection('rateLimits')
      .where('userId', '==', userId)
      .where('endpoint', '==', endpoint)
      .where('timestamp', '>=', windowStart)
      .count()
      .get();

    const requestCount = requestsSnapshot.data().count;

    if (requestCount >= limit) {
      return false;
    }

    // Log this request
    await db.collection('rateLimits').add({
      userId,
      endpoint,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      requestId: this.generateRequestId()
    });

    return true;
  }

  /**
   * Log API requests for monitoring
   */
  async logApiRequest(
    userId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    error?: string
  ): Promise<void> {
    try {
      await db.collection('apiLogs').add({
        userId,
        endpoint,
        method,
        statusCode,
        responseTime,
        error,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        metadata: {
          userAgent: '', // Would need to extract from request
          ipAddress: '', // Would need to extract from request
        }
      });
    } catch (logError) {
      // Don't let logging errors break the API
      console.error('Failed to log API request:', logError);
    }
  }

  /**
   * Create API middleware wrapper
   */
  async withApiMiddleware(
    request: NextRequest,
    handler: (userId: string, userToken: any) => Promise<NextResponse>,
    options: {
      requireAuth?: boolean;
      requireAdmin?: boolean;
      rateLimit?: number;
      allowedMethods?: string[];
    } = {}
  ): Promise<NextResponse> {
    const startTime = Date.now();

    try {
      // Check method
      if (options.allowedMethods && !options.allowedMethods.includes(request.method)) {
        return this.createErrorResponse('Method not allowed', 405);
      }

      // Authentication
      let userId: string | null = null;
      let userToken: any = null;

      if (options.requireAuth !== false) {
        const auth = await this.verifyAuth(request);
        userId = auth.uid;
        userToken = auth.token;

        // Admin check
        if (options.requireAdmin && !this.isAdmin(userToken)) {
          return this.createErrorResponse('Admin access required', 403);
        }
      }

      // Rate limiting
      if (userId && options.rateLimit) {
        const endpoint = new URL(request.url).pathname;
        const allowed = await this.checkRateLimit(userId, endpoint, options.rateLimit);

        if (!allowed) {
          return this.createErrorResponse('Rate limit exceeded', 429);
        }
      }

      // Execute handler
      const response = await handler(userId!, userToken);

      // Log request
      const responseTime = Date.now() - startTime;
      await this.logApiRequest(
        userId || 'anonymous',
        new URL(request.url).pathname,
        request.method,
        response.status,
        responseTime
      );

      return response;

    } catch (error) {
      // Log error
      const responseTime = Date.now() - startTime;
      await this.logApiRequest(
        'anonymous',
        new URL(request.url).pathname,
        request.method,
        500,
        responseTime,
        error.message
      );

      return this.handleApiError(error);
    }
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();