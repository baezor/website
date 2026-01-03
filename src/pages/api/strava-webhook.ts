/**
 * Strava Webhook Endpoint
 *
 * Handles webhook verification (GET) and activity events (POST)
 */

import type { APIRoute } from 'astro';
import { invalidateCache } from '@/utils/kv-cache';

/**
 * GET - Webhook verification
 * Strava sends this to verify the webhook endpoint
 */
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  // Verify the webhook subscription
  if (mode === 'subscribe' && token === import.meta.env.STRAVA_WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');

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

    console.log('Received webhook event:', event);

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
      console.log(`Activity ${event.aspect_type} event for activity ${event.object_id}`);

      // Get KV namespace
      const kvStore = locals.runtime?.env?.KV_STRAVA_CACHE;

      // Invalidate cache so next page load fetches fresh data
      await invalidateCache(kvStore);

      console.log('Cache invalidated due to activity event');
    }

    return new Response('EVENT_RECEIVED', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return new Response('Error processing event', { status: 500 });
  }
};
