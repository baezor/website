/**
 * Strava Webhook Endpoint
 *
 * Handles webhook verification (GET) and activity events (POST)
 */

import type { APIRoute } from 'astro';
import { invalidateCache } from '@/utils/kv-cache';

// Development logging helper
const isDev = import.meta.env.DEV;
const log = (...args: any[]) => isDev && console.log(...args);

/**
 * Constant-time string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;

  const encoder = new TextEncoder();
  const bufferA = encoder.encode(a);
  const bufferB = encoder.encode(b);

  let result = 0;
  for (let i = 0; i < bufferA.length; i++) {
    result |= bufferA[i] ^ bufferB[i];
  }
  return result === 0;
}

/**
 * GET - Webhook verification
 * Strava sends this to verify the webhook endpoint
 */
export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  // Get verify token from runtime environment
  const verifyToken = locals.runtime?.env?.STRAVA_WEBHOOK_VERIFY_TOKEN;

  // Verify the webhook subscription using constant-time comparison
  if (mode === 'subscribe' && timingSafeEqual(token, verifyToken)) {
    log('Webhook verified successfully');

    return new Response(
      JSON.stringify({ 'hub.challenge': challenge }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  console.error('Webhook verification failed');
  return new Response('Verification failed', { status: 403 });
};

/**
 * POST - Webhook event handler
 * Strava sends events when activities are created/updated/deleted
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const event = await request.json();

    log('Received webhook event:', event);

    // Event structure:
    // {
    //   object_type: "activity" | "athlete",
    //   object_id: number,
    //   aspect_type: "create" | "update" | "delete",
    //   updates: {},
    //   owner_id: number,
    //   subscription_id: number,
    //   event_time: number
    // }

    // Validate required webhook fields
    if (!event.object_type || !event.aspect_type || typeof event.object_id !== 'number') {
      console.error('Invalid webhook payload - missing required fields:', event);
      return new Response('Invalid payload', { status: 400 });
    }

    // Validate object_type and aspect_type values
    const validObjectTypes = ['activity', 'athlete'];
    const validAspectTypes = ['create', 'update', 'delete'];

    if (!validObjectTypes.includes(event.object_type)) {
      console.error('Invalid object_type:', event.object_type);
      return new Response('Invalid object_type', { status: 400 });
    }

    if (!validAspectTypes.includes(event.aspect_type)) {
      console.error('Invalid aspect_type:', event.aspect_type);
      return new Response('Invalid aspect_type', { status: 400 });
    }

    // Only invalidate cache for activity events
    if (event.object_type === 'activity') {
      log(`Activity ${event.aspect_type} event for activity ${event.object_id}`);

      // Get KV namespace
      const kvStore = locals.runtime?.env?.KV_STRAVA_CACHE;

      // Invalidate cache so next page load fetches fresh data
      await invalidateCache(kvStore);

      log('Cache invalidated due to activity event');
    }

    return new Response('EVENT_RECEIVED', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return new Response('Error processing event', { status: 500 });
  }
};
