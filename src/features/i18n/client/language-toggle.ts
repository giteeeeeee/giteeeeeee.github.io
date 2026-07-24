import { defaultLang, type Language } from '@app/config/i18n.config';

const supportedLanguages: Language[] = ['zh', 'en'];

function getStoredLanguage(): Language {
  const stored = localStorage.getItem('language') as Language | null;
  return stored && supportedLanguages.includes(stored) ? stored : defaultLang;
}

function updateLanguageDisplay(lang: Language) {
  document.querySelectorAll<HTMLElement>('[data-lang-label]').forEach((label) => {
    label.textContent = lang === 'en' ? 'EN' : '中';
  });

  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  document.documentElement.dataset.lang = lang;
}

export function initLanguageToggle() {
  updateLanguageDisplay(getStoredLanguage());

  document.querySelectorAll<HTMLButtonElement>('[data-lang-toggle]').forEach((toggle) => {
    if (toggle.dataset.bound === 'true') return;

    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', () => {
      const nextLang: Language = getStoredLanguage() === 'en' ? 'zh' : 'en';
      localStorage.setItem('language', nextLang);
      updateLanguageDisplay(nextLang);
      window.dispatchEvent(new CustomEvent('languagechange', {
        detail: { lang: nextLang },
      }));
    });
  });
}
