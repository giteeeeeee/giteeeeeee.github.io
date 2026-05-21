/**
 * Client-side i18n Content Updater
 * Enables language switching without page refresh
 */

import { translations, defaultLang } from '../data/i18n.config';

type Language = 'en' | 'zh';
type TranslationKey = keyof typeof translations['en'];
type I18nRoot = Document | HTMLElement;

let listenerAttached = false;

type RuntimeI18n = {
  getCurrentLang: () => Language;
  translate: (key: string, lang?: Language) => string;
  applyLanguage: (lang?: Language, root?: I18nRoot) => Language;
};

function getRuntime(): RuntimeI18n | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { __REAY_I18N__?: RuntimeI18n }).__REAY_I18N__ ?? null;
}

/**
 * Get current language from localStorage
 */
export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') return defaultLang;
  const runtime = getRuntime();
  if (runtime) return runtime.getCurrentLang();
  const stored = localStorage.getItem('language') as Language | null;
  return stored === 'en' || stored === 'zh' ? stored : defaultLang;
}

/**
 * Get translation for a key
 */
export function t(key: TranslationKey, lang?: Language): string {
  const runtime = getRuntime();
  if (runtime) return runtime.translate(key, lang);
  const currentLang = lang || getCurrentLanguage();
  return translations[currentLang][key] || translations[defaultLang][key] || key;
}

function getRootDocument(root: I18nRoot): Document {
  return root instanceof Document ? root : root.ownerDocument;
}

function applyTranslations(root: I18nRoot, lang: Language) {
  const elements = root.querySelectorAll('[data-i18n]');

  elements.forEach((element) => {
    const key = element.getAttribute('data-i18n') as TranslationKey;
    const attr = element.getAttribute('data-i18n-attr');

    if (!key) return;

    const translation = t(key, lang);

    if (attr) {
      element.setAttribute(attr, translation);
    } else if (element.hasAttribute('data-text')) {
      element.setAttribute('data-text', translation);
    } else {
      element.textContent = translation;
    }
  });
}

/**
 * Update all elements with data-i18n attribute
 */
export function updatePageContent(lang: Language, root: I18nRoot = document) {
  const runtime = getRuntime();
  if (runtime) {
    runtime.applyLanguage(lang, root);
    if (root === document) updatePageTitle(lang);
    return;
  }

  const rootDocument = getRootDocument(root);
  const html = rootDocument.documentElement;

  html.classList.add('i18n-syncing');
  html.setAttribute('data-lang', lang);
  html.lang = lang === 'en' ? 'en' : 'zh-CN';

  applyTranslations(root, lang);

  if (rootDocument === document) {
    updatePageTitle(lang);
  }

  requestAnimationFrame(() => {
    html.classList.remove('i18n-pending');
    html.classList.remove('i18n-syncing');
    html.classList.add('i18n-ready');
  });
}

/**
 * Update page title based on current route
 */
function updatePageTitle(lang: Language) {
  const path = window.location.pathname;
  let titleKey: TranslationKey | null = null;
  
  if (path === '/' || path.startsWith('/home')) {
    titleKey = 'page.title.home';
  } else if (path.startsWith('/blog')) {
    titleKey = 'page.title.blog';
  } else if (path.startsWith('/archives')) {
    titleKey = 'page.title.archives';
  } else if (path.startsWith('/projects')) {
    titleKey = 'page.title.projects';
  } else if (path.startsWith('/gallery')) {
    titleKey = 'page.title.gallery';
  } else if (path.startsWith('/links')) {
    titleKey = 'page.title.links';
  } else if (path.startsWith('/about')) {
    titleKey = 'page.title.about';
  }
  
  if (titleKey) {
    document.title = t(titleKey, lang);
  }
}

/**
 * Initialize i18n system
 */
export function initI18n() {
  const currentLang = getCurrentLanguage();
  updatePageContent(currentLang);

  if (!listenerAttached) {
    listenerAttached = true;

    window.addEventListener('languagechange', (event: Event) => {
      const customEvent = event as CustomEvent<{ lang: Language }>;
      updatePageContent(customEvent.detail.lang);
    });

    document.addEventListener('astro:before-swap', (event: Event) => {
      const customEvent = event as CustomEvent<{ newDocument?: Document }>;
      const nextDocument = customEvent.detail?.newDocument;

      if (nextDocument) {
        updatePageContent(getCurrentLanguage(), nextDocument);
      }
    });

    document.addEventListener('astro:after-swap', () => {
      updatePageContent(getCurrentLanguage());
    });
  }
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }
}
