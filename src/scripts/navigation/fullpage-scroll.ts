/**
 * Full-Page Scroll
 * Fullscreen section scrolling with wheel, touch, and keyboard support
 */

export class FullPageScroll {
  private container: HTMLElement;
  private sections: NodeListOf<HTMLElement>;
  private dots: NodeListOf<HTMLButtonElement>;
  private currentSection: number = 0;
  private isAnimating: boolean = false;
  private touchStartY: number = 0;
  private lastScrollTime: number = 0;
  private scrollCooldown: number = 520;
  private wheelDelta: number = 0;
  private wheelResetTimer: number | undefined;
  private animationDuration: number = 560;
  private lastWheelDirection: number = 0;
  private scrollableBySection = new Map<HTMLElement, HTMLElement[]>();
  private dotHandlers = new Map<HTMLButtonElement, EventListener>();
  private animationTimer: number | undefined;
  private readyFrame: number | undefined;
  private destroyed = false;
  private handleWheelBound = (event: WheelEvent) => this.handleWheel(event);
  private handleTouchStartBound = (event: TouchEvent) => this.handleTouchStart(event);
  private handleTouchMoveBound = (event: TouchEvent) => this.handleTouchMove(event);
  private handleKeydownBound = (event: KeyboardEvent) => this.handleKeydown(event);

  constructor() {
    const container = document.getElementById('fullpage-container');
    
    if (!container) {
      throw new Error('[FullPageScroll] Required elements not found');
    }

    this.container = container;
    this.sections = this.container.querySelectorAll('.fullpage-section');
    this.dots = document.querySelectorAll('.section-dot');
    
    this.prepareInitialState();
    this.init();
  }

  private prepareInitialState() {
    this.sections.forEach((section, index) => {
      section.dataset.ready = 'false';
      section.dataset.active = index === 0 ? 'true' : 'false';
      this.scrollableBySection.set(section, this.collectScrollableElements(section));
    });

    this.readyFrame = requestAnimationFrame(() => {
      if (this.destroyed) return;
      this.sections.forEach((section) => {
        section.dataset.ready = 'true';
      });
    });
  }

  private init() {
    const defaultFooter = document.getElementById('default-footer');
    if (defaultFooter) {
      defaultFooter.style.display = 'none';
    }
    
    this.updateSectionPositions();
    
    window.addEventListener('wheel', this.handleWheelBound, { passive: false });
    window.addEventListener('touchstart', this.handleTouchStartBound, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMoveBound, { passive: false });
    window.addEventListener('keydown', this.handleKeydownBound);
    
    this.dots.forEach((dot, index) => {
      const handler = () => this.scrollToSection(index);
      this.dotHandlers.set(dot, handler);
      dot.addEventListener('click', handler);
    });
    
    this.updateDots();
  }

  /**
   * Update section positions
   */
  private updateSectionPositions() {
    this.sections.forEach((section, index) => {
      const offset = (index - this.currentSection) * 100;
      section.style.transform = `translate3d(0, ${offset}%, 0)`;
      const isActive = index === this.currentSection;
      section.dataset.active = isActive ? 'true' : 'false';
    });
  }

  private collectScrollableElements(section: HTMLElement) {
    const elements = Array.from(section.querySelectorAll<HTMLElement>('*'));

    return elements.filter((element) => {
      if (element.scrollHeight <= element.clientHeight + 2) return false;

      const style = window.getComputedStyle(element);
      return /(auto|scroll)/.test(style.overflowY);
    });
  }

  private resetSectionScroll(section: HTMLElement) {
    section.scrollTop = 0;
    const scrollables = this.scrollableBySection.get(section) ?? [];

    scrollables.forEach((element) => {
      element.scrollTop = 0;
    });
  }

  /**
   * Handle mouse wheel events for section navigation
   * Implements cooldown period to prevent rapid scrolling
   */
  private handleWheel(e: WheelEvent) {
    if (this.destroyed) return;

    if (this.shouldLetActiveSectionScroll(e.deltaY, e.target)) {
      return;
    }
    
    // Check if in cooldown period or animating
    const now = Date.now();
    if (this.isAnimating || (now - this.lastScrollTime) < this.scrollCooldown) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    const direction = Math.sign(e.deltaY);
    if (direction !== 0 && direction !== this.lastWheelDirection) {
      this.wheelDelta = 0;
      this.lastWheelDirection = direction;
    }

    this.wheelDelta += e.deltaY;

    if (this.wheelResetTimer) {
      window.clearTimeout(this.wheelResetTimer);
    }
    this.wheelResetTimer = window.setTimeout(() => {
      this.wheelDelta = 0;
    }, 180);

    const threshold = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 5 : 72;
    const directTrigger = Math.abs(e.deltaY) >= threshold * 0.82;

    this.wheelDelta = Math.max(-threshold * 1.6, Math.min(threshold * 1.6, this.wheelDelta));

    if (directTrigger || Math.abs(this.wheelDelta) >= threshold) {
      if (this.wheelDelta > 0) {
        this.scrollDown();
      } else {
        this.scrollUp();
      }
      this.wheelDelta = 0;
      this.lastScrollTime = now;
    }
  }

  private shouldLetActiveSectionScroll(deltaY: number, target?: EventTarget | null) {
    const activeSection = this.sections[this.currentSection];
    if (!activeSection) return false;

    const scrollableElement = this.findScrollableElement(activeSection, target);
    if (!scrollableElement) return false;

    const atTop = scrollableElement.scrollTop <= 0;
    const atBottom = scrollableElement.scrollTop + scrollableElement.clientHeight >= scrollableElement.scrollHeight - 2;

    if (deltaY > 0 && !atBottom) return true;
    if (deltaY < 0 && !atTop) return true;

    return false;
  }

  private findScrollableElement(activeSection: HTMLElement, target?: EventTarget | null): HTMLElement | null {
    let node = target instanceof HTMLElement ? target : null;

    while (node && node !== activeSection.parentElement) {
      if (activeSection.contains(node) && node.scrollHeight > node.clientHeight + 2) {
        const style = window.getComputedStyle(node);
        const canScroll = /(auto|scroll)/.test(style.overflowY);
        if (canScroll) return node;
      }
      node = node.parentElement;
    }

    const activeStyle = window.getComputedStyle(activeSection);
    if (
      /(auto|scroll)/.test(activeStyle.overflowY) &&
      activeSection.scrollHeight > activeSection.clientHeight + 2
    ) {
      return activeSection;
    }

    return null;
  }

  /**
   * Handle touch start event
   * Records initial touch position for swipe detection
   */
  private handleTouchStart(e: TouchEvent) {
    if (this.destroyed) return;
    this.touchStartY = e.touches[0].clientY;
  }

  /**
   * Handle touch move event for swipe navigation
   * Implements cooldown and swipe threshold
   */
  private handleTouchMove(e: TouchEvent) {
    if (this.destroyed) return;
    if (this.isAnimating) return;
    
    const touchEndY = e.touches[0].clientY;
    const diff = this.touchStartY - touchEndY;

    if (this.shouldLetActiveSectionScroll(diff, e.target)) {
      return;
    }

    e.preventDefault();
    
    // Check cooldown time
    const now = Date.now();
    if ((now - this.lastScrollTime) < this.scrollCooldown) {
      return;
    }

    // Swipe threshold: tuned for mobile without making small movements jump pages.
    if (Math.abs(diff) > 68) {
      if (diff > 0) {
        this.scrollDown();
      } else {
        this.scrollUp();
      }
      this.touchStartY = touchEndY;
      this.lastScrollTime = now;
    }
  }

  /**
   * Handle keyboard events for section navigation
   * Supports arrow keys, page up/down, home, and end
   */
  private handleKeydown(e: KeyboardEvent) {
    if (this.destroyed) return;
    if (this.isAnimating) return;
    
    switch(e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        this.scrollDown();
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        this.scrollUp();
        break;
      case 'Home':
        e.preventDefault();
        this.scrollToSection(0);
        break;
      case 'End':
        e.preventDefault();
        this.scrollToSection(this.sections.length - 1);
        break;
    }
  }

  /**
   * Scroll down to next section
   */
  private scrollDown() {
    if (this.currentSection < this.sections.length - 1) {
      this.scrollToSection(this.currentSection + 1);
    }
  }

  /**
   * Scroll up to previous section
   */
  private scrollUp() {
    if (this.currentSection > 0) {
      this.scrollToSection(this.currentSection - 1);
    }
  }

  /**
   * Scroll to specific section by index
   * @param index - Target section index
   */
  private scrollToSection(index: number) {
    if (index < 0 || index >= this.sections.length || this.isAnimating || index === this.currentSection) {
      return;
    }
    
    this.isAnimating = true;
    const targetSection = this.sections[index];
    if (targetSection) {
      this.resetSectionScroll(targetSection);
      requestAnimationFrame(() => this.resetSectionScroll(targetSection));
    }

    this.currentSection = index;
    
    // Update all section positions
    this.updateSectionPositions();
    
    // Update indicators
    this.updateDots();
    
    // Unlock after the CSS transition finishes
    if (this.animationTimer) {
      window.clearTimeout(this.animationTimer);
    }

    this.animationTimer = window.setTimeout(() => {
      this.isAnimating = false;
    }, this.animationDuration);
  }

  /**
   * Update pagination dot indicators
   */
  private updateDots() {
    this.dots.forEach((dot, index) => {
      if (index === this.currentSection) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    window.dispatchEvent(new CustomEvent('reay:fullpage-section', {
      detail: { index: this.currentSection },
    }));
  }

  /**
   * Get current section index
   * @returns Current section index
   */
  public getCurrentSection(): number {
    return this.currentSection;
  }

  /**
   * Manually navigate to specific section (public method)
   * @param index - Target section index
   */
  public goToSection(index: number): void {
    this.scrollToSection(index);
  }

  /**
   * Remove global listeners before Astro swaps this page out.
   */
  public destroy(): void {
    this.destroyed = true;

    window.removeEventListener('wheel', this.handleWheelBound);
    window.removeEventListener('touchstart', this.handleTouchStartBound);
    window.removeEventListener('touchmove', this.handleTouchMoveBound);
    window.removeEventListener('keydown', this.handleKeydownBound);

    this.dotHandlers.forEach((handler, dot) => {
      dot.removeEventListener('click', handler);
      dot.classList.remove('active');
    });
    this.dotHandlers.clear();

    if (this.wheelResetTimer) {
      window.clearTimeout(this.wheelResetTimer);
      this.wheelResetTimer = undefined;
    }

    if (this.animationTimer) {
      window.clearTimeout(this.animationTimer);
      this.animationTimer = undefined;
    }

    if (this.readyFrame) {
      cancelAnimationFrame(this.readyFrame);
      this.readyFrame = undefined;
    }

    this.sections.forEach((section, index) => {
      section.style.transform = index === 0 ? 'translate3d(0, 0, 0)' : '';
      delete section.dataset.ready;
      delete section.dataset.active;
    });

    this.scrollableBySection.clear();
  }
}

/**
 * Auto-initialize full-page scroll
 * @returns FullPageScroll instance or null if DOM not ready
 */
export function initFullPageScroll(): FullPageScroll | null {
  if (!document.getElementById('fullpage-container')) {
    return null;
  }

  if (document.readyState === 'loading') {
    let instance: FullPageScroll | null = null;
    document.addEventListener('DOMContentLoaded', () => {
      instance = new FullPageScroll();
    });
    return instance;
  } else {
    return new FullPageScroll();
  }
}
