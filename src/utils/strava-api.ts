/**
 * Strava API Client
 *
 * Handles OAuth token refresh and activity fetching from Strava API
 */

import { CHALLENGE_CONFIG } from '@/const';
import type { StravaTokenResponse, StravaActivity } from '@/types/strava';

const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities';

/**
 * Refresh the access token using the refresh token
 */
export async function refreshAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<StravaTokenResponse> {
  const response = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Sanitize error messages in production to avoid leaking sensitive information
    const safeError = import.meta.env.DEV ? errorText : 'Authentication failed';
    throw new Error(`Failed to refresh Strava token: ${response.status} ${safeError}`);
  }

  const data = await response.json();

  // Validate token response
  if (!data || typeof data !== 'object' || !data.access_token || !data.refresh_token) {
    throw new Error('Invalid token response from Strava API');
  }

  return data;
}

/**
 * Fetch activities from Strava since a specific date
 * Handles pagination automatically using iterative approach
 */
export async function fetchActivitiesSinceDate(
  accessToken: string,
  startDate: Date,
  perPage: number = 200
): Promise<StravaActivity[]> {
  const MAX_PAGES = 50; // Safety limit: 50 pages * 200/page = 10,000 activities max
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const allActivities: StravaActivity[] = [];

  let currentPage = 1;
  let hasMorePages = true;

  while (hasMorePages && currentPage <= MAX_PAGES) {
    const url = new URL(STRAVA_ACTIVITIES_URL);
    url.searchParams.set('after', startTimestamp.toString());
    url.searchParams.set('page', currentPage.toString());
    url.searchParams.set('per_page', perPage.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Sanitize error messages in production to avoid leaking sensitive information
      const safeError = import.meta.env.DEV ? errorText : 'Request failed';
      throw new Error(`Failed to fetch Strava activities: ${response.status} ${safeError}`);
    }

    const data = await response.json();

    // Validate activities response
    if (!Array.isArray(data)) {
      throw new Error('Invalid activities response from Strava API - expected array');
    }

    // Validate each activity has required fields
    const validActivities: StravaActivity[] = data.filter(activity => {
      if (!activity || typeof activity !== 'object') {
        console.warn('Skipping invalid activity object');
        return false;
      }
      if (!activity.id || !activity.name || !activity.type || !activity.distance) {
        console.warn('Skipping activity with missing required fields:', activity.id || 'unknown');
        return false;
      }
      // Validate distance is a valid number
      if (typeof activity.distance !== 'number' || isNaN(activity.distance) || activity.distance < 0) {
        console.warn('Skipping activity with invalid distance:', activity.id, activity.distance);
        return false;
      }
      return true;
    });

    // Validate that filtering didn't remove all activities
    // This could indicate an API schema change or data corruption
    if (data.length > 0 && validActivities.length === 0) {
      throw new Error(
        `All ${data.length} activities failed validation - possible Strava API schema change. ` +
        'Check activity data structure.'
      );
    }

    allActivities.push(...validActivities);

    // Check if there are more pages
    // If we got fewer activities than requested, we've reached the end
    hasMorePages = validActivities.length === perPage;
    currentPage++;
  }

  // Warn if we hit the max page limit (unlikely but possible)
  if (currentPage > MAX_PAGES) {
    console.warn(
      `Reached maximum page limit (${MAX_PAGES} pages). ` +
      `Fetched ${allActivities.length} activities. Some activities may be missing.`
    );
  }

  return allActivities;
}

/**
 * Main function to get all running and walking activities for the challenge
 */
export async function getRunningActivities(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  challengeYear: number = CHALLENGE_CONFIG.YEAR
): Promise<StravaActivity[]> {
  try {
    // Step 1: Refresh access token
    const tokenData = await refreshAccessToken(clientId, clientSecret, refreshToken);

    // Step 2: Fetch all activities since start of challenge year
    const startDate = new Date(`${challengeYear}-01-01T00:00:00Z`);
    const allActivities = await fetchActivitiesSinceDate(tokenData.access_token, startDate);

    // Step 3: Filter for running and walking activities
    const runningActivities = allActivities.filter(
      activity => activity.type === 'Run' || activity.type === 'Walk'
    );

    return runningActivities;
  } catch (error) {
    console.error('Error fetching running activities:', error);
    throw error;
  }
}
