export const SITE_TITLE = {
  en: "Angel Baez",
  es: "Angel Baez",
} as const;

export const SITE_DESCRIPTION = {
  en: "Angel Baez - Agentic Developer and entrepreneur based in Cancun, Mexico. Building AI agents, autonomous systems, and intelligent web apps with TypeScript and Node.js.",
  es: "Angel Baez - Desarrollador Agéntico y emprendedor en Cancún, México. Creando agentes de IA, sistemas autónomos y aplicaciones web inteligentes con TypeScript y Node.js.",
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
