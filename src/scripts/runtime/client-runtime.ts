import { initMobileMenu, type MobileMenu } from '../interactions/mobile-menu';
import { initFullPageScroll, type FullPageScroll } from '../navigation/fullpage-scroll';
import { initThemeToggle, type ThemeToggle } from '../ui/theme-toggle';
import { initTypewriterEffect, type TypewriterEffect } from '../animations/typewriter-effect';
import { initUserContentI18n } from '../i18n-user-content';
import { initPageInteractions } from './page-interactions';
import { initRoutePrefetch } from './route-prefetch';
import { initRouteTransitions } from './route-transition';
import { initSeasonalEffects } from './seasonal-effects';
import { initThemeSync } from './theme-sync';

type Cleanup = () => void;

let bootstrapped = false;
let mobileMenu: MobileMenu | null = null;
let themeToggle: ThemeToggle | null = null;
let fullPageScroll: FullPageScroll | null = null;
let floatingHeaderCleanup: Cleanup | null = null;
let pageInteractionsCleanup: Cleanup | null = null;
let typewriterEffect: TypewriterEffect | null = null;
let seasonalEffectsCleanup: Cleanup | null = null;

function initFloatingHeader(): Cleanup | null {
  const header = document.querySelector<HTMLElement>('[data-floating-header]');
  if (!header) return null;

  let fullPageIndex = 0;
  let ticking = false;
  let frame = 0;
  let isFloating = false;

  const update = () => {
    const shouldFloat = window.scrollY > 24 || fullPageIndex > 0;

    if (shouldFloat !== isFloating) {
      header.classList.toggle('is-floating', shouldFloat);
      isFloating = shouldFloat;
    }

    ticking = false;
    frame = 0;
  };

  const requestUpdate = () => {
    if (ticking) return;

    ticking = true;
    frame = requestAnimationFrame(update);
  };

  const handleFullPageSection = (event: Event) => {
    const detail = (event as CustomEvent<{ index?: number }>).detail;
    fullPageIndex = detail?.index ?? 0;
    requestUpdate();
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  window.addEventListener('reay:fullpage-section', handleFullPageSection);

  update();

  return () => {
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
    window.removeEventListener('reay:fullpage-section', handleFullPageSection);

    if (frame) {
      cancelAnimationFrame(frame);
    }

    // Keep the visual state intact during Astro swaps. The old header is about
    // to leave the DOM, and expanding it here creates a visible double image in
    // the View Transition snapshot.
  };
}

function cleanupPageRuntime() {
  fullPageScroll?.destroy();
  fullPageScroll = null;

  mobileMenu?.destroy();
  mobileMenu = null;

  themeToggle?.destroy();
  themeToggle = null;

  floatingHeaderCleanup?.();
  floatingHeaderCleanup = null;

  pageInteractionsCleanup?.();
  pageInteractionsCleanup = null;

  seasonalEffectsCleanup?.();
  seasonalEffectsCleanup = null;

  typewriterEffect?.destroy();
  typewriterEffect = null;
}

function initPageRuntime() {
  cleanupPageRuntime();

  mobileMenu = initMobileMenu();
  themeToggle = initThemeToggle();
  floatingHeaderCleanup = initFloatingHeader();
  fullPageScroll = initFullPageScroll();
  pageInteractionsCleanup = initPageInteractions();
  seasonalEffectsCleanup = initSeasonalEffects();
  initUserContentI18n();

  if (document.getElementById('name-typewriter')) {
    typewriterEffect = initTypewriterEffect();
  }
}

export function initReayClientRuntime() {
  if (bootstrapped) return;
  bootstrapped = true;

  initRouteTransitions();
  initRoutePrefetch();
  initThemeSync();

  document.addEventListener('astro:before-swap', cleanupPageRuntime);
  document.addEventListener('astro:page-load', initPageRuntime);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageRuntime, { once: true });
  } else {
    initPageRuntime();
  }
}
