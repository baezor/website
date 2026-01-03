/**
 * Strava API Type Definitions
 *
 * These types define the structure of data from the Strava API and our processed data.
 */

// OAuth token response from Strava
export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: {
    id: number;
    username: string;
    resource_state: number;
    firstname: string;
    lastname: string;
  };
}

// Activity summary from Strava API
export interface StravaActivity {
  id: number;
  name: string;
  distance: number;  // meters
  moving_time: number;  // seconds
  elapsed_time: number;  // seconds
  total_elevation_gain: number;  // meters
  type: string;  // "Run", "Ride", etc.
  start_date: string;  // ISO 8601 format
  start_date_local: string;  // ISO 8601 format in local timezone
  timezone: string;
  average_speed: number;  // meters per second
  max_speed: number;  // meters per second
  kudos_count: number;
  achievement_count: number;
  athlete: {
    id: number;
  };
}

// Processed challenge data for display
export interface ChallengeData {
  totalKm: number;
  goalKm: number;
  percentComplete: number;
  remainingKm: number;
  remainingDays: number;
  kmPerDayNeeded: number;
  daysElapsed: number;
  actualDailyAverage: number;
  expectedKmByToday: number;
  aheadBehindKm: number;
  isOnTrack: boolean;
  activities: ProcessedActivity[];
  dailyStats: DailyStats[];
  lastUpdated: string;  // ISO 8601 timestamp
}

// Simplified activity for display
export interface ProcessedActivity {
  id: number;
  name: string;
  date: string;  // YYYY-MM-DD format
  distanceKm: number;
  durationMinutes: number;
  paceMinPerKm: number;
}

// Daily statistics for calendar heatmap
export interface DailyStats {
  date: string;  // YYYY-MM-DD
  distanceKm: number;
  activityCount: number;
}

// Cache structure stored in KV
export interface CacheData {
  data: ChallengeData;
  timestamp: number;
  expiresAt: number;
}

// Rate limit tracking structure
export interface RateLimitData {
  fifteenMin: number[];  // Array of timestamps
  daily: number[];  // Array of timestamps
}
