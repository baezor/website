/**
 * Server-only Strava API wrapper
 *
 * This module ensures Strava credentials are never exposed to the client bundle.
 * All credential access is isolated to server-side execution context.
 */

import { getRunningActivities } from '@/utils/strava-api';
import type { StravaActivity } from '@/types/strava';

/**
 * Cloudflare runtime context type
 */
interface CloudflareRuntime {
  env?: {
    STRAVA_CLIENT_ID?: string;
    STRAVA_CLIENT_SECRET?: string;
    STRAVA_REFRESH_TOKEN?: string;
    KV_STRAVA_CACHE?: KVNamespace;
    STRAVA_WEBHOOK_VERIFY_TOKEN?: string;
  };
}

/**
 * Validate that a string is not empty or whitespace-only
 */
const isValidString = (str: string | undefined | null): str is string => {
  return typeof str === 'string' && str.trim().length > 0;
};

/**
 * Fetch Strava running activities with server-side credentials
 *
 * @param runtime - Cloudflare runtime context with environment variables
 * @param challengeYear - Year for the running challenge
 * @returns Array of running activities
 * @throws Error if credentials are missing
 */
export async function fetchStravaData(
  runtime: CloudflareRuntime,
  challengeYear: number
): Promise<StravaActivity[]> {
  // Extract credentials from runtime environment (server-side only)
  const clientId = runtime?.env?.STRAVA_CLIENT_ID;
  const clientSecret = runtime?.env?.STRAVA_CLIENT_SECRET;
  const refreshToken = runtime?.env?.STRAVA_REFRESH_TOKEN;

  // Validate all required credentials are present and non-empty
  if (!isValidString(clientId) || !isValidString(clientSecret) || !isValidString(refreshToken)) {
    throw new Error('Missing required Strava API credentials. Please configure environment variables.');
  }

  // Call Strava API with validated credentials
  return await getRunningActivities(clientId, clientSecret, refreshToken, challengeYear);
}
