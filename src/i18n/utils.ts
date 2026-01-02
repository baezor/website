import { ui, defaultLang, languages, type Language as Lang, type UiKey } from './ui';

export type Language = Lang;

/**
 * Extracts language code from URL pathname
 * @param url - The URL object to parse
 * @returns Language code ('en' or 'es'), defaults to 'en' if not found
 * @example
 * getLangFromUrl(new URL('https://example.com/es/blog')) // 'es'
 * getLangFromUrl(new URL('https://example.com/blog')) // 'en'
 */
export function getLangFromUrl(url: URL): Language {
  // Normalize pathname by removing trailing slash
  const pathname = url.pathname.replace(/\/$/, '');
  const [, lang] = pathname.split('/');
  // Validate against available languages
  return (lang && lang in languages) ? lang as Language : defaultLang;
}

/**
 * Returns a translation function for the specified language
 * @param lang - Language code
 * @returns Translation function with parameter interpolation support
 * @example
 * const t = useTranslations('es');
 * t('home.bio') // Returns Spanish translation
 * t('home.aria.about', { name: 'Angel' }) // Interpolates {name} parameter
 */
export function useTranslations(lang: Language) {
  return function t(key: UiKey, params?: Record<string, string | number>): string {
    // Check if translation key exists
    if (!ui[key]) {
      console.error(`Translation key "${key}" not found`);
      return key; // Return key as fallback
    }

    let translation = ui[key][lang] || ui[key][defaultLang];

    // Template replacement for {param} placeholders using regex for better performance
    if (params) {
      translation = translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return paramKey in params ? String(params[paramKey]) : match;
      });
    }

    return translation;
  };
}

/**
 * Transforms URLs between languages by adding/removing language prefix
 * @param url - The URL path to transform
 * @param targetLang - Target language code
 * @returns Transformed URL path with appropriate language prefix
 * @example
 * getLocalizedUrl('/blog', 'es') // '/es/blog'
 * getLocalizedUrl('/es/blog', 'en') // '/blog'
 * getLocalizedUrl('/messages', 'es') // '/es/messages' (won't break on 'es' substring)
 */
export function getLocalizedUrl(url: string, targetLang: Language): string {
  // Normalize by removing leading/trailing slashes
  const path = url.replace(/^\//, '').replace(/\/$/, '');
  const segments = path.split('/').filter(Boolean);
  const hasEsPrefix = segments[0] === 'es';

  if (targetLang === 'es') {
    // Already has /es/ prefix, return as-is with proper formatting
    if (hasEsPrefix) {
      return path ? `/${path}/` : '/es/';
    }
    // Add /es/ prefix
    return path ? `/es/${path}/` : '/es/';
  }

  // Target is English - remove /es/ prefix if present
  if (hasEsPrefix) {
    segments.shift(); // Remove 'es' segment
    return segments.length ? `/${segments.join('/')}/` : '/';
  }

  // No prefix, return as-is with proper formatting
  return path ? `/${path}/` : '/';
}
