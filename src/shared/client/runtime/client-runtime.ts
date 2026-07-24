import { initMobileMenu, type MobileMenu } from '../mobile-menu';
import { initHistoryBackLinks, initNavigationHistory } from '../navigation/history-back';
import type { FullPageScroll } from '../navigation/fullpage-scroll';
import { initThemeToggle, type ThemeToggle } from '../ui/theme-toggle';
import type { TypewriterEffect } from '../animations/typewriter-effect';
import { initLanguageToggle } from '@features/i18n/client/language-toggle';
import { initRouteTransitions } from './route-transition';
import { initSectionVisibility } from './section-visibility';
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
let sectionVisibilityCleanup: Cleanup | null = null;
let musicDockCleanup: Cleanup | null = null;
let galleryLightboxCleanup: Cleanup | null = null;
let archiveExplorerCleanup: Cleanup | null = null;
let searchCleanup: Cleanup | null = null;
let historyBackCleanup: Cleanup | null = null;
let pageRuntimeGeneration = 0;

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
  pageRuntimeGeneration += 1;

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

  sectionVisibilityCleanup?.();
  sectionVisibilityCleanup = null;

  musicDockCleanup?.();
  musicDockCleanup = null;

  galleryLightboxCleanup?.();
  galleryLightboxCleanup = null;

  archiveExplorerCleanup?.();
  archiveExplorerCleanup = null;

  searchCleanup?.();
  searchCleanup = null;

  historyBackCleanup?.();
  historyBackCleanup = null;

  typewriterEffect?.destroy();
  typewriterEffect = null;
}

function initPageRuntime() {
  cleanupPageRuntime();
  const generation = pageRuntimeGeneration;
  const isCurrent = () => generation === pageRuntimeGeneration;

  mobileMenu = initMobileMenu();
  themeToggle = initThemeToggle();
  floatingHeaderCleanup = initFloatingHeader();
  sectionVisibilityCleanup = initSectionVisibility();
  initLanguageToggle();
  historyBackCleanup = initHistoryBackLinks();

  if (document.querySelector('#fullpage-container[data-home-layout="snap"]')) {
    void import('../navigation/fullpage-scroll').then(({ initFullPageScroll }) => {
      if (!isCurrent()) return;
      fullPageScroll = initFullPageScroll();
    });
  }

  if (document.querySelector('.category-tabs-container, [data-link-card], .copy-btn, #projects-list')) {
    void import('./page-interactions').then(({ initPageInteractions }) => {
      if (!isCurrent()) return;
      pageInteractionsCleanup = initPageInteractions();
    });
  }

  if (document.querySelector('[data-seasonal-effects]')) {
    void import('./seasonal-effects').then(({ initSeasonalEffects }) => {
      if (!isCurrent()) return;
      seasonalEffectsCleanup = initSeasonalEffects();
    });
  }

  if (document.querySelector('[data-music-dock]')) {
    void import('@features/media/client/music-dock').then(({ initMusicDock }) => {
      if (!isCurrent()) return;
      musicDockCleanup = initMusicDock();
    });
  }

  if (document.getElementById('gallery-lightbox')) {
    void import('@features/gallery/client/gallery-lightbox').then(({ initGalleryLightbox }) => {
      if (!isCurrent()) return;
      galleryLightboxCleanup = initGalleryLightbox();
    });
  }

  if (document.querySelector('[data-archive-explorer]')) {
    void import('@features/archives/client/archive-explorer').then(({ initArchiveExplorer }) => {
      if (!isCurrent()) return;
      archiveExplorerCleanup = initArchiveExplorer();
    });
  }

  if (document.querySelector('[data-search-root]')) {
    void import('@features/search/client/search').then(({ initSearch }) => {
      if (!isCurrent()) return;
      searchCleanup = initSearch();
    });
  }

  if (document.getElementById('name-typewriter')) {
    void import('../animations/typewriter-effect').then(({ initTypewriterEffect }) => {
      if (!isCurrent()) return;
      typewriterEffect = initTypewriterEffect();
    });
  }
}

export function initReayClientRuntime() {
  if (bootstrapped) return;
  bootstrapped = true;

  initRouteTransitions();
  initNavigationHistory();
  initThemeSync();

  document.addEventListener('astro:before-swap', cleanupPageRuntime);
  document.addEventListener('astro:page-load', initPageRuntime);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageRuntime, { once: true });
  } else {
    initPageRuntime();
  }
}
