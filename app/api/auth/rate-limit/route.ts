import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

// Rate limit configurations for different endpoints
const rateLimitConfigs: Record<string, RateLimitConfig> = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 login attempts per 15 minutes
  signup: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 signup attempts per hour
  passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 password reset attempts per hour
  socialAuth: { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // 10 social auth attempts per 15 minutes
};

function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  // For additional security, you could also include user agent
  const userAgent = request.headers.get('user-agent') || 'unknown';

  return `${ip}-${userAgent}`;
}

function checkRateLimit(
  identifier: string,
  endpoint: string
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = rateLimitConfigs[endpoint];
  if (!config) {
    return { allowed: true, remaining: Infinity, resetTime: 0 };
  }

  const key = `${identifier}-${endpoint}`;
  const now = Date.now();
  const existing = rateLimitMap.get(key);

  if (!existing || now > existing.resetTime) {
    // First request or window expired
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    };
  }

  if (existing.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetTime
    };
  }

  // Increment count
  existing.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetTime: existing.resetTime
  };
}

export function createRateLimitMiddleware(endpoint: string) {
  return async (request: NextRequest) => {
    const identifier = getClientIdentifier(request);
    const result = checkRateLimit(identifier, endpoint);

    // Add rate limit headers
    const headers = {
      'X-RateLimit-Limit': rateLimitConfigs[endpoint]?.maxRequests.toString() || '0',
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
    };

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`,
          resetTime: result.resetTime
        },
        {
          status: 429,
          headers
        }
      );
    }

    return { headers };
  };
}

// Export a function to be used in other API routes
export async function withRateLimit(
  request: NextRequest,
  endpoint: string,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  const rateLimitResult = await createRateLimitMiddleware(endpoint)(request);

  if ('status' in rateLimitResult) {
    return rateLimitResult as NextResponse;
  }

  // Execute the handler with rate limit headers
  const response = await handler(request);

  // Add rate limit headers to the response
  Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}