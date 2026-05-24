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

const DEFAULT_CONFIG: TypewriterConfig = {
  nameDelay: 300,
  nameSpeed: 80,
  descriptionDelay: 400,
  descriptionSpeed: 60,
  bioDelay: 500,
  socialDelay: 500,
  socialInterval: 200,
};

export class TypewriterEffect {
  private nameElement: HTMLElement | null;
  private descriptionElement: HTMLElement | null;
  private bioContent: HTMLElement | null;
  private socialIcons: NodeListOf<HTMLElement>;
  
  private nameText: string = '';
  private descriptionText: string = '';
  private nameIndex: number = 0;
  private descriptionIndex: number = 0;
  
  private config: TypewriterConfig;
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
    
    this.nameText = this.nameElement.getAttribute('data-text') || '';
    this.descriptionText = this.descriptionElement?.getAttribute('data-text') || '';
    
    // Listen for language change events to restart animation
    window.addEventListener('languagechange', this.handleLanguageChange);
    
    this.start();
  }

  private setTimer(callback: () => void, delay: number) {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, delay);

    this.timers.add(timer);
    return timer;
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
    if (this.destroyed) return;

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
    if (this.destroyed || !this.nameElement) return;
    
    if (this.nameIndex < this.nameText.length) {
      this.nameElement.textContent += this.nameText.charAt(this.nameIndex);
      this.nameIndex++;
      
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
    if (this.destroyed || !this.descriptionElement) return;
    
    if (this.descriptionIndex < this.descriptionText.length) {
      this.descriptionElement.textContent += this.descriptionText.charAt(this.descriptionIndex);
      this.descriptionIndex++;
      
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
    if (this.destroyed) return;

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
    this.socialIcons.forEach((icon, index) => {
      this.setTimer(() => {
        if (this.destroyed) return;
        icon.classList.add('fade-scale');
      }, index * (this.config.socialInterval || 200));
    });
  }

  /**
   * Reset animation to initial state
   */
  public reset() {
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
    if (this.destroyed) return;

    this.reset();
    this.setTimer(() => this.start(), 100);
  }

  public destroy() {
    this.destroyed = true;
    window.removeEventListener('languagechange', this.handleLanguageChange);
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
  }
}

/**
 * Auto-initialize typewriter effect
 * @param config - Optional configuration overrides
 * @returns TypewriterEffect instance or null if DOM not ready
 */
export function initTypewriterEffect(config?: Partial<TypewriterConfig>): TypewriterEffect | null {
  if (document.readyState === 'loading') {
    let instance: TypewriterEffect | null = null;
    document.addEventListener('DOMContentLoaded', () => {
      instance = new TypewriterEffect(config);
    });
    return instance;
  } else {
    return new TypewriterEffect(config);
  }
}
