/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Ensure content collection types are available
/// <reference types="astro:content" />

// Environment variables for Strava API
interface ImportMetaEnv {
  readonly STRAVA_CLIENT_ID: string;
  readonly STRAVA_CLIENT_SECRET: string;
  readonly STRAVA_REFRESH_TOKEN: string;
  readonly STRAVA_WEBHOOK_VERIFY_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare runtime types
type Runtime = import('@astrojs/cloudflare').Runtime<{
  KV_STRAVA_CACHE: KVNamespace;
}>;

declare namespace App {
  interface Locals extends Runtime {
    // Additional local types can be added here
  }
}
