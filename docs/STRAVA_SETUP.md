# Strava Running Challenge Tracker - Setup Guide

This guide provides step-by-step instructions for setting up the Strava API integration for the running challenge tracker feature.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Strava API Application Setup](#strava-api-application-setup)
3. [OAuth Token Generation](#oauth-token-generation)
4. [Webhook Configuration](#webhook-configuration)
5. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
6. [Environment Variables](#environment-variables)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Architecture Overview](#architecture-overview)
10. [Security Best Practices](#security-best-practices)
11. [Additional Resources](#additional-resources)

---

## Prerequisites

Before you begin, ensure you have:

- A Strava account with running/walking activities
- A Cloudflare account (for Pages and KV storage)
- Node.js 18+ installed locally
- Git installed
- Basic familiarity with command line tools

---

## Strava API Application Setup

### Step 1: Create a Strava API Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Click **"Create an App"** or **"My API Application"**
3. Fill in the application details:
   - **Application Name**: `[Your Name] Running Tracker` (e.g., "John's Running Tracker")
   - **Category**: Choose "Visualizer" or "Training"
   - **Club**: Leave empty (optional)
   - **Website**: Your website URL (e.g., `https://yoursite.com`)
   - **Authorization Callback Domain**: `localhost` (for local testing) OR your production domain
   - **Application Description**: Brief description of your tracker
4. Agree to the Strava API Agreement
5. Click **"Create"**

### Step 2: Save Your Credentials

After creating the app, you'll see:
- **Client ID**: A numeric ID (e.g., `123456`)
- **Client Secret**: A secret string (e.g., `abc123...`)

**IMPORTANT**: Keep your Client Secret secure. Never commit it to version control.

---

## OAuth Token Generation

Strava uses OAuth 2.0 for authentication. You need to generate a **refresh token** that your app will use to fetch activities.

### Method 1: Browser-Based Authorization (Recommended)

#### Step 1: Build the Authorization URL

Replace `YOUR_CLIENT_ID` with your actual Client ID:

```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=activity:read_all
```

**Scope Explanation**:
- `activity:read_all`: Read all activities (including private)

#### Step 2: Authorize in Browser

1. Paste the URL into your browser
2. Log in to Strava if needed
3. Click **"Authorize"**
4. You'll be redirected to `http://localhost/?code=AUTHORIZATION_CODE&scope=...`
5. Copy the `code` parameter from the URL (everything after `code=` and before `&scope`)

#### Step 3: Exchange Authorization Code for Tokens

Run this `curl` command (replace `YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET`, and `AUTHORIZATION_CODE`):

```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=AUTHORIZATION_CODE \
  -d grant_type=authorization_code
```

**Example Response**:
```json
{
  "token_type": "Bearer",
  "expires_at": 1735689600,
  "expires_in": 21600,
  "refresh_token": "abc123...",
  "access_token": "xyz789...",
  "athlete": { "id": 12345, ... }
}
```

**Save the `refresh_token`** - this is what your app will use!

### Method 2: Helper Script (Alternative)

You can also create a Node.js helper script to automate this process:

```javascript
// scripts/get-strava-token.js
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

const authUrl = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=activity:read_all`;

console.log('1. Visit this URL in your browser:');
console.log(authUrl);
console.log('\n2. After authorizing, copy the "code" from the redirect URL');
console.log('3. Run: node scripts/exchange-token.js YOUR_CODE\n');
```

---

## Webhook Configuration

Strava webhooks allow real-time cache invalidation when new activities are created.

### Step 1: Register Webhook Subscription

Run this `curl` command (replace values):

```bash
curl -X POST https://www.strava.com/api/v3/push_subscriptions \
  -F client_id=YOUR_CLIENT_ID \
  -F client_secret=YOUR_CLIENT_SECRET \
  -F callback_url=https://yoursite.com/api/strava/webhook \
  -F verify_token=your_random_verify_token
```

**Parameters**:
- `callback_url`: Your webhook endpoint URL (must be HTTPS in production)
- `verify_token`: A random string you create (e.g., `my_secret_verify_123`)

**Example Response**:
```json
{
  "id": 12345,
  "application_id": 67890,
  "resource_state": 2,
  "callback_url": "https://yoursite.com/api/strava/webhook"
}
```

**Save the subscription `id`** - you'll need it to manage the webhook later.

### Step 2: Webhook Verification (Automatic)

When you register the webhook, Strava will send a `GET` request to verify your endpoint:
- Your endpoint must return the `hub.challenge` parameter from the query string

The implementation in `src/pages/api/strava/webhook.ts` handles this automatically.

### Step 3: Manage Webhooks

#### View Active Subscriptions
```bash
curl -G https://www.strava.com/api/v3/push_subscriptions \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET
```

#### Delete a Subscription
```bash
curl -X DELETE https://www.strava.com/api/v3/push_subscriptions/SUBSCRIPTION_ID \
  -F client_id=YOUR_CLIENT_ID \
  -F client_secret=YOUR_CLIENT_SECRET
```

---

## Cloudflare Pages Deployment

### Step 1: Create a KV Namespace

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select **Workers & Pages** → **KV**
3. Click **"Create a namespace"**
4. Name it: `STRAVA_CACHE` (or any name you prefer)
5. Click **"Add"**
6. Copy the **Namespace ID** (e.g., `abc123...`)

### Step 2: Bind KV to Your Pages Project

1. In Cloudflare Dashboard, go to **Workers & Pages** → **Your Project** → **Settings** → **Functions**
2. Scroll to **KV Namespace Bindings**
3. Click **"Add binding"**
   - **Variable name**: `KV_STRAVA_CACHE` (must match code)
   - **KV namespace**: Select your `STRAVA_CACHE` namespace
4. Click **"Save"**

### Step 3: Set Environment Variables

1. In Cloudflare Dashboard, go to **Workers & Pages** → **Your Project** → **Settings** → **Environment variables**
2. Add the following variables:

| Variable Name | Value | Production? |
|---------------|-------|-------------|
| `STRAVA_CLIENT_ID` | Your Strava Client ID | Yes |
| `STRAVA_CLIENT_SECRET` | Your Strava Client Secret | Yes (encrypted) |
| `STRAVA_REFRESH_TOKEN` | Your OAuth Refresh Token | Yes (encrypted) |
| `STRAVA_WEBHOOK_VERIFY_TOKEN` | Your webhook verify token | Yes (encrypted) |

**For sensitive values** (Secret, Refresh Token, Verify Token):
- Select **"Encrypt"** before saving

3. Click **"Save"**

### Step 4: Deploy

Push your changes to the connected Git repository. Cloudflare Pages will automatically:
1. Build your Astro site
2. Deploy to the edge network
3. Make environment variables available at runtime

---

## Environment Variables

### Local Development (.env)

Create a `.env` file in your project root (never commit this file!):

```bash
# Strava API Credentials
STRAVA_CLIENT_ID=123456
STRAVA_CLIENT_SECRET=abc123secretxyz
STRAVA_REFRESH_TOKEN=def456refreshtoken
STRAVA_WEBHOOK_VERIFY_TOKEN=my_random_verify_123
```

Add to `.gitignore`:
```
.env
.env.*
!.env.example
```

### Environment Variable Reference

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `STRAVA_CLIENT_ID` | Public application ID from Strava API settings | `123456` |
| `STRAVA_CLIENT_SECRET` | Secret key from Strava API settings (keep secure!) | `abc123...` |
| `STRAVA_REFRESH_TOKEN` | OAuth refresh token obtained via authorization flow | `def456...` |
| `STRAVA_WEBHOOK_VERIFY_TOKEN` | Random string for webhook verification (you create this) | `my_secret_123` |

**Production Notes**:
- All secrets (Client Secret, Refresh Token, Verify Token) should be **encrypted** in Cloudflare
- Never expose secrets in client-side code or public repositories
- Rotate tokens periodically for security

---

## Testing

### Local Development Testing

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Visit the running page**:
   ```
   http://localhost:4321/run
   ```

3. **Check for errors**:
   - Open browser DevTools → Console
   - Look for API errors or rate limit warnings
   - Verify activities are loading (or see appropriate error messages)

### Testing Cache Behavior

#### Verify Cache Hit
1. Visit `/run` page (initial load - should fetch from Strava)
2. Refresh page (should load from cache with `[CACHED]` indicator in footer)
3. Check Cloudflare KV dashboard - you should see a key named `strava-challenge-data`

#### Manually Clear Cache
Using Cloudflare Dashboard:
1. Go to **Workers & Pages** → **KV** → **Your namespace**
2. Find key `strava-challenge-data`
3. Click **"Delete"**
4. Refresh your website - should fetch fresh data from Strava

### Testing Webhooks

#### Local Webhook Testing with Cloudflare Tunnel

Since webhooks require HTTPS, use Cloudflare Tunnel for local testing:

1. **Install Cloudflare Tunnel**:
   ```bash
   npm install -g cloudflared
   ```

2. **Start tunnel**:
   ```bash
   cloudflared tunnel --url http://localhost:4321
   ```

3. **Copy the public URL** (e.g., `https://abc-123.trycloudflare.com`)

4. **Register webhook** with tunnel URL:
   ```bash
   curl -X POST https://www.strava.com/api/v3/push_subscriptions \
     -F client_id=YOUR_CLIENT_ID \
     -F client_secret=YOUR_CLIENT_SECRET \
     -F callback_url=https://abc-123.trycloudflare.com/api/strava/webhook \
     -F verify_token=your_verify_token
   ```

5. **Test by creating a new activity** on Strava
6. **Check your local logs** - you should see webhook events

**Don't forget to delete the test subscription when done!**

---

## Troubleshooting

### Common Issues and Solutions

#### 1. `401 Unauthorized` Error

**Symptoms**: API requests fail with 401 status

**Possible Causes**:
- Invalid or expired access token
- Incorrect Client ID or Client Secret
- Insufficient OAuth scopes

**Solutions**:
- Verify `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET` are correct
- Regenerate your refresh token (see [OAuth Token Generation](#oauth-token-generation))
- Ensure you requested `activity:read_all` scope during authorization

#### 2. `Rate limit exceeded` Error

**Symptoms**: "Rate limit exceeded. Please try again in a few minutes."

**Possible Causes**:
- Too many requests to Strava API (limits: 100/15min, 1000/day)
- Multiple concurrent visitors triggering API calls

**Solutions**:
- Wait 15 minutes for rate limit to reset
- Verify caching is working (check Cloudflare KV dashboard)
- Increase cache TTL if needed (current: 24 hours)

#### 3. No Activities Showing

**Symptoms**: Page loads but shows 0 km / empty activity list

**Possible Causes**:
- No Run/Walk activities in the challenge year
- Activities are private and scope doesn't include `activity:read_all`
- Incorrect challenge year configuration

**Solutions**:
- Check `src/const.ts` - verify `CHALLENGE_CONFIG.YEAR` is correct
- Ensure your OAuth token has `activity:read_all` scope
- Check Strava website - do you have Run/Walk activities in 2026?

#### 4. Webhook Not Receiving Events

**Symptoms**: New Strava activities don't invalidate cache

**Possible Causes**:
- Webhook subscription not created or inactive
- Incorrect callback URL
- Webhook verification failed
- Incorrect verify token

**Solutions**:
- List active subscriptions (see [Webhook Configuration](#webhook-configuration))
- Verify callback URL is correct and accessible via HTTPS
- Check `STRAVA_WEBHOOK_VERIFY_TOKEN` matches what you used during registration
- Check Cloudflare Pages function logs for webhook errors

#### 5. `KV namespace not available` Warning

**Symptoms**: Console warning in development or production

**Possible Causes**:
- KV namespace not bound to Pages project
- Incorrect binding name
- Using local dev without KV emulator

**Solutions**:
- In Cloudflare Dashboard, verify KV binding name is `KV_STRAVA_CACHE`
- Redeploy after adding binding
- For local dev, this warning is expected (KV won't work locally but code will continue)

---

## Architecture Overview

### Data Flow

```
User Request → SSR Page (run.astro) → Check KV Cache
                                           ↓
                                       Cache Hit?
                                      ↙         ↘
                                   Yes           No
                                    ↓             ↓
                               Return          Rate Limit Check
                               Cached             ↓
                               Data          Fetch from Strava API
                                                   ↓
                                              Process Activities
                                                   ↓
                                              Cache in KV (24h TTL)
                                                   ↓
                                              Return Fresh Data

Strava Webhook → /api/strava/webhook → Validate → Clear Cache
```

### Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Frontend Page** | Display challenge stats | Astro (SSR) |
| **Strava API Client** | Fetch activities | `src/utils/strava-api.ts` |
| **Challenge Calculator** | Process raw activities into stats | `src/utils/challenge-calculator.ts` |
| **KV Cache** | Store processed data (24h TTL) | Cloudflare KV |
| **Rate Limiter** | Prevent API abuse | Cloudflare KV (atomic ops) |
| **Webhook Handler** | Invalidate cache on new activities | `src/pages/api/strava/webhook.ts` |

### Caching Strategy

- **TTL**: 24 hours (86400 seconds)
- **Key**: `strava-challenge-data`
- **Invalidation**: Webhook triggers OR TTL expiration
- **Benefits**: Reduces API calls by ~99%, improves page load speed

### Rate Limiting Strategy

- **15-minute window**: Max 180 requests (buffer: 20 below Strava's 200 limit)
- **Daily window**: Max 2000 requests (Strava's limit)
- **Storage**: Timestamps in KV (`strava-rate-limit` key)
- **Cleanup**: Automatic timestamp filtering (old requests removed)
- **Safety**: 10% buffer to account for KV eventual consistency

---

## Security Best Practices

### Never Expose Secrets

**DO**:
- Store secrets in Cloudflare environment variables (encrypted)
- Use `.env` files locally (never commit)
- Validate environment variables before use

**DON'T**:
- Commit secrets to Git
- Expose secrets in client-side code
- Log secrets to console in production

### Validate Webhook Requests

The webhook handler validates:
- **Verification**: `hub.challenge` parameter during subscription
- **Verify Token**: Checks `STRAVA_WEBHOOK_VERIFY_TOKEN` on POST requests
- **Event Structure**: Validates expected event payload structure

### Error Message Sanitization

In production (`import.meta.env.PROD`):
- Sensitive error details are hidden from users
- Generic messages like "Authentication failed" are shown
- Full errors logged server-side only

**Example** (from `strava-api.ts`):
```typescript
const safeError = import.meta.env.DEV ? errorText : 'Authentication failed';
throw new Error(`Failed to refresh Strava token: ${response.status} ${safeError}`);
```

### OAuth Scope Minimization

Only request necessary scopes:
- `activity:read_all` - Read all activities (including private)

**DO NOT** request:
- `activity:write` - Not needed for read-only tracker
- `profile:read_all` - Not needed unless displaying athlete info

---

## Additional Resources

### Strava API Documentation
- [Strava API v3 Documentation](https://developers.strava.com/docs/reference/)
- [OAuth 2.0 Getting Started](https://developers.strava.com/docs/getting-started/)
- [Webhooks Guide](https://developers.strava.com/docs/webhooks/)
- [Rate Limits](https://developers.strava.com/docs/rate-limits/)

### Cloudflare Resources
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [KV Storage Documentation](https://developers.cloudflare.com/kv/)
- [Environment Variables Guide](https://developers.cloudflare.com/pages/configuration/environment-variables/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

### Project Files
- **Configuration**: `src/const.ts` (challenge settings)
- **API Client**: `src/utils/strava-api.ts`
- **Calculator**: `src/utils/challenge-calculator.ts`
- **Cache/Rate Limit**: `src/utils/kv-cache.ts`
- **Webhook**: `src/pages/api/strava/webhook.ts`
- **Frontend**: `src/pages/run.astro` (English), `src/pages/es/run.astro` (Spanish)

---

## Support

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Cloudflare Pages function logs
3. Enable development mode (`npm run dev`) for detailed error messages
4. Verify all environment variables are set correctly

**Happy tracking! 🏃‍♂️**
