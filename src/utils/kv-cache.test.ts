/**
 * Unit tests for kv-cache.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCachedData, setCachedData, invalidateCache, checkAndIncrementRateLimit } from './kv-cache';
import type { ChallengeData, CacheData, RateLimitData } from '@/types/strava';

// Mock KV namespace
function createMockKV(): KVNamespace {
  const store = new Map<string, any>();

  return {
    get: vi.fn(async (key: string, type?: string) => {
      const value = store.get(key);
      if (!value) return null;
      return type === 'json' ? JSON.parse(value) : value;
    }),
    put: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    delete: vi.fn(async (key: string) => {
      store.delete(key);
    }),
    // Add other required KV methods as no-ops
    list: vi.fn(),
    getWithMetadata: vi.fn(),
  } as any;
}

// Mock challenge data
function createMockChallengeData(): ChallengeData {
  return {
    totalKm: 150.5,
    goalKm: 2025,
    percentComplete: 7.4,
    remainingKm: 1874.5,
    remainingDays: 350,
    kmPerDayNeeded: 5.4,
    daysElapsed: 15,
    actualDailyAverage: 10.0,
    expectedKmByToday: 83.2,
    aheadBehindKm: 67.3,
    isOnTrack: true,
    activities: [],
    dailyStats: [],
    lastUpdated: new Date().toISOString(),
  };
}

describe('getCachedData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when KV namespace is undefined', async () => {
    const result = await getCachedData(undefined);
    expect(result).toBeNull();
  });

  it('should return null when cache is empty', async () => {
    const kv = createMockKV();
    const result = await getCachedData(kv);

    expect(result).toBeNull();
    expect(kv.get).toHaveBeenCalledWith('strava-challenge-data', 'json');
  });

  it('should return cached data when cache is valid', async () => {
    const kv = createMockKV();
    const challengeData = createMockChallengeData();
    const now = Date.now();

    const cacheData: CacheData = {
      data: challengeData,
      timestamp: now,
      expiresAt: now + 86400000, // 24 hours from now
    };

    await kv.put('strava-challenge-data', JSON.stringify(cacheData));

    const result = await getCachedData(kv);

    expect(result).toEqual(challengeData);
  });

  it('should return null and delete cache when expired', async () => {
    const kv = createMockKV();
    const challengeData = createMockChallengeData();
    const now = Date.now();

    const cacheData: CacheData = {
      data: challengeData,
      timestamp: now - 100000000, // Long ago
      expiresAt: now - 1000, // Expired 1 second ago
    };

    await kv.put('strava-challenge-data', JSON.stringify(cacheData));

    const result = await getCachedData(kv);

    expect(result).toBeNull();
    expect(kv.delete).toHaveBeenCalledWith('strava-challenge-data');
  });

  it('should handle errors gracefully and return null', async () => {
    const kv = createMockKV();
    (kv.get as any).mockRejectedValueOnce(new Error('KV read error'));

    const result = await getCachedData(kv);

    expect(result).toBeNull();
  });
});

describe('setCachedData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
  });

  it('should do nothing when KV namespace is undefined', async () => {
    const challengeData = createMockChallengeData();

    await setCachedData(undefined, challengeData);

    // Should not throw error
  });

  it('should store data with correct structure and TTL', async () => {
    const kv = createMockKV();
    const challengeData = createMockChallengeData();
    const now = Date.now();

    await setCachedData(kv, challengeData);

    expect(kv.put).toHaveBeenCalled();
    const putCall = (kv.put as any).mock.calls[0];
    const key = putCall[0];
    const value = JSON.parse(putCall[1]);
    const options = putCall[2];

    expect(key).toBe('strava-challenge-data');
    expect(value.data).toEqual(challengeData);
    expect(value.timestamp).toBeCloseTo(now, -2); // Within ~100ms
    expect(value.expiresAt).toBeCloseTo(now + 86400000, -2); // 24 hours
    expect(options.expirationTtl).toBe(86400); // 24 hours in seconds
  });

  it('should handle errors gracefully', async () => {
    const kv = createMockKV();
    (kv.put as any).mockRejectedValueOnce(new Error('KV write error'));

    const challengeData = createMockChallengeData();

    await setCachedData(kv, challengeData);

    // Should not throw error
  });
});

describe('invalidateCache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do nothing when KV namespace is undefined', async () => {
    await invalidateCache(undefined);

    // Should not throw error
  });

  it('should delete cache entry', async () => {
    const kv = createMockKV();

    await invalidateCache(kv);

    expect(kv.delete).toHaveBeenCalledWith('strava-challenge-data');
  });

  it('should handle errors gracefully', async () => {
    const kv = createMockKV();
    (kv.delete as any).mockRejectedValueOnce(new Error('KV delete error'));

    await invalidateCache(kv);

    // Should not throw error
  });
});

describe('checkAndIncrementRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
  });

  it('should allow request when KV namespace is undefined', async () => {
    const result = await checkAndIncrementRateLimit(undefined);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(180);
  });

  it('should allow first request and initialize rate limit data', async () => {
    const kv = createMockKV();

    const result = await checkAndIncrementRateLimit(kv);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(179); // 180 - 1

    expect(kv.put).toHaveBeenCalled();
    const putCall = (kv.put as any).mock.calls[0];
    const value: RateLimitData = JSON.parse(putCall[1]);

    expect(value.fifteenMin).toHaveLength(1);
    expect(value.daily).toHaveLength(1);
  });

  it('should allow request when under limit', async () => {
    const kv = createMockKV();
    const now = Date.now();

    const rateLimitData: RateLimitData = {
      fifteenMin: Array(50).fill(now - 60000), // 50 requests in last minute
      daily: Array(500).fill(now - 3600000), // 500 requests in last hour
    };

    await kv.put('strava-rate-limit', JSON.stringify(rateLimitData));

    const result = await checkAndIncrementRateLimit(kv);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThan(0);
  });

  it('should block request when 15-minute limit exceeded', async () => {
    const kv = createMockKV();
    const now = Date.now();

    const rateLimitData: RateLimitData = {
      fifteenMin: Array(180).fill(now - 60000), // 180 requests (at limit)
      daily: Array(180).fill(now - 60000),
    };

    await kv.put('strava-rate-limit', JSON.stringify(rateLimitData));

    const result = await checkAndIncrementRateLimit(kv);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should block request when daily limit exceeded', async () => {
    const kv = createMockKV();
    const now = Date.now();

    const rateLimitData: RateLimitData = {
      fifteenMin: Array(50).fill(now - 60000),
      daily: Array(2000).fill(now - 3600000), // 2000 requests (at daily limit)
    };

    await kv.put('strava-rate-limit', JSON.stringify(rateLimitData));

    const result = await checkAndIncrementRateLimit(kv);

    expect(result.allowed).toBe(false);
  });

  it('should clean up old timestamps outside 15-minute window', async () => {
    const kv = createMockKV();
    const now = Date.now();
    const oldTimestamp = now - (16 * 60 * 1000); // 16 minutes ago (outside window)

    const rateLimitData: RateLimitData = {
      fifteenMin: [oldTimestamp, now - 60000, now - 120000], // 1 old, 2 recent
      daily: [now - 60000],
    };

    await kv.put('strava-rate-limit', JSON.stringify(rateLimitData));

    const result = await checkAndIncrementRateLimit(kv);

    expect(result.allowed).toBe(true);

    // Check that old timestamp was filtered out
    const putCall = (kv.put as any).mock.calls[0];
    const updatedData: RateLimitData = JSON.parse(putCall[1]);

    // Should have 2 old + 1 new = 3 recent timestamps (old one removed)
    expect(updatedData.fifteenMin.length).toBe(3);
  });

  it('should prevent unbounded array growth under high load', async () => {
    const kv = createMockKV();
    const now = Date.now();

    // Create scenario where rate limit would be exceeded
    // 180 requests is at the limit for 15-minute window
    const rateLimitData: RateLimitData = {
      fifteenMin: Array(180).fill(now - (5 * 60 * 1000)), // 180 at limit
      daily: Array(180).fill(now - (60 * 1000)),
    };

    await kv.put('strava-rate-limit', JSON.stringify(rateLimitData));

    const result = await checkAndIncrementRateLimit(kv);

    // Should block since we're at limit (180)
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);

    // Verify it doesn't store unbounded data - should NOT have added new timestamp
    // Since request was blocked, no new data should be written
    expect(kv.put).toHaveBeenCalledTimes(1); // Only our manual put, not from function
  });

  it('should handle errors gracefully and allow request', async () => {
    const kv = createMockKV();
    (kv.get as any).mockRejectedValueOnce(new Error('KV read error'));

    const result = await checkAndIncrementRateLimit(kv);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(180);
  });

  it('should correctly calculate remaining requests', async () => {
    const kv = createMockKV();
    const now = Date.now();

    const rateLimitData: RateLimitData = {
      fifteenMin: Array(100).fill(now - 60000), // 100 requests
      daily: Array(100).fill(now - 60000),
    };

    await kv.put('strava-rate-limit', JSON.stringify(rateLimitData));

    const result = await checkAndIncrementRateLimit(kv);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(79); // 180 - 100 - 1 (current)
  });
});
