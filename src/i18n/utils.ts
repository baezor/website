import { ui, defaultLang, type Language, type UiKey } from './ui';

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang === 'es') return 'es';
  return defaultLang;
}

export function useTranslations(lang: Language) {
  return function t(key: UiKey, params?: Record<string, string | number>): string {
    let translation = ui[key][lang] || ui[key][defaultLang];

    // Simple template replacement for {param} placeholders
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation.replace(`{${key}}`, String(value));
      });
    }

    return translation;
  };
}

export function getLocalizedUrl(url: string, targetLang: Language): string {
  // Remove leading slash
  const path = url.replace(/^\//, '');

  // If target is Spanish, add /es/ prefix
  if (targetLang === 'es') {
    // If already has /es/, return as is
    if (path.startsWith('es/')) return `/${path}`;
    // Special case: empty path (homepage)
    if (path === '' || path === '/') return '/es/';
    return `/es/${path}`;
  }

  // If target is English, remove /es/ prefix
  if (path.startsWith('es/')) {
    const withoutEs = path.replace(/^es\//, '');
    return withoutEs === '' ? '/' : `/${withoutEs}`;
  }

  return path === '' ? '/' : `/${path}`;
}
