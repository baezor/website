/**
 * Strava API Client
 *
 * Handles OAuth token refresh and activity fetching from Strava API
 */

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
    const error = await response.text();
    throw new Error(`Failed to refresh Strava token: ${response.status} ${error}`);
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
 * Handles pagination automatically
 */
export async function fetchActivitiesSinceDate(
  accessToken: string,
  startDate: Date,
  page: number = 1,
  perPage: number = 200
): Promise<StravaActivity[]> {
  const startTimestamp = Math.floor(startDate.getTime() / 1000);

  const url = new URL(STRAVA_ACTIVITIES_URL);
  url.searchParams.set('after', startTimestamp.toString());
  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', perPage.toString());

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch Strava activities: ${response.status} ${error}`);
  }

  const data = await response.json();

  // Validate activities response
  if (!Array.isArray(data)) {
    throw new Error('Invalid activities response from Strava API - expected array');
  }

  // Validate each activity has required fields
  const activities: StravaActivity[] = data.filter(activity => {
    if (!activity || typeof activity !== 'object') {
      console.warn('Skipping invalid activity object');
      return false;
    }
    if (!activity.id || !activity.name || !activity.type || !activity.distance) {
      console.warn('Skipping activity with missing required fields:', activity.id);
      return false;
    }
    return true;
  });

  // If we got a full page, there might be more activities
  if (activities.length === perPage) {
    const nextActivities = await fetchActivitiesSinceDate(
      accessToken,
      startDate,
      page + 1,
      perPage
    );
    return [...activities, ...nextActivities];
  }

  return activities;
}

/**
 * Main function to get all running and walking activities for the challenge
 */
export async function getRunningActivities(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  challengeYear: number = 2026
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
