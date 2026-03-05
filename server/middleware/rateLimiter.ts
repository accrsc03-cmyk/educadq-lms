/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and abuse
 */

interface RateLimitStore {
  [key: string]: {
    attempts: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 15 minutes)
  maxAttempts?: number; // Max attempts per window (default: 5)
  keyGenerator?: (req: any) => string; // Function to generate rate limit key
}

/**
 * Create rate limiter middleware
 */
export function createRateLimiter(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxAttempts = options.maxAttempts || 5;
  const keyGenerator = options.keyGenerator || ((req: any) => req.ip || "unknown");

  return (req: any, res: any, next: any) => {
    const key = keyGenerator(req);
    const now = Date.now();

    // Clean up expired entries
    if (store[key] && store[key].resetTime < now) {
      delete store[key];
    }

    // Initialize or increment attempts
    if (!store[key]) {
      store[key] = {
        attempts: 1,
        resetTime: now + windowMs,
      };
    } else {
      store[key].attempts++;
    }

    // Set headers
    res.setHeader("RateLimit-Limit", maxAttempts);
    res.setHeader("RateLimit-Remaining", Math.max(0, maxAttempts - store[key].attempts));
    res.setHeader("RateLimit-Reset", Math.ceil(store[key].resetTime / 1000));

    // Check if limit exceeded
    if (store[key].attempts > maxAttempts) {
      res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
      });
      return;
    }

    next();
  };
}

/**
 * Login rate limiter (stricter)
 */
export function createLoginRateLimiter() {
  return createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5, // 5 attempts
    keyGenerator: (req: any) => `login:${req.body?.email || req.ip}`,
  });
}

/**
 * API rate limiter (general)
 */
export function createApiRateLimiter() {
  return createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 100, // 100 requests per minute
    keyGenerator: (req: any) => `api:${req.ip}`,
  });
}

/**
 * Payment rate limiter (very strict)
 */
export function createPaymentRateLimiter() {
  return createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 10, // 10 payment attempts per hour
    keyGenerator: (req: any) => `payment:${req.user?.id || req.ip}`,
  });
}

/**
 * Check if IP/user is rate limited
 */
export function isRateLimited(key: string): boolean {
  const entry = store[key];
  if (!entry) return false;

  const now = Date.now();
  if (entry.resetTime < now) {
    delete store[key];
    return false;
  }

  return true;
}

/**
 * Get rate limit info
 */
export function getRateLimitInfo(key: string) {
  const entry = store[key];
  if (!entry) return null;

  const now = Date.now();
  if (entry.resetTime < now) {
    delete store[key];
    return null;
  }

  return {
    attempts: entry.attempts,
    resetTime: entry.resetTime,
    remainingTime: entry.resetTime - now,
  };
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
  delete store[key];
}

/**
 * Clear all rate limits
 */
export function clearAllRateLimits(): void {
  Object.keys(store).forEach((key) => {
    delete store[key];
  });
}
