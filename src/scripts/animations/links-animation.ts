/**
 * links-animation.ts
 * Enhanced animation effects for link cards
 * Provides scroll-triggered fade-in animations with stagger effect
 */

export class LinksAnimation {
  private cards: NodeListOf<HTMLElement>;

  constructor() {
    this.cards = document.querySelectorAll('[data-link-card]');
    this.init();
  }

  /**
   * Initialize animations
   */
  private init() {
    this.cards.forEach((card) => {
      card.classList.add('animate-in');
      card.style.removeProperty('--animation-delay');
    });
  }

  /**
   * Cleanup observer and resources
   */
  public destroy() {}
}

/**
 * Auto-initialize links animation
 * @returns LinksAnimation instance or null if DOM not ready
 */
export function initLinksAnimation(): LinksAnimation | null {
  if (document.readyState === 'loading') {
    let instance: LinksAnimation | null = null;
    document.addEventListener('DOMContentLoaded', () => {
      instance = new LinksAnimation();
    });
    return instance;
  } else {
    return new LinksAnimation();
  }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  // Cleanup work if needed
});
