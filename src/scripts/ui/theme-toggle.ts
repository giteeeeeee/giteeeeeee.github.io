/**
 * Theme Toggle
 * Theme switching functionality supporting light/dark/system modes
 */

type ThemeMode = 'light' | 'dark' | 'system';

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
  private mediaQueryList?: MediaQueryList;
  private handleSystemThemeChange = () => {
    if (this.read() === 'system') {
      this.apply('system');
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
    this.apply(this.read());

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

    if (this.mediaQueryList.addEventListener) {
      this.mediaQueryList.addEventListener('change', this.handleSystemThemeChange);
    } else if ((this.mediaQueryList as any).addListener) {
      (this.mediaQueryList as any).addListener(this.handleSystemThemeChange);
    }
  }

  /**
   * Read current theme from storage
   */
  private read(): ThemeMode {
    const v = localStorage.getItem(this.config.storageKey!);
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
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
    switch (mode) {
      case 'dark':
        return '暗色';
      case 'light':
        return '亮色';
      case 'system':
        return '跟随系统';
    }
  }

  /**
   * Apply theme to document
   * @param mode - Theme mode to apply
   */
  private apply(mode: ThemeMode) {
    // Set data-theme attribute
    if (mode === 'system') {
      // When system mode, detect system preference and apply
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.el.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      this.el.setAttribute('data-theme', mode);
    }

    // Save to localStorage
    localStorage.setItem(this.config.storageKey!, mode);

    // Update aria-label for accessibility
    const labelText = `切换主题（当前：${this.label(mode)}）`;
    this.buttons.forEach((button) => {
      const icon = button.querySelector<HTMLElement>('[data-theme-icon]') ||
        document.getElementById(this.config.iconId!) as HTMLElement | null;

      if (icon) {
        icon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          icon.className = this.iconClass(mode);
          icon.style.transform = '';
        }, 150);
      }

      button.setAttribute('aria-label', labelText);
      button.title = labelText;
    });
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

    if (this.mediaQueryList?.removeEventListener) {
      this.mediaQueryList.removeEventListener('change', this.handleSystemThemeChange);
    } else if (this.mediaQueryList && (this.mediaQueryList as any).removeListener) {
      (this.mediaQueryList as any).removeListener(this.handleSystemThemeChange);
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
