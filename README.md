# My website

## Features

- Powered by [Astro](https://astro.build/)
- Responsive design
- Dark mode
- Social links
- RSS feed
- Simple blog
- **Strava Running Challenge Tracker** - Real-time progress tracking with heatmap and stats

## Strava Integration Setup

This site features a running challenge tracker that integrates with the Strava API to display real-time progress, activity history, and detailed statistics.

**For detailed setup instructions**, see [docs/STRAVA_SETUP.md](docs/STRAVA_SETUP.md)

**Quick overview**:
1. Create a Strava API application at [https://www.strava.com/settings/api](https://www.strava.com/settings/api)
2. Generate OAuth refresh token via browser authorization flow
3. Set up Cloudflare KV namespace for caching and rate limiting
4. Configure environment variables (Client ID, Client Secret, Refresh Token, Webhook Verify Token)
5. Register webhook for real-time cache invalidation when new activities are created

**The tracker displays**:
- Total distance and progress percentage toward yearly goal
- Days remaining and required daily pace to reach goal
- Calendar heatmap showing activity distribution throughout the year
- Recent activities with pace, duration, and distance details
- Real-time updates via Strava webhooks
- Bilingual support (English/Spanish)

**Tech stack**:
- **Frontend**: Astro SSR pages with responsive design
- **API**: Strava API v3 with OAuth 2.0 authentication
- **Caching**: Cloudflare KV (24-hour TTL)
- **Rate Limiting**: Custom implementation using KV atomic operations
- **Webhooks**: Automatic cache invalidation on new activities
- **Testing**: Vitest with 98%+ test coverage

## Installation

1. Clone this repository. `git clone git@github.com:baezor/website.git website`.
2. Navigate to the project directory using `cd website`.
3. Install dependencies and start the server `npm i && npm run start`.

## Usage

- **Development**: Run `npm run dev` or `npm start` to start the development server.
- **Build**: Use `npm run build` to generate a production build.
- **Preview**: Run `npm run preview` to preview the production build.
- **Astro CLI**: Explore additional Astro CLI commands using `npm run astro`.

## Updating your links

Feel free to use my repository as a template for your own website. To customize the links displayed in your website, follow these steps:

1. Open the `src/data/index.ts` file in your project.
2. You'll see an array of objects with the information of the links. Add, remove, or update the links as needed.

```javascript
const links = [
  {
    label: "Add me to your network on LinkedIn",
    url: "https://www.linkedin.com/in/angelromerobaez/",
  },
  {
    label: "Check out my GitHub",
    url: "https://github.com/baezor/",
  },
];
```
