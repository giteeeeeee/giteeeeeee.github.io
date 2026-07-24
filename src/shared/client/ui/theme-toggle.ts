/**
 * Theme Toggle
 * Theme switching functionality supporting light/dark/system modes
 */

type ThemeMode = 'light' | 'dark' | 'system';
type Language = 'en' | 'zh';

type I18nWindow = Window & {
  __REAY_I18N__?: {
    getCurrentLang: () => Language;
    translate: (key: string, lang: Language) => string;
  };
};

type LegacyMediaQueryList = Omit<MediaQueryList, 'addListener' | 'removeListener'> & {
  addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
  removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
};

export interface ThemeToggleConfig {
  btnId?: string;
  iconId?: string;
  storageKey?: string;
}

const DEFAULT_CONFIG: ThemeToggleConfig = {
  btnId: 'theme-toggle',
  iconId: 'theme-icon',
  storageKey: 'theme',
};

export class ThemeToggle {
  private el: HTMLElement;
  private buttons: HTMLButtonElement[];
  private config: ThemeToggleConfig;
  private order: ThemeMode[] = ['light', 'dark', 'system'];
  private buttonHandlers = new Map<HTMLButtonElement, EventListener>();
  private iconTimers = new Set<number>();
  private mediaQueryList?: MediaQueryList;
  private handleLanguageChange = () => this.updateButtons(this.read(), false);
  private handleSystemThemeChange = () => {
    if (this.read() === 'system') {
      this.apply('system', false);
    }
  };

  constructor(config: Partial<ThemeToggleConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.el = document.documentElement;
    this.buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]'));

    if (this.buttons.length === 0) {
      const legacyButton = document.getElementById(this.config.btnId!) as HTMLButtonElement | null;
      this.buttons = legacyButton ? [legacyButton] : [];
    }

    if (this.buttons.length === 0) {
      console.warn('[ThemeToggle] Required elements not found');
      return;
    }

    this.init();
  }

  /**
   * Initialize theme toggle
   */
  private init() {
    // Applying a preset default is not an explicit visitor choice. Keep
    // storage empty until the toggle is used so another preset may supply a
    // different default mode later.
    this.apply(this.read(), false);

    this.buttons.forEach((button) => {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';

      const handler = () => {
        const cur = this.read();
        const idx = this.order.indexOf(cur);
        const next = this.order[(idx + 1) % this.order.length];
        this.apply(next);
      };

      this.buttonHandlers.set(button, handler);
      button.addEventListener('click', handler);
    });

    this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    window.addEventListener('languagechange', this.handleLanguageChange);

    if (this.mediaQueryList.addEventListener) {
      this.mediaQueryList.addEventListener('change', this.handleSystemThemeChange);
    } else {
      (this.mediaQueryList as LegacyMediaQueryList).addListener?.(this.handleSystemThemeChange);
    }
  }

  /**
   * Read current theme from storage
   */
  private read(): ThemeMode {
    const v = localStorage.getItem(this.config.storageKey!);
    if (v === 'light' || v === 'dark' || v === 'system') return v;

    const configured = this.el.dataset.themeDefault;
    return configured === 'light' || configured === 'dark' || configured === 'system'
      ? configured
      : 'system';
  }

  /**
   * Get icon class name
   */
  private iconClass(mode: ThemeMode): string {
    const baseClass = 'text-[1.25rem] transition-transform duration-300 rotate-0';
    
    switch (mode) {
      case 'dark':
        return `i-carbon:moon ${baseClass}`;
      case 'light':
        return `i-carbon:sun ${baseClass}`;
      case 'system':
        return `i-carbon:laptop ${baseClass}`;
    }
  }

  /**
   * Get theme label for accessibility
   * @param mode - Theme mode
   * @returns Localized label text
   */
  private label(mode: ThemeMode): string {
    const runtime = (window as I18nWindow).__REAY_I18N__;
    const key = `theme.toggle.${mode}`;
    const fallback = `Switch theme (current: ${mode})`;
    return runtime?.translate(key, runtime.getCurrentLang()) ?? fallback;
  }

  private updateButtons(mode: ThemeMode, animateIcon = true) {
    const labelText = this.label(mode);
    const key = `theme.toggle.${mode}`;

    this.buttons.forEach((button) => {
      const icon = button.querySelector<HTMLElement>('[data-theme-icon]') ||
        document.getElementById(this.config.iconId!) as HTMLElement | null;

      if (icon) {
        if (animateIcon) icon.style.transform = 'rotate(360deg)';
        const timer = window.setTimeout(() => {
          icon.className = this.iconClass(mode);
          icon.style.transform = '';
          this.iconTimers.delete(timer);
        }, animateIcon ? 150 : 0);
        this.iconTimers.add(timer);
      }

      button.dataset.i18n = key;
      button.dataset.i18nAttrs = 'aria-label,title';
      button.setAttribute('aria-label', labelText);
      button.title = labelText;
    });
  }

  /**
   * Apply theme to document
   * @param mode - Theme mode to apply
   */
  private apply(mode: ThemeMode, persist = true) {
    let resolvedTheme: 'light' | 'dark';

    // Set data-theme attribute
    if (mode === 'system') {
      // When system mode, detect system preference and apply
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = prefersDark ? 'dark' : 'light';
    } else {
      resolvedTheme = mode;
    }

    this.el.setAttribute('data-theme', resolvedTheme);
    this.el.style.colorScheme = resolvedTheme;

    if (persist) {
      localStorage.setItem(this.config.storageKey!, mode);
    }

    this.updateButtons(mode);
  }

  /**
   * Get current theme mode
   * @returns Current theme mode
   */
  public getCurrentTheme(): ThemeMode {
    return this.read();
  }

  /**
   * Set theme mode
   * @param mode - Theme mode to set
   */
  public setTheme(mode: ThemeMode) {
    this.apply(mode);
  }

  /**
   * Remove event listeners before Astro swaps the page.
   */
  public destroy() {
    this.buttonHandlers.forEach((handler, button) => {
      button.removeEventListener('click', handler);
      delete button.dataset.bound;
    });
    this.buttonHandlers.clear();
    window.removeEventListener('languagechange', this.handleLanguageChange);
    this.iconTimers.forEach((timer) => window.clearTimeout(timer));
    this.iconTimers.clear();

    if (this.mediaQueryList?.removeEventListener) {
      this.mediaQueryList.removeEventListener('change', this.handleSystemThemeChange);
    } else if (this.mediaQueryList) {
      (this.mediaQueryList as LegacyMediaQueryList).removeListener?.(this.handleSystemThemeChange);
    }
  }
}

/**
 * Auto-initialize theme toggle
 * @param config - Optional configuration overrides
 * @returns ThemeToggle instance or null if DOM not ready
 */
export function initThemeToggle(config?: Partial<ThemeToggleConfig>): ThemeToggle | null {
  if (document.readyState === 'loading') {
    let instance: ThemeToggle | null = null;
    document.addEventListener('DOMContentLoaded', () => {
      instance = new ThemeToggle(config);
    });
    return instance;
  } else {
    return new ThemeToggle(config);
  }
}
