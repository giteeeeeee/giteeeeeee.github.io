/**
 * User Content i18n Handler
 * Manages bilingual user-configurable content (bio, tagline, etc.)
 */

import { defaultLang, type Language } from '../data/i18n.config';
import { userContent } from '../data/user.config';

let initialized = false;

function getStoredLanguage(): Language {
  return (localStorage.getItem('language') || defaultLang) as Language;
}

/**
 * Update user content based on language
 */
export function updateUserContent(lang: Language) {
  const content = userContent[lang];
  
  // Update bio content
  const bioElement = document.querySelector('[data-user-content="bio"]');
  if (bioElement && content.bio) {
    bioElement.textContent = content.bio;
  }
  
  // Update tagline (for typewriter effect via data-text)
  const taglineElement = document.querySelector('[data-user-content="tagline"]');
  if (taglineElement && content.tagline) {
    // Always update data-text attribute for typewriter effect
    taglineElement.setAttribute('data-text', content.tagline);
    // Clear the displayed text so typewriter can restart
    taglineElement.textContent = '';
    taglineElement.classList.remove('typing-complete');
  }
  
  // Update greeting
  const greetingElement = document.querySelector('[data-user-content="greeting"]');
  if (greetingElement && content.greeting) {
    greetingElement.textContent = content.greeting;
  }

  // Update compact description
  const descriptionElements = document.querySelectorAll('[data-user-content="description"]');
  if (descriptionElements.length > 0 && content.description) {
    descriptionElements.forEach((element) => {
      element.textContent = content.description;
    });
  }
}

/**
 * Initialize user content i18n system
 */
export function initUserContentI18n() {
  if (!initialized) {
    initialized = true;

    window.addEventListener('languagechange', (event: Event) => {
      const customEvent = event as CustomEvent<{ lang: Language }>;
      updateUserContent(customEvent.detail?.lang || getStoredLanguage());
    });
  }

  // Apply on every page load because ClientRouter swaps in fresh DOM.
  updateUserContent(getStoredLanguage());
}
