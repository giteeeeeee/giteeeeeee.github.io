/**
 * Mobile Menu
 * Mobile menu toggle with expand/collapse and icon animations
 */

export interface MobileMenuConfig {
  btnId?: string;
  menuId?: string;
  openIconClass?: string;
  closeIconClass?: string;
}

type Language = 'en' | 'zh';

type I18nWindow = Window & {
  __REAY_I18N__?: {
    getCurrentLang: () => Language;
    translate: (key: string, lang: Language) => string;
  };
};

const DEFAULT_CONFIG: MobileMenuConfig = {
  btnId: 'menu-btn',
  menuId: 'mobile-menu',
  openIconClass: 'i-carbon:menu text-[1.25rem] text-[var(--md-sys-color-on-surface)] transition-transform duration-200',
  closeIconClass: 'i-carbon:close text-[1.25rem] text-[var(--md-sys-color-on-surface)] transition-transform duration-200 rotate-90',
};

export class MobileMenu {
  private btn: HTMLElement | null;
  private menu: HTMLElement | null;
  private icon: HTMLElement | null;
  private config: MobileMenuConfig;
  private isOpen: boolean = false;
  private linkHandlers = new Map<Element, EventListener>();
  private handleButtonClick = () => this.toggle();
  private handleLanguageChange = () => this.updateButtonA11y();
  private handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  };

  constructor(config: Partial<MobileMenuConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    this.btn = document.getElementById(this.config.btnId!);
    this.menu = document.getElementById(this.config.menuId!);
    this.icon = this.btn?.querySelector('i') || null;
    
    if (!this.btn || !this.menu) {
      console.warn('[MobileMenu] Required elements not found');
      return;
    }
    
    this.init();
  }

  /**
   * Initialize event listeners
   */
  private init() {
    this.btn?.addEventListener('click', this.handleButtonClick);
    window.addEventListener('languagechange', this.handleLanguageChange);
    this.updateButtonA11y();
    
    this.menu?.querySelectorAll('a').forEach(link => {
      const handler = () => {
        if (this.isOpen) {
          this.close();
        }
      };

      this.linkHandlers.set(link, handler);
      link.addEventListener('click', handler);
    });
    
    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Toggle menu open/close state
   */
  public toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open menu with animation
   */
  public open() {
    if (!this.menu || !this.btn) return;
    
    this.isOpen = true;
    this.menu.classList.remove('hidden');
    this.btn.setAttribute('aria-expanded', 'true');
    this.updateButtonA11y();
    
    // Update icon to close state
    if (this.icon && this.config.closeIconClass) {
      this.icon.className = this.config.closeIconClass;
    }
  }

  /**
   * Close menu with animation
   */
  public close() {
    if (!this.menu || !this.btn) return;
    
    this.isOpen = false;
    this.menu.classList.add('hidden');
    this.btn.setAttribute('aria-expanded', 'false');
    this.updateButtonA11y();
    
    // Update icon to open state
    if (this.icon && this.config.openIconClass) {
      this.icon.className = this.config.openIconClass;
    }
  }

  /**
   * Get current open/close state
   * @returns true if menu is open, false otherwise
   */
  public getState(): boolean {
    return this.isOpen;
  }

  private updateButtonA11y() {
    if (!this.btn) return;

    const runtime = (window as I18nWindow).__REAY_I18N__;
    const key = this.isOpen ? 'nav.closeMenu' : 'nav.openMenu';
    const fallback = this.isOpen ? 'Close menu' : 'Open menu';
    const label = runtime?.translate(key, runtime.getCurrentLang()) ?? fallback;

    this.btn.dataset.i18n = key;
    this.btn.dataset.i18nAttrs = 'aria-label,title';
    this.btn.setAttribute('aria-label', label);
    this.btn.setAttribute('title', label);
  }

  /**
   * Remove event listeners before Astro swaps the page.
   */
  public destroy() {
    this.close();
    this.btn?.removeEventListener('click', this.handleButtonClick);
    window.removeEventListener('languagechange', this.handleLanguageChange);

    this.linkHandlers.forEach((handler, link) => {
      link.removeEventListener('click', handler);
    });
    this.linkHandlers.clear();

    document.removeEventListener('keydown', this.handleKeydown);

    if (this.btn) {
      delete this.btn.dataset.bound;
    }
  }
}

/**
 * Auto-initialize mobile menu
 * @param config - Optional configuration overrides
 * @returns MobileMenu instance or null if DOM not ready
 */
export function initMobileMenu(config?: Partial<MobileMenuConfig>): MobileMenu | null {
  if (document.readyState === 'loading') {
    let instance: MobileMenu | null = null;
    document.addEventListener('DOMContentLoaded', () => {
      instance = new MobileMenu(config);
    });
    return instance;
  } else {
    return new MobileMenu(config);
  }
}
