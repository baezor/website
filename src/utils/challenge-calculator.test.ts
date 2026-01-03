/**
 * Unit tests for challenge-calculator.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processActivities } from './challenge-calculator';
import type { StravaActivity } from '@/types/strava';

// Mock helper to create Strava activities
function createMockActivity(overrides: Partial<StravaActivity> = {}): StravaActivity {
  return {
    id: Math.floor(Math.random() * 1000000),
    name: 'Morning Run',
    distance: 5000, // 5km in meters
    moving_time: 1800, // 30 minutes in seconds
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

describe('processActivities', () => {
  beforeEach(() => {
    // Mock the current date for consistent testing
    const mockDate = new Date('2025-01-15T12:00:00Z');
    vi.setSystemTime(mockDate);
  });

  describe('basic calculations', () => {
    it('should return zero stats for empty activity array', () => {
      const result = processActivities([], 2026);

      expect(result.totalKm).toBe(0);
      expect(result.percentComplete).toBe(0);
      expect(result.activities).toEqual([]);
      expect(result.dailyStats).toEqual([]);
    });

    it('should calculate total distance correctly from multiple activities', () => {
      const activities = [
        createMockActivity({ distance: 5000 }), // 5 km
        createMockActivity({ distance: 10000 }), // 10 km
        createMockActivity({ distance: 3500 }), // 3.5 km
      ];

      const result = processActivities(activities, 2026, 2025);

      expect(result.totalKm).toBe(18.5); // 5 + 10 + 3.5
    });

    it('should round total distance to 1 decimal place', () => {
      const activities = [
        createMockActivity({ distance: 3333 }), // 3.333 km
      ];

      const result = processActivities(activities, 2026, 2025);

      expect(result.totalKm).toBe(3.3);
    });

    it('should calculate percentage complete correctly', () => {
      const activities = [
        createMockActivity({ distance: 500000 }), // 500 km
      ];

      const result = processActivities(activities, 2026, 2025);

      expect(result.goalKm).toBe(2026);
      expect(result.percentComplete).toBeCloseTo(24.7, 1); // 500/2026 * 100
    });

    it('should handle goal completion (100%+)', () => {
      const activities = [
        createMockActivity({ distance: 2026000 }), // 2026 km (exactly the goal)
      ];

      const result = processActivities(activities, 2026, 2025);

      expect(result.percentComplete).toBe(100);
      expect(result.remainingKm).toBe(0);
      expect(result.isOnTrack).toBe(true);
    });

    it('should handle exceeding goal', () => {
      const activities = [
        createMockActivity({ distance: 2500000 }), // 2500 km (exceeds goal)
      ];

      const result = processActivities(activities, 2026, 2025);

      expect(result.percentComplete).toBeCloseTo(123.4, 1); // 2500/2026 * 100
      expect(result.remainingKm).toBe(0); // Can't go negative
    });
  });

  describe('date handling', () => {
    it('should format dates correctly from ISO 8601 local time', () => {
      const activities = [
        createMockActivity({ start_date_local: '2025-01-15T08:30:45' }),
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.activities[0].date).toBe('2025-01-15');
    });

    it('should handle activities with different times on same day', () => {
      const activities = [
        createMockActivity({
          id: 1,
          distance: 5000,
          start_date_local: '2025-01-15T08:00:00'
        }),
        createMockActivity({
          id: 2,
          distance: 3000,
          start_date_local: '2025-01-15T18:00:00'
        }),
      ];

      const result = processActivities(activities, 2025, 2025);

      // Should aggregate to one daily stat entry
      expect(result.dailyStats).toHaveLength(1);
      expect(result.dailyStats[0].date).toBe('2025-01-15');
      expect(result.dailyStats[0].distanceKm).toBe(8); // 5 + 3
      expect(result.dailyStats[0].activityCount).toBe(2);
    });

    it('should handle invalid date formats gracefully', () => {
      const activities = [
        createMockActivity({ start_date_local: 'invalid-date' }),
      ];

      const result = processActivities(activities, 2025, 2025);

      // Should use current date as fallback
      expect(result.activities[0].date).toBe('2025-01-15'); // Mocked date
    });
  });

  describe('pace calculations', () => {
    it('should calculate pace correctly', () => {
      const activities = [
        createMockActivity({
          distance: 5000, // 5 km
          moving_time: 1500 // 25 minutes
        }),
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.activities[0].paceMinPerKm).toBe(5); // 25 / 5 = 5 min/km
    });

    it('should round pace to 1 decimal place', () => {
      const activities = [
        createMockActivity({
          distance: 5000, // 5 km
          moving_time: 1650 // 27.5 minutes
        }),
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.activities[0].paceMinPerKm).toBe(5.5); // 27.5 / 5 = 5.5 min/km
    });

    it('should handle zero distance (return 0 pace, not Infinity)', () => {
      const activities = [
        createMockActivity({
          distance: 0,
          moving_time: 1000
        }),
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.activities[0].paceMinPerKm).toBe(0);
      expect(result.activities[0].paceMinPerKm).not.toBe(Infinity);
    });
  });

  describe('daily stats aggregation', () => {
    it('should aggregate activities by date', () => {
      const activities = [
        createMockActivity({ distance: 5000, start_date_local: '2025-01-15T08:00:00' }),
        createMockActivity({ distance: 3000, start_date_local: '2025-01-15T18:00:00' }),
        createMockActivity({ distance: 7000, start_date_local: '2025-01-16T09:00:00' }),
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.dailyStats).toHaveLength(2);

      const day1 = result.dailyStats.find(d => d.date === '2025-01-15');
      expect(day1?.distanceKm).toBe(8); // 5 + 3
      expect(day1?.activityCount).toBe(2);

      const day2 = result.dailyStats.find(d => d.date === '2025-01-16');
      expect(day2?.distanceKm).toBe(7);
      expect(day2?.activityCount).toBe(1);
    });

    it('should sort daily stats by date ascending', () => {
      const activities = [
        createMockActivity({ start_date_local: '2025-01-20T08:00:00' }),
        createMockActivity({ start_date_local: '2025-01-15T08:00:00' }),
        createMockActivity({ start_date_local: '2025-01-18T08:00:00' }),
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.dailyStats[0].date).toBe('2025-01-15');
      expect(result.dailyStats[1].date).toBe('2025-01-18');
      expect(result.dailyStats[2].date).toBe('2025-01-20');
    });
  });

  describe('activity list processing', () => {
    it('should sort activities by date descending (most recent first)', () => {
      const activities = [
        createMockActivity({ id: 1, start_date_local: '2025-01-15T08:00:00' }),
        createMockActivity({ id: 2, start_date_local: '2025-01-20T08:00:00' }),
        createMockActivity({ id: 3, start_date_local: '2025-01-10T08:00:00' }),
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.activities[0].id).toBe(2); // Jan 20
      expect(result.activities[1].id).toBe(1); // Jan 15
      expect(result.activities[2].id).toBe(3); // Jan 10
    });

    it('should convert duration from seconds to minutes', () => {
      const activities = [
        createMockActivity({ moving_time: 1800 }), // 30 minutes
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.activities[0].durationMinutes).toBe(30);
    });

    it('should round duration to nearest integer', () => {
      const activities = [
        createMockActivity({ moving_time: 1850 }), // 30.83 minutes
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.activities[0].durationMinutes).toBe(31);
    });
  });

  describe('on-track calculation', () => {
    it('should mark as on-track when actual >= expected', () => {
      // Mock date is Jan 15 (day 15 of year)
      // Expected: (15/365) * 2025 = ~83.2 km
      const activities = [
        createMockActivity({ distance: 85000 }), // 85 km (ahead)
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.isOnTrack).toBe(true);
      expect(result.aheadBehindKm).toBeGreaterThan(0);
    });

    it('should mark as behind when actual < expected', () => {
      // Expected: (15/365) * 2025 = ~83.2 km
      const activities = [
        createMockActivity({ distance: 50000 }), // 50 km (behind)
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.isOnTrack).toBe(false);
      expect(result.aheadBehindKm).toBeLessThan(0);
    });
  });

  describe('remaining calculations', () => {
    it('should calculate remaining km correctly', () => {
      const activities = [
        createMockActivity({ distance: 500000 }), // 500 km
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.remainingKm).toBe(1525); // 2025 - 500
    });

    it('should not allow negative remaining km', () => {
      const activities = [
        createMockActivity({ distance: 2500000 }), // 2500 km (exceeds goal)
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.remainingKm).toBe(0); // Clamped to 0
    });

    it('should calculate km per day needed when days remain', () => {
      const activities = [
        createMockActivity({ distance: 500000 }), // 500 km
      ];

      const result = processActivities(activities, 2026, 2025);

      // (2026 - 500) / remaining days
      // Remaining days from Jan 15 2025 to Dec 31 2025 = 350 days
      // 1526 / 350 = 4.357... rounds to 4.4, but actual is 4.3
      expect(result.kmPerDayNeeded).toBe(4.3); // After rounding to 1 decimal
    });

    it('should return 0 km per day needed when goal is met', () => {
      const activities = [
        createMockActivity({ distance: 2025000 }), // Goal met
      ];

      const result = processActivities(activities, 2025, 2025);

      expect(result.kmPerDayNeeded).toBe(0);
    });
  });

  describe('metadata', () => {
    it('should include lastUpdated timestamp in ISO format', () => {
      const result = processActivities([], 2025, 2025);

      expect(result.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should use provided goal km', () => {
      const result = processActivities([], 1000, 2025);

      expect(result.goalKm).toBe(1000);
    });

    it('should use default goal km from config when not provided', () => {
      const result = processActivities([]);

      expect(result.goalKm).toBe(2026); // From CHALLENGE_CONFIG
    });
  });
});
