export const SITE_TITLE = {
  en: "Angel Baez",
  es: "Angel Baez",
} as const;

export const SITE_DESCRIPTION = {
  en: "Angel Baez - Full Stack Developer and entrepreneur",
  es: "Angel Baez - Desarrollador Full Stack y emprendedor",
} as const;

export const SITE_URL = "https://angel-baez.com";

// Seasonal features - set to true to enable snowfall effect
export const ENABLE_SNOWFALL = true;

// 2026 Running Challenge (Fixed one-time challenge)
export const CHALLENGE_CONFIG = {
  YEAR: 2026,
  GOAL_KM: 2026,
  DAYS_IN_YEAR: 365, // 2026 is not a leap year
} as const;
