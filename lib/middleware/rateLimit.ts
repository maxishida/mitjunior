import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    lastRequest: number;
  };
}

class RateLimiter {
  private static instance: RateLimiter;
  private store: RateLimitStore = {};
  private readonly defaultLimits = {
    // Public endpoints (achievements, leaderboard)
    public: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
    // User-specific endpoints (user stats, achievements)
    user: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200, // limit each user to 200 requests per windowMs
    },
    // Sensitive endpoints (certificate generation)
    sensitive: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // limit each user to 10 certificate generations per hour
    },
    // Admin endpoints
    admin: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // limit each admin to 500 requests per windowMs
    },
  };

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public checkRateLimit(
    identifier: string,
    category: keyof typeof RateLimiter.prototype['defaultLimits'] = 'public'
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const limit = this.defaultLimits[category];
    const now = Date.now();
    const windowStart = now - limit.windowMs;

    // Clean up old entries
    this.cleanup(windowStart);

    let record = this.store[identifier];

    if (!record || record.resetTime <= now) {
      // Create new record or reset expired record
      record = {
        count: 1,
        resetTime: now + limit.windowMs,
        lastRequest: now,
      };
      this.store[identifier] = record;
      return {
        allowed: true,
        remaining: limit.max - 1,
        resetTime: record.resetTime,
      };
    }

    // Update existing record
    record.count += 1;
    record.lastRequest = now;

    const allowed = record.count <= limit.max;
    const remaining = Math.max(0, limit.max - record.count);

    return {
      allowed,
      remaining,
      resetTime: record.resetTime,
    };
  }

  private cleanup(cutoffTime: number): void {
    for (const key in this.store) {
      if (this.store[key].resetTime <= cutoffTime) {
        delete this.store[key];
      }
    }
  }

  public getStoreSize(): number {
    return Object.keys(this.store).length;
  }

  public clearStore(): void {
    this.store = {};
  }
}

export function createRateLimitMiddleware(category: keyof typeof RateLimiter.prototype['defaultLimits'] = 'public') {
  const rateLimiter = RateLimiter.getInstance();

  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Get identifier (IP address for public, user ID for authenticated)
    let identifier = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Try to get user ID from token for user-specific limits
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split('Bearer ')[1];
        const { auth } = await import('@/lib/firebase-admin');
        const decodedToken = await auth.verifyIdToken(token);
        if (decodedToken) {
          identifier = `user:${decodedToken.uid}`;

          // Upgrade to admin limits if user is admin
          if (decodedToken.admin && category === 'user') {
            category = 'admin';
          }
        }
      } catch (error) {
        // Invalid token, continue with IP-based limiting
        console.warn('Invalid auth token in rate limiting:', error);
      }
    } else if (category !== 'public') {
      identifier = `ip:${identifier}`;
    }

    const result = rateLimiter.checkRateLimit(identifier, category);

    // Create response with rate limit headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', String(rateLimiter['defaultLimits'][category].max));
    headers.set('X-RateLimit-Remaining', String(result.remaining));
    headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));

    if (!result.allowed) {
      headers.set('Retry-After', String(Math.ceil((result.resetTime - Date.now()) / 1000)));

      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`,
        }),
        {
          status: 429,
          headers,
        }
      );
    }

    return null; // Continue to the actual handler
  };
}

// Specific middleware functions for different endpoint types
export const publicRateLimit = createRateLimitMiddleware('public');
export const userRateLimit = createRateLimitMiddleware('user');
export const sensitiveRateLimit = createRateLimitMiddleware('sensitive');
export const adminRateLimit = createRateLimitMiddleware('admin');

// Rate limit configuration for specific endpoints
export const rateLimitConfig = {
  // Achievement endpoints
  '/api/achievements': publicRateLimit,
  '/api/user/achievements': userRateLimit,

  // User stats endpoints
  '/api/user/stats': userRateLimit,

  // Certificate endpoints
  '/api/certificates/generate': sensitiveRateLimit,

  // Leaderboard endpoints
  '/api/leaderboard': publicRateLimit,

  // Default to public rate limiting
  'default': publicRateLimit,
};

// Enhanced rate limiting with different strategies
export class AdvancedRateLimiter {
  private static instance: AdvancedRateLimiter;
  private requestCounts: Map<string, number[]> = new Map();
  private readonly windows = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
  };

  public static getInstance(): AdvancedRateLimiter {
    if (!AdvancedRateLimiter.instance) {
      AdvancedRateLimiter.instance = new AdvancedRateLimiter();
    }
    return AdvancedRateLimiter.instance;
  }

  public checkSlidingWindow(
    identifier: string,
    maxRequests: number,
    windowSize: number
  ): boolean {
    const now = Date.now();
    const windowStart = now - windowSize;

    let timestamps = this.requestCounts.get(identifier) || [];

    // Remove old timestamps outside the window
    timestamps = timestamps.filter(timestamp => timestamp > windowStart);

    // Check if under limit
    if (timestamps.length >= maxRequests) {
      return false;
    }

    // Add current request
    timestamps.push(now);
    this.requestCounts.set(identifier, timestamps);

    return true;
  }

  public checkTokenBucket(
    identifier: string,
    capacity: number,
    refillRate: number
  ): boolean {
    const key = `bucket:${identifier}`;
    const now = Date.now();

    let bucket = this.getBucketData(key);
    if (!bucket) {
      bucket = {
        tokens: capacity,
        lastRefill: now,
      };
    }

    // Refill tokens based on time passed
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(timePassed * refillRate / 1000);

    bucket.tokens = Math.min(capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      this.setBucketData(key, bucket);
      return true;
    }

    this.setBucketData(key, bucket);
    return false;
  }

  private getBucketData(key: string): { tokens: number; lastRefill: number } | null {
    // In a real implementation, this would use Redis or another persistent store
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private setBucketData(key: string, data: { tokens: number; lastRefill: number }): void {
    // In a real implementation, this would use Redis or another persistent store
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Silently fail if localStorage is not available
    }
  }
}

export const advancedRateLimiter = AdvancedRateLimiter.getInstance();