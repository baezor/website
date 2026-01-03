/**
 * Unit tests for strava-api.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { refreshAccessToken, fetchActivitiesSinceDate, getRunningActivities } from './strava-api';
import type { StravaTokenResponse, StravaActivity } from '@/types/strava';

// Mock fetch globally
global.fetch = vi.fn();

// Mock helper to create token response
function createMockTokenResponse(overrides: Partial<StravaTokenResponse> = {}): StravaTokenResponse {
  return {
    token_type: 'Bearer',
    expires_at: Date.now() / 1000 + 21600,
    expires_in: 21600,
    refresh_token: 'new_refresh_token_xyz',
    access_token: 'access_token_abc123',
    athlete: {
      id: 12345,
      username: 'testuser',
      resource_state: 2,
      firstname: 'Test',
      lastname: 'User',
    },
    ...overrides,
  };
}

// Mock helper to create activity
function createMockActivity(overrides: Partial<StravaActivity> = {}): StravaActivity {
  return {
    id: Math.floor(Math.random() * 1000000),
    name: 'Morning Run',
    distance: 5000,
    moving_time: 1800,
    elapsed_time: 1850,
    total_elevation_gain: 50,
    type: 'Run',
    start_date: '2025-01-15T08:00:00Z',
    start_date_local: '2025-01-15T08:00:00',
    timezone: '(GMT-05:00) America/New_York',
    average_speed: 2.78,
    max_speed: 4.5,
    kudos_count: 5,
    achievement_count: 2,
    athlete: { id: 12345 },
    ...overrides,
  };
}

describe('refreshAccessToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully refresh token with valid credentials', async () => {
    const mockResponse = createMockTokenResponse();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await refreshAccessToken('client_id', 'client_secret', 'refresh_token');

    expect(result.access_token).toBe('access_token_abc123');
    expect(result.refresh_token).toBe('new_refresh_token_xyz');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.strava.com/oauth/token',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"grant_type":"refresh_token"'),
      })
    );
  });

  it('should throw error on HTTP error response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(
      refreshAccessToken('bad_id', 'bad_secret', 'bad_token')
    ).rejects.toThrow('Failed to refresh Strava token');
  });

  it('should throw error on invalid token response (missing access_token)', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ refresh_token: 'abc' }), // Missing access_token
    });

    await expect(
      refreshAccessToken('client_id', 'client_secret', 'refresh_token')
    ).rejects.toThrow('Invalid token response from Strava API');
  });

  it('should throw error on invalid token response (missing refresh_token)', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'xyz' }), // Missing refresh_token
    });

    await expect(
      refreshAccessToken('client_id', 'client_secret', 'refresh_token')
    ).rejects.toThrow('Invalid token response from Strava API');
  });

  it('should throw error on non-object response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    });

    await expect(
      refreshAccessToken('client_id', 'client_secret', 'refresh_token')
    ).rejects.toThrow('Invalid token response from Strava API');
  });
});

describe('fetchActivitiesSinceDate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch activities from single page', async () => {
    const mockActivities = [
      createMockActivity({ id: 1 }),
      createMockActivity({ id: 2 }),
      createMockActivity({ id: 3 }),
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockActivities,
    });

    const startDate = new Date('2025-01-01T00:00:00Z');
    const result = await fetchActivitiesSinceDate('access_token', startDate);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(1);
    expect(result[2].id).toBe(3);

    const callUrl = (global.fetch as any).mock.calls[0][0];
    expect(callUrl).toContain('after=');
    expect(callUrl).toContain('page=1');
    expect(callUrl).toContain('per_page=200');
  });

  it('should fetch activities from multiple pages', async () => {
    const page1 = Array(200).fill(null).map((_, i) => createMockActivity({ id: i + 1 }));
    const page2 = Array(150).fill(null).map((_, i) => createMockActivity({ id: i + 201 }));

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page2,
      });

    const startDate = new Date('2025-01-01T00:00:00Z');
    const result = await fetchActivitiesSinceDate('access_token', startDate);

    expect(result).toHaveLength(350); // 200 + 150
    expect(global.fetch).toHaveBeenCalledTimes(2);

    // Check pagination
    const call1Url = (global.fetch as any).mock.calls[0][0];
    const call2Url = (global.fetch as any).mock.calls[1][0];
    expect(call1Url).toContain('page=1');
    expect(call2Url).toContain('page=2');
  });

  it('should stop pagination when receiving partial page', async () => {
    const page1 = Array(200).fill(null).map((_, i) => createMockActivity({ id: i + 1 }));
    const page2 = Array(50).fill(null).map((_, i) => createMockActivity({ id: i + 201 })); // Partial page

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page2,
      });

    const result = await fetchActivitiesSinceDate('access_token', new Date('2025-01-01'));

    expect(result).toHaveLength(250);
    expect(global.fetch).toHaveBeenCalledTimes(2); // Should not request page 3
  });

  it('should enforce MAX_PAGES limit (50 pages)', async () => {
    // Mock 50 full pages + would-be 51st page
    const fullPage = Array(200).fill(null).map(() => createMockActivity());

    (global.fetch as any).mockImplementation(() => ({
      ok: true,
      json: async () => fullPage,
    }));

    const result = await fetchActivitiesSinceDate('access_token', new Date('2025-01-01'));

    expect(global.fetch).toHaveBeenCalledTimes(50); // Should stop at MAX_PAGES
    expect(result).toHaveLength(10000); // 50 pages * 200
  });

  it('should throw error on HTTP error response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(
      fetchActivitiesSinceDate('bad_token', new Date('2025-01-01'))
    ).rejects.toThrow('Failed to fetch Strava activities');
  });

  it('should throw error on non-array response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: 'Invalid response' }),
    });

    await expect(
      fetchActivitiesSinceDate('access_token', new Date('2025-01-01'))
    ).rejects.toThrow('Invalid activities response from Strava API - expected array');
  });

  it('should filter out activities with missing required fields', async () => {
    const mockActivities = [
      createMockActivity({ id: 1 }), // Valid
      { id: 2, name: 'Test', type: 'Run' }, // Missing distance
      createMockActivity({ id: 3 }), // Valid
      { id: 4, distance: 5000 }, // Missing name and type
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockActivities,
    });

    const result = await fetchActivitiesSinceDate('access_token', new Date('2025-01-01'));

    expect(result).toHaveLength(2); // Only 2 valid activities
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(3);
  });

  it('should filter out activities with invalid distance', async () => {
    const mockActivities = [
      createMockActivity({ id: 1, distance: 5000 }), // Valid
      createMockActivity({ id: 2, distance: -100 }), // Negative distance
      createMockActivity({ id: 3, distance: NaN }), // NaN distance
      createMockActivity({ id: 4, distance: 1000 }), // Valid
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockActivities,
    });

    const result = await fetchActivitiesSinceDate('access_token', new Date('2025-01-01'));

    expect(result).toHaveLength(2); // Only activities 1 and 4
    expect(result.map(a => a.id)).toEqual([1, 4]);
  });

  it('should throw error when all activities fail validation', async () => {
    const mockActivities = [
      { id: 1 }, // Missing all required fields
      { id: 2 }, // Missing all required fields
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockActivities,
    });

    await expect(
      fetchActivitiesSinceDate('access_token', new Date('2025-01-01'))
    ).rejects.toThrow('All 2 activities failed validation');
  });

  it('should correctly construct query parameters', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const startDate = new Date('2025-01-01T00:00:00Z');
    await fetchActivitiesSinceDate('access_token', startDate, 100);

    const callUrl = (global.fetch as any).mock.calls[0][0];
    expect(callUrl).toContain('after=1735689600'); // Unix timestamp for Jan 1, 2025
    expect(callUrl).toContain('per_page=100');
    expect(callUrl).toContain('page=1');
  });

  it('should include authorization header', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchActivitiesSinceDate('test_token_xyz', new Date('2025-01-01'));

    const callHeaders = (global.fetch as any).mock.calls[0][1].headers;
    expect(callHeaders.Authorization).toBe('Bearer test_token_xyz');
  });
});

describe('getRunningActivities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and filter only Run and Walk activities', async () => {
    const mockToken = createMockTokenResponse();
    const mockActivities = [
      createMockActivity({ id: 1, type: 'Run' }),
      createMockActivity({ id: 2, type: 'Walk' }),
      createMockActivity({ id: 3, type: 'Ride' }), // Should be filtered out
      createMockActivity({ id: 4, type: 'Run' }),
      createMockActivity({ id: 5, type: 'Swim' }), // Should be filtered out
    ];

    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => mockToken })
      .mockResolvedValueOnce({ ok: true, json: async () => mockActivities });

    const result = await getRunningActivities('client_id', 'client_secret', 'refresh_token', 2025);

    expect(result).toHaveLength(3); // Only Run and Walk
    expect(result.map(a => a.id)).toEqual([1, 2, 4]);
  });

  it('should use correct year for activity filtering', async () => {
    const mockToken = createMockTokenResponse();

    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => mockToken })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    await getRunningActivities('client_id', 'client_secret', 'refresh_token', 2024);

    // Check that fetchActivitiesSinceDate was called with 2024-01-01
    const activitiesCallUrl = (global.fetch as any).mock.calls[1][0];
    const timestamp2024 = Math.floor(new Date('2024-01-01T00:00:00Z').getTime() / 1000);
    expect(activitiesCallUrl).toContain(`after=${timestamp2024}`);
  });

  it('should propagate errors from refreshAccessToken', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(
      getRunningActivities('bad_id', 'bad_secret', 'bad_token')
    ).rejects.toThrow('Failed to refresh Strava token');
  });

  it('should propagate errors from fetchActivitiesSinceDate', async () => {
    const mockToken = createMockTokenResponse();

    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => mockToken })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Server error',
      });

    await expect(
      getRunningActivities('client_id', 'client_secret', 'refresh_token')
    ).rejects.toThrow('Failed to fetch Strava activities');
  });
});
