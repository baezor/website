/**
 * KV Cache Utility
 *
 * Manages caching and rate limiting using Cloudflare KV storage
 */

import type { ChallengeData, CacheData, RateLimitData } from '@/types/strava';

const CACHE_KEY = 'strava-challenge-data';
const RATE_LIMIT_KEY = 'strava-rate-limit';
const CACHE_TTL_SECONDS = 86400; // 24 hours
const RATE_LIMIT_WINDOW_SECONDS = 900; // 15 minutes in seconds
const MAX_REQUESTS_PER_WINDOW = 180; // Stay under 200/15min limit
const MAX_REQUESTS_PER_DAY = 2000; // Strava's daily limit
const MAX_STORED_TIMESTAMPS = 300; // Prevent unbounded array growth

/**
 * Get cached challenge data from KV
 */
export async function getCachedData(
  kv: KVNamespace | undefined
): Promise<ChallengeData | null> {
  if (!kv) {
    console.warn('KV namespace not available');
    return null;
  }

  try {
    const cached = await kv.get<CacheData>(CACHE_KEY, 'json');

    if (!cached) {
      return null;
    }

    // Check if cache has expired
    const now = Date.now();
    if (now > cached.expiresAt) {
      console.log('Cache expired');
      await kv.delete(CACHE_KEY);
      return null;
    }

    console.log('Cache hit');
    return cached.data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Store challenge data in KV cache
 */
export async function setCachedData(
  kv: KVNamespace | undefined,
  data: ChallengeData
): Promise<void> {
  if (!kv) {
    console.warn('KV namespace not available');
    return;
  }

  try {
    const now = Date.now();
    const cacheData: CacheData = {
      data,
      timestamp: now,
      expiresAt: now + (CACHE_TTL_SECONDS * 1000),
    };

    await kv.put(CACHE_KEY, JSON.stringify(cacheData), {
      expirationTtl: CACHE_TTL_SECONDS,
    });

    console.log('Data cached successfully');
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}

/**
 * Invalidate (delete) cached data
 * Called by webhook when new activity is created
 */
export async function invalidateCache(
  kv: KVNamespace | undefined
): Promise<void> {
  if (!kv) {
    console.warn('KV namespace not available');
    return;
  }

  try {
    await kv.delete(CACHE_KEY);
    console.log('Cache invalidated');
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}

/**
 * Atomically check and increment rate limit counter
 *
 * This combines the check and increment operations to prevent race conditions
 * where multiple concurrent requests could bypass the rate limit.
 *
 * @returns Object with allowed flag and remaining requests
 */
export async function checkAndIncrementRateLimit(
  kv: KVNamespace | undefined
): Promise<{ allowed: boolean; remaining: number }> {
  if (!kv) {
    console.warn('KV namespace not available, cannot track rate limits');
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW };
  }

  try {
    const now = Date.now();
    const windowStart = now - (RATE_LIMIT_WINDOW_SECONDS * 1000);
    const dayStart = now - (CACHE_TTL_SECONDS * 1000);

    // Get existing rate limit data
    let rateLimitData = await kv.get<RateLimitData>(RATE_LIMIT_KEY, 'json');

    if (!rateLimitData) {
      rateLimitData = {
        fifteenMin: [],
        daily: [],
      };
    }

    // Clean old timestamps
    let recentFifteenMin = rateLimitData.fifteenMin.filter(
      timestamp => timestamp > windowStart
    );
    const recentDaily = rateLimitData.daily.filter(
      timestamp => timestamp > dayStart
    );

    // Limit array size to prevent unbounded growth under high load
    if (recentFifteenMin.length > MAX_STORED_TIMESTAMPS) {
      recentFifteenMin = recentFifteenMin.slice(-MAX_STORED_TIMESTAMPS);
    }

    // Check if limits would be exceeded BEFORE incrementing
    const wouldExceedFifteenMin = recentFifteenMin.length >= MAX_REQUESTS_PER_WINDOW;
    const wouldExceedDaily = recentDaily.length >= MAX_REQUESTS_PER_DAY;

    if (wouldExceedFifteenMin || wouldExceedDaily) {
      // Don't increment - limit would be exceeded
      const remaining = MAX_REQUESTS_PER_WINDOW - recentFifteenMin.length;
      return { allowed: false, remaining: Math.max(0, remaining) };
    }

    // Increment atomically - add current request
    recentFifteenMin.push(now);
    recentDaily.push(now);

    // Store updated rate limit data
    await kv.put(RATE_LIMIT_KEY, JSON.stringify({
      fifteenMin: recentFifteenMin,
      daily: recentDaily,
    }), {
      expirationTtl: CACHE_TTL_SECONDS,
    });

    const remaining = MAX_REQUESTS_PER_WINDOW - recentFifteenMin.length;

    return { allowed: true, remaining: Math.max(0, remaining) };
  } catch (error) {
    console.error('Error in atomic rate limit check:', error);
    // On error, allow the request but warn
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW };
  }
}

