/**
 * Navigation Internationalization Script
 * Dynamically updates navigation link text based on language settings
 */

import { translations, defaultLang, type Language } from '../../data/i18n.config';

/**
 * Initialize navigation i18n system
 * Updates navigation links on language change
 */
export function initNavigationI18n() {
  const currentLang = (localStorage.getItem('language') || defaultLang) as Language;
  
  // Navigation link mapping
  const navLinks = [
    { href: '/', key: 'nav.home' as const },
    { href: '/blog', key: 'nav.blog' as const },
    { href: '/archives', key: 'nav.archives' as const },
    { href: '/projects', key: 'nav.projects' as const },
    { href: '/gallery', key: 'nav.gallery' as const },
    { href: '/links', key: 'nav.links' as const },
    { href: '/about', key: 'nav.about' as const },
  ];
  
  // Update navigation text with current language
  updateNavigationText(currentLang, navLinks);
  
  // Listen for language change events
  window.addEventListener('languagechange', (e: Event) => {
    const customEvent = e as CustomEvent<{ lang: Language }>;
    updateNavigationText(customEvent.detail.lang, navLinks);
  });
}

/**
 * Update navigation link text based on language
 * @param lang - Target language
 * @param navLinks - Array of navigation link configurations
 */
function updateNavigationText(
  lang: Language, 
  navLinks: Array<{ href: string; key: keyof typeof translations['en'] }>
) {
  const nav = document.querySelector('nav');
  if (!nav) return;
  
  const links = nav.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const navItem = navLinks.find(item => item.href === href);
    
    if (navItem) {
      link.textContent = translations[lang][navItem.key];
    }
  });
}
