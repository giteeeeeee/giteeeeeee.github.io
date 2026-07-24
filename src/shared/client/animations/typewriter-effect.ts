/**
 * Typewriter Effect
 * Sequential typing animation for multiple elements with fade-in effects
 */

export interface TypewriterConfig {
  nameDelay?: number;
  nameSpeed?: number;
  descriptionDelay?: number;
  descriptionSpeed?: number;
  bioDelay?: number;
  socialDelay?: number;
  socialInterval?: number;
}

const DEFAULT_CONFIG: Required<TypewriterConfig> = {
  nameDelay: 300,
  nameSpeed: 80,
  descriptionDelay: 400,
  descriptionSpeed: 60,
  bioDelay: 500,
  socialDelay: 500,
  socialInterval: 200,
};

type TypewriterGlobal = Window & {
  __reayTypewriterEffect?: TypewriterEffect;
};

let instanceSeed = 0;

function getTypewriterGlobal() {
  return window as TypewriterGlobal;
}

export class TypewriterEffect {
  private readonly instanceId = `reay-typewriter-${Date.now()}-${++instanceSeed}`;
  private nameElement: HTMLElement | null;
  private descriptionElement: HTMLElement | null;
  private bioContent: HTMLElement | null;
  private socialIcons: NodeListOf<HTMLElement>;
  
  private nameText: string = '';
  private descriptionText: string = '';
  private nameIndex: number = 0;
  private descriptionIndex: number = 0;
  
  private config: Required<TypewriterConfig>;
  private timers = new Set<number>();
  private destroyed = false;
  private handleLanguageChange = () => {
    this.setTimer(() => {
      if (this.destroyed) return;

      this.updateTexts();
      this.restart();
    }, 50);
  };

  constructor(config: Partial<TypewriterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    this.nameElement = document.getElementById('name-typewriter');
    this.descriptionElement = document.getElementById('description-typewriter');
    this.bioContent = document.getElementById('bio-content');
    this.socialIcons = document.querySelectorAll('.social-icon');
    
    if (!this.nameElement) {
      console.warn('[TypewriterEffect] Name element not found');
      return;
    }

    const activeInstance = getTypewriterGlobal().__reayTypewriterEffect;
    if (activeInstance && activeInstance !== this) {
      activeInstance.destroy();
    }

    getTypewriterGlobal().__reayTypewriterEffect = this;
    this.markOwner();
    
    this.nameText = this.nameElement.getAttribute('data-text') || '';
    this.descriptionText = this.descriptionElement?.getAttribute('data-text') || '';
    
    // Listen for language change events to restart animation
    window.addEventListener('languagechange', this.handleLanguageChange);
    
    this.start();
  }

  private markOwner() {
    if (this.nameElement) {
      this.nameElement.dataset.reayTypewriterOwner = this.instanceId;
    }

    if (this.descriptionElement) {
      this.descriptionElement.dataset.reayTypewriterOwner = this.instanceId;
    }
  }

  private releaseOwner() {
    if (this.nameElement?.dataset.reayTypewriterOwner === this.instanceId) {
      delete this.nameElement.dataset.reayTypewriterOwner;
    }

    if (this.descriptionElement?.dataset.reayTypewriterOwner === this.instanceId) {
      delete this.descriptionElement.dataset.reayTypewriterOwner;
    }
  }

  private isActive() {
    return !this.destroyed
      && getTypewriterGlobal().__reayTypewriterEffect === this
      && this.nameElement?.dataset.reayTypewriterOwner === this.instanceId;
  }

  private setTimer(callback: () => void, delay: number) {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      if (!this.isActive()) return;
      callback();
    }, delay);

    this.timers.add(timer);
    return timer;
  }

  private clearTimers() {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
  }
  
  /**
   * Update texts on language change
   */
  private updateTexts() {
    if (this.nameElement) {
      this.nameText = this.nameElement.getAttribute('data-text') || '';
    }
    if (this.descriptionElement) {
      this.descriptionText = this.descriptionElement.getAttribute('data-text') || '';
    }
  }

  /**
   * Start typewriter effect
   */
  private start() {
    if (!this.isActive()) return;

    this.nameIndex = 0;
    this.descriptionIndex = 0;

    // Clear initial content
    if (this.nameElement) this.nameElement.textContent = '';
    if (this.descriptionElement) this.descriptionElement.textContent = '';
    
    this.setTimer(() => {
      this.typeName();
    }, this.config.nameDelay);
  }

  /**
   * Type out the name character by character
   */
  private typeName() {
    if (!this.isActive() || !this.nameElement) return;
    
    if (this.nameIndex < this.nameText.length) {
      this.nameIndex++;
      this.nameElement.textContent = this.nameText.slice(0, this.nameIndex);
      
      this.setTimer(() => this.typeName(), this.config.nameSpeed);
    } else {
      // Name typing complete, remove cursor
      this.nameElement.classList.add('typing-complete');
      
      // Start typing description
      if (this.descriptionElement && this.descriptionText) {
        this.setTimer(() => {
          this.typeDescription();
        }, this.config.descriptionDelay);
      } else {
        // No description, show bio directly
        this.showBio();
      }
    }
  }

  /**
   * Type out the description character by character
   */
  private typeDescription() {
    if (!this.isActive() || !this.descriptionElement) return;
    
    if (this.descriptionIndex < this.descriptionText.length) {
      this.descriptionIndex++;
      this.descriptionElement.textContent = this.descriptionText.slice(0, this.descriptionIndex);
      
      this.setTimer(() => this.typeDescription(), this.config.descriptionSpeed);
    } else {
      // Description typing complete, remove cursor
      this.descriptionElement.classList.add('typing-complete');
      
      // Show bio section
      this.setTimer(() => {
        this.showBio();
      }, this.config.bioDelay);
    }
  }

  /**
   * Show bio with fade-up animation
   */
  private showBio() {
    if (!this.isActive()) return;

    if (this.bioContent) {
      this.bioContent.classList.add('fade-up');
    }
    
    // Show social icons
    this.setTimer(() => {
      this.showSocialIcons();
    }, this.config.socialDelay);
  }

  /**
   * Show social icons with fade-scale animation
   */
  private showSocialIcons() {
    if (!this.isActive()) return;

    this.socialIcons.forEach((icon, index) => {
      this.setTimer(() => {
        if (!this.isActive()) return;
        icon.classList.add('fade-scale');
      }, index * this.config.socialInterval);
    });
  }

  /**
   * Reset animation to initial state
   */
  public reset() {
    if (this.destroyed) return;

    // Reset indices
    this.nameIndex = 0;
    this.descriptionIndex = 0;
    
    // Clear text content
    if (this.nameElement) {
      this.nameElement.textContent = '';
      this.nameElement.classList.remove('typing-complete');
    }
    
    if (this.descriptionElement) {
      this.descriptionElement.textContent = '';
      this.descriptionElement.classList.remove('typing-complete');
    }
    
    // Hide bio and icons
    if (this.bioContent) {
      this.bioContent.classList.remove('fade-up');
    }
    
    this.socialIcons.forEach(icon => {
      icon.classList.remove('fade-scale');
    });
  }

  /**
   * Restart animation from beginning
   */
  public restart() {
    if (!this.isActive()) return;

    this.clearTimers();
    this.reset();
    this.setTimer(() => this.start(), 100);
  }

  public destroy() {
    if (this.destroyed) return;

    this.destroyed = true;
    window.removeEventListener('languagechange', this.handleLanguageChange);
    this.clearTimers();
    this.releaseOwner();

    if (getTypewriterGlobal().__reayTypewriterEffect === this) {
      delete getTypewriterGlobal().__reayTypewriterEffect;
    }
  }
}

/**
 * Auto-initialize typewriter effect
 * @param config - Optional configuration overrides
 * @returns TypewriterEffect instance or null if DOM not ready
 */
export function initTypewriterEffect(config?: Partial<TypewriterConfig>): TypewriterEffect | null {
  const createInstance = () => {
    getTypewriterGlobal().__reayTypewriterEffect?.destroy();
    return new TypewriterEffect(config);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createInstance();
    }, { once: true });
    return null;
  }

  return createInstance();
}
