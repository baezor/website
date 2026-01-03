/**
 * Challenge Calculator
 *
 * Processes Strava activities into challenge statistics for display
 */

import type {
  StravaActivity,
  ChallengeData,
  ProcessedActivity,
  DailyStats,
} from '@/types/strava';

/**
 * Convert meters to kilometers
 */
function metersToKm(meters: number): number {
  return meters / 1000;
}

/**
 * Convert seconds to minutes
 */
function secondsToMinutes(seconds: number): number {
  return seconds / 60;
}

/**
 * Calculate pace in minutes per kilometer
 */
function calculatePace(distanceKm: number, durationMinutes: number): number {
  if (distanceKm === 0) return 0;
  return durationMinutes / distanceKm;
}

/**
 * Format date to YYYY-MM-DD
 * Uses the date string directly to avoid timezone conversion issues
 */
function formatDate(dateString: string): string {
  // Validate ISO 8601 format (YYYY-MM-DDTHH:MM:SS...)
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  if (!iso8601Regex.test(dateString)) {
    console.warn('Invalid date format, using current date:', dateString);
    return new Date().toISOString().split('T')[0];
  }

  // dateString from Strava is already in local timezone (start_date_local)
  // Just extract the date portion without timezone conversion
  return dateString.split('T')[0];
}

/**
 * Calculate days elapsed since start of year
 */
function getDaysElapsed(year: number): number {
  const now = new Date();
  const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
  const diffTime = now.getTime() - startOfYear.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays); // Minimum 1 day to avoid division by zero
}

/**
 * Calculate days remaining in the year
 */
function getRemainingDays(year: number): number {
  const now = new Date();
  const endOfYear = new Date(`${year}-12-31T23:59:59Z`);
  const diffTime = endOfYear.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Calculate daily statistics for calendar heatmap
 */
function calculateDailyStats(activities: StravaActivity[]): DailyStats[] {
  const dailyMap = new Map<string, DailyStats>();

  for (const activity of activities) {
    const date = formatDate(activity.start_date_local);
    const existing = dailyMap.get(date);

    if (existing) {
      existing.distanceKm += metersToKm(activity.distance);
      existing.activityCount += 1;
    } else {
      dailyMap.set(date, {
        date,
        distanceKm: metersToKm(activity.distance),
        activityCount: 1,
      });
    }
  }

  // Convert to array and sort by date
  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Process Strava activities into a ProcessedActivity array
 */
function processActivityList(activities: StravaActivity[]): ProcessedActivity[] {
  return activities
    .map(activity => {
      const distanceKm = metersToKm(activity.distance);
      const durationMinutes = secondsToMinutes(activity.moving_time);

      return {
        id: activity.id,
        name: activity.name,
        date: formatDate(activity.start_date_local),
        distanceKm: Math.round(distanceKm * 10) / 10, // Round to 1 decimal
        durationMinutes: Math.round(durationMinutes),
        paceMinPerKm: Math.round(calculatePace(distanceKm, durationMinutes) * 10) / 10,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date)); // Most recent first
}

/**
 * Main function to process activities into challenge data
 */
export function processActivities(
  activities: StravaActivity[],
  goalKm: number = 2026,
  challengeYear: number = 2026
): ChallengeData {
  // Calculate total distance
  const totalKm = activities.reduce((sum, activity) => {
    return sum + metersToKm(activity.distance);
  }, 0);

  // Calculate progress percentage
  const percentComplete = (totalKm / goalKm) * 100;

  // Calculate remaining stats
  const remainingKm = Math.max(0, goalKm - totalKm);
  const remainingDays = getRemainingDays(challengeYear);

  // Calculate days elapsed
  const daysElapsed = getDaysElapsed(challengeYear);

  // Calculate actual daily average
  const actualDailyAverage = totalKm / daysElapsed;

  // Calculate required daily pace for remaining days
  const kmPerDayNeeded = remainingDays > 0 ? remainingKm / remainingDays : 0;

  // Calculate expected progress: where you SHOULD be by today
  const expectedKmByToday = (daysElapsed / 365) * goalKm;

  // Calculate how many km ahead or behind schedule
  const aheadBehindKm = totalKm - expectedKmByToday;

  // Determine if on track (actual >= expected)
  const isOnTrack = totalKm >= expectedKmByToday;

  // Process activities for display
  const processedActivities = processActivityList(activities);

  // Calculate daily stats for heatmap
  const dailyStats = calculateDailyStats(activities);

  return {
    totalKm: Math.round(totalKm * 10) / 10, // Round to 1 decimal
    goalKm,
    percentComplete: Math.round(percentComplete * 10) / 10, // Round to 1 decimal
    remainingKm: Math.round(remainingKm * 10) / 10,
    remainingDays,
    kmPerDayNeeded: Math.round(kmPerDayNeeded * 10) / 10,
    daysElapsed,
    actualDailyAverage: Math.round(actualDailyAverage * 10) / 10,
    expectedKmByToday: Math.round(expectedKmByToday * 10) / 10,
    aheadBehindKm: Math.round(aheadBehindKm * 10) / 10,
    isOnTrack,
    activities: processedActivities,
    dailyStats,
    lastUpdated: new Date().toISOString(),
  };
}
