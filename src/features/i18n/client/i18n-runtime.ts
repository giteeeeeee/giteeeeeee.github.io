import { defaultLang, translations, type Language } from '@app/config/i18n.config';
import { userContent } from '@app/config/user.config';

type I18nApi = {
  defaultLang: Language;
  translations: typeof translations;
  getCurrentLang: () => Language;
  translate: (key: string, lang: Language) => string;
  applyLanguage: (lang?: Language, root?: Document | Element) => Language;
};

type I18nWindow = Window & {
  __REAY_I18N__?: I18nApi;
  __REAY_I18N_RUNTIME__?: boolean;
};

const supportedLanguages = Object.keys(translations) as Language[];

function normalizeLang(lang?: string | null): Language {
  return supportedLanguages.includes(lang as Language) ? lang as Language : defaultLang;
}

function getCurrentLang(): Language {
  try {
    return normalizeLang(localStorage.getItem('language'));
  } catch {
    return defaultLang;
  }
}

function getTranslation(key: string, lang: Language) {
  const dictionary = translations[lang] as Record<string, string>;
  const fallback = translations[defaultLang] as Record<string, string>;
  return dictionary[key] || fallback[key] || key;
}

function setDocumentLang(doc: Document, lang: Language) {
  doc.documentElement.dataset.lang = lang;
  doc.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

function translateElement(element: Element, lang: Language) {
  const key = element.getAttribute('data-i18n');
  const attributes = [
    element.getAttribute('data-i18n-attr'),
    ...(element.getAttribute('data-i18n-attrs')?.split(',') ?? []),
  ].filter((attribute): attribute is string => Boolean(attribute?.trim()));

  if (key) {
    const value = getTranslation(key, lang);
    if (attributes.length > 0) {
      attributes.forEach((attribute) => {
        const name = attribute.trim();
        if (element.getAttribute(name) !== value) element.setAttribute(name, value);
      });
    } else if (element.hasAttribute('data-text')) {
      if (element.getAttribute('data-text') !== value) element.setAttribute('data-text', value);
    } else if (element.textContent !== value) {
      element.textContent = value;
    }
    element.setAttribute('data-i18n-ready', 'true');
  }

  const dateValue = element.getAttribute('data-i18n-date');
  if (dateValue) {
    const date = new Date(dateValue);
    if (!Number.isNaN(date.valueOf())) {
      const dateFormat = element.getAttribute('data-i18n-date-format');
      const format = dateFormat === 'short'
        ? { year: 'numeric', month: '2-digit', day: '2-digit' } as const
        : dateFormat === 'month'
          ? { month: 'long' } as const
          : dateFormat === 'day'
            ? { day: '2-digit' } as const
            : { year: 'numeric', month: 'long', day: 'numeric' } as const;
      element.textContent = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', format).format(date);
    }
  }

  const userKey = element.getAttribute('data-user-content');
  const localizedContent = userContent[lang] || userContent[defaultLang];
  if (!userKey) return;

  const value = userKey.split('.').reduce<unknown>((current, segment) => {
    if (Array.isArray(current)) {
      const index = Number.parseInt(segment, 10);
      return Number.isInteger(index) ? current[index] : undefined;
    }
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, localizedContent);

  if (typeof value !== 'string' || !value) return;
  if (userKey === 'tagline' && element.hasAttribute('data-text')) {
    if (element.getAttribute('data-text') !== value) element.setAttribute('data-text', value);
  } else if (element.textContent !== value) {
    element.textContent = value;
  }
}

function getDocument(root: Document | Element) {
  return root instanceof Document ? root : root.ownerDocument;
}

function updatePageTitle(doc: Document, lang: Language, pathname: string) {
  const normalizedPath = pathname !== '/' ? pathname.replace(/\/$/, '') : pathname;
  const titleByPath: Record<string, string> = {
    '/': 'page.title.home',
    '/blog': 'page.title.blog',
    '/archives': 'page.title.archives',
    '/projects': 'page.title.projects',
    '/gallery': 'page.title.gallery',
    '/links': 'page.title.links',
    '/guestbook': 'page.title.guestbook',
    '/about': 'page.title.about',
    '/search': 'page.title.search',
  };
  const declaredTitleKey = doc.querySelector<HTMLElement>('[data-page-title-key]')?.dataset.pageTitleKey;
  const titleKey = declaredTitleKey || titleByPath[normalizedPath];
  if (titleKey) doc.title = getTranslation(titleKey, lang);
}

function getDocumentPath(doc: Document) {
  try {
    return new URL(doc.URL, window.location.href).pathname;
  } catch {
    return window.location.pathname;
  }
}

function applyLanguage(lang = getCurrentLang(), root: Document | Element = document) {
  const currentLang = normalizeLang(lang);
  const doc = getDocument(root);
  setDocumentLang(doc, currentLang);

  if (root instanceof Element) translateElement(root, currentLang);
  root.querySelectorAll('[data-i18n], [data-user-content], [data-i18n-date]').forEach((element) => {
    translateElement(element, currentLang);
  });

  updatePageTitle(doc, currentLang, getDocumentPath(doc));
  doc.documentElement.classList.add('i18n-ready');
  return currentLang;
}

export function initI18nRuntime() {
  const runtimeWindow = window as I18nWindow;
  if (runtimeWindow.__REAY_I18N_RUNTIME__) return;
  runtimeWindow.__REAY_I18N_RUNTIME__ = true;

  runtimeWindow.__REAY_I18N__ = {
    defaultLang,
    translations,
    getCurrentLang,
    translate: getTranslation,
    applyLanguage,
  };

  const applyCurrentDocument = () => applyLanguage(getCurrentLang(), document);

  window.addEventListener('languagechange', (event) => {
    const detail = (event as CustomEvent<{ lang?: Language }>).detail;
    applyLanguage(normalizeLang(detail?.lang), document);
  });

  document.addEventListener('astro:before-swap', (event) => {
    const navigationEvent = event as Event & { newDocument?: Document };
    if (navigationEvent.newDocument) {
      applyLanguage(getCurrentLang(), navigationEvent.newDocument);
    }
  });

  document.addEventListener('astro:after-swap', () => {
    const currentLang = getCurrentLang();
    setDocumentLang(document, currentLang);
    updatePageTitle(document, currentLang, window.location.pathname);
    document.documentElement.classList.add('i18n-ready');
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCurrentDocument, { once: true });
  } else {
    applyCurrentDocument();
  }
}
