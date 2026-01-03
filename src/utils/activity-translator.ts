/**
 * Activity Name Translator
 *
 * Translates common patterns in Strava activity names from English to Spanish
 * while leaving unique/custom names unchanged
 */

import type { Language } from '@/i18n/ui';

// Common patterns to translate
const patterns: Record<string, Record<Language, string>> = {
  // Time of day
  'Morning Run': { en: 'Morning Run', es: 'Carrera Matutina' },
  'Afternoon Run': { en: 'Afternoon Run', es: 'Carrera de Tarde' },
  'Evening Run': { en: 'Evening Run', es: 'Carrera Vespertina' },
  'Night Run': { en: 'Night Run', es: 'Carrera Nocturna' },
  'Lunch Run': { en: 'Lunch Run', es: 'Carrera de Mediodía' },

  'Morning Walk': { en: 'Morning Walk', es: 'Caminata Matutina' },
  'Afternoon Walk': { en: 'Afternoon Walk', es: 'Caminata de Tarde' },
  'Evening Walk': { en: 'Evening Walk', es: 'Caminata Vespertina' },
  'Night Walk': { en: 'Night Walk', es: 'Caminata Nocturna' },
  'Lunch Walk': { en: 'Lunch Walk', es: 'Caminata de Mediodía' },

  // Days of week
  'Monday Run': { en: 'Monday Run', es: 'Carrera del Lunes' },
  'Tuesday Run': { en: 'Tuesday Run', es: 'Carrera del Martes' },
  'Wednesday Run': { en: 'Wednesday Run', es: 'Carrera del Miércoles' },
  'Thursday Run': { en: 'Thursday Run', es: 'Carrera del Jueves' },
  'Friday Run': { en: 'Friday Run', es: 'Carrera del Viernes' },
  'Saturday Run': { en: 'Saturday Run', es: 'Carrera del Sábado' },
  'Sunday Run': { en: 'Sunday Run', es: 'Carrera del Domingo' },

  // Common generic names
  'Run': { en: 'Run', es: 'Carrera' },
  'Walk': { en: 'Walk', es: 'Caminata' },
  'Easy Run': { en: 'Easy Run', es: 'Carrera Suave' },
  'Long Run': { en: 'Long Run', es: 'Carrera Larga' },
  'Recovery Run': { en: 'Recovery Run', es: 'Carrera de Recuperación' },
  'Speed Run': { en: 'Speed Run', es: 'Carrera de Velocidad' },
  'Interval Run': { en: 'Interval Run', es: 'Carrera de Intervalos' },
  'Trail Run': { en: 'Trail Run', es: 'Carrera de Montaña' },
};

/**
 * Translate activity name if it matches a common pattern
 * @param name - Original activity name from Strava
 * @param lang - Target language (en or es)
 * @returns Translated name if pattern matches, original name otherwise
 */
export function translateActivityName(name: string, lang: Language): string {
  // If English, always return original
  if (lang === 'en') {
    return name;
  }

  // Check for exact matches first
  if (patterns[name]) {
    return patterns[name][lang];
  }

  // Check for partial matches (case-insensitive)
  for (const [pattern, translations] of Object.entries(patterns)) {
    const regex = new RegExp(`\\b${pattern}\\b`, 'i');
    if (regex.test(name)) {
      // Replace the pattern while preserving the rest of the string
      return name.replace(regex, translations[lang]);
    }
  }

  // No match found, return original name
  return name;
}
