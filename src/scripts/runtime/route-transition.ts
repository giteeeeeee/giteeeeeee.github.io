type TransitionPhase = 'prepare' | 'swap' | 'enter' | 'initial';

type AstroNavigationEvent = Event & {
  direction?: string;
  navigationType?: string;
};

let initialized = false;
let clearTimer = 0;
let enterFrame = 0;
let routeStarted = false;

type ReayDocument = Document & {
  __reayStableViewTransitionShim?: boolean;
  __reayNativeStartViewTransition?: Document['startViewTransition'];
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clearScheduledPhase() {
  if (clearTimer) {
    window.clearTimeout(clearTimer);
    clearTimer = 0;
  }

  if (enterFrame) {
    window.cancelAnimationFrame(enterFrame);
    enterFrame = 0;
  }
}

function clearPhase() {
  clearScheduledPhase();
  routeStarted = false;
  delete document.documentElement.dataset.reayRoutePhase;
  delete document.documentElement.dataset.reayRouteDirection;
  document.documentElement.removeAttribute('aria-busy');
}

function setPhase(phase: TransitionPhase, options: { direction?: string; clearAfter?: number } = {}) {
  if (prefersReducedMotion()) {
    clearPhase();
    return;
  }

  clearScheduledPhase();

  const root = document.documentElement;
  root.dataset.reayRoutePhase = phase;
  root.setAttribute('aria-busy', phase === 'prepare' || phase === 'swap' ? 'true' : 'false');

  if (options.direction) {
    root.dataset.reayRouteDirection = options.direction;
  }

  if (options.clearAfter) {
    clearTimer = window.setTimeout(clearPhase, options.clearAfter);
  }
}

function runInitialEnter() {
  const root = document.documentElement;
  if (root.dataset.reayInitialAnimated === 'true') return;

  root.dataset.reayInitialAnimated = 'true';
  setPhase('initial', { clearAfter: 680 });
}

function scheduleEnter(clearAfter = 820) {
  if (enterFrame) {
    window.cancelAnimationFrame(enterFrame);
  }

  enterFrame = window.requestAnimationFrame(() => {
    enterFrame = 0;
    setPhase('enter', { clearAfter });
  });
}

function isHashOnlyNavigation(target: URL) {
  return target.origin === window.location.origin
    && target.pathname === window.location.pathname
    && target.search === window.location.search
    && target.hash.length > 0
    && target.hash !== window.location.hash;
}

function shouldPrepareForLink(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;
  if (anchor.dataset.astroReload !== undefined || anchor.dataset.noTransition !== undefined) return false;

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#')) return false;

  let target: URL;
  try {
    target = new URL(href, window.location.href);
  } catch {
    return false;
  }

  if (!['http:', 'https:'].includes(target.protocol)) return false;
  if (target.origin !== window.location.origin) return false;
  if (isHashOnlyNavigation(target)) return false;

  return true;
}

function installStableViewTransitionShim() {
  const reayDocument = document as ReayDocument;
  if (!reayDocument.startViewTransition || reayDocument.__reayStableViewTransitionShim) return;

  reayDocument.__reayStableViewTransitionShim = true;
  reayDocument.__reayNativeStartViewTransition = reayDocument.startViewTransition.bind(document);

  reayDocument.startViewTransition = ((callback?: () => Promise<void> | void) => {
    const updateCallbackDone = Promise.resolve()
      .then(() => callback?.())
      .then(() => undefined);
    const ready = Promise.resolve();
    const finished = updateCallbackDone.catch(() => undefined).then(() => undefined);

    return {
      ready,
      updateCallbackDone,
      finished,
      skipTransition: () => {},
      types: new Set<string>(),
    };
  }) as Document['startViewTransition'];
}

export function initRouteTransitions() {
  if (initialized || typeof document === 'undefined') return;
  initialized = true;

  installStableViewTransitionShim();

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleMotionChange = () => {
    if (motionQuery.matches) {
      clearPhase();
    }
  };

  if ('addEventListener' in motionQuery) {
    motionQuery.addEventListener('change', handleMotionChange);
  }

  document.addEventListener('click', (event) => {
    const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!anchor || !shouldPrepareForLink(event, anchor)) return;

    routeStarted = true;
    setPhase('prepare', { clearAfter: 4000 });
  }, { capture: true });

  document.addEventListener('astro:before-preparation', (event) => {
    const navigationEvent = event as AstroNavigationEvent;
    routeStarted = true;
    setPhase('prepare', {
      direction: navigationEvent.direction ?? 'forward',
      clearAfter: 4000,
    });
  });

  document.addEventListener('astro:before-swap', () => {
    routeStarted = true;
    setPhase('swap', { clearAfter: 4000 });
  });

  document.addEventListener('astro:after-swap', () => {
    if (routeStarted) {
      scheduleEnter();
      routeStarted = false;
    }
  });

  document.addEventListener('astro:page-load', () => {
    const phase = document.documentElement.dataset.reayRoutePhase;
    if (routeStarted || phase === 'prepare' || phase === 'swap') {
      scheduleEnter();
      routeStarted = false;
    }
  });

  window.addEventListener('pagehide', clearPhase);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      scheduleEnter(680);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(runInitialEnter);
    }, { once: true });
  } else {
    requestAnimationFrame(runInitialEnter);
  }
}
