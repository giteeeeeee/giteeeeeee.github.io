/**
 * Internationalization Utilities
 * Server-side i18n helpers for Astro components
 */

import { defaultLang, translations, type Language } from '@app/config/i18n.config';

/**
 * Get current language preference
 * Priority: localStorage > defaultLang
 */
export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') {
    return defaultLang;
  }
  
  const stored = localStorage.getItem('language');
  return (stored === 'en' || stored === 'zh') ? stored : defaultLang;
}

/**
 * Get translation function for specified language
 */
export function getTranslator(lang?: Language) {
  const currentLang = lang || (typeof window !== 'undefined' ? getCurrentLanguage() : defaultLang);
  
  return function t(key: keyof typeof translations['en']): string {
    return translations[currentLang][key] || translations[defaultLang][key] || key;
  };
}

/**
 * i18n hook for Astro components
 * Defaults to defaultLang during build time
 */
export function useI18n() {
  const t = getTranslator(defaultLang);
  return { 
    t, 
    lang: defaultLang, 
    currentLang: defaultLang 
  };
}
