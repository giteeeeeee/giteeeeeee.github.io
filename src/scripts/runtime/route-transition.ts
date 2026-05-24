type TransitionPhase = 'prepare' | 'swap' | 'enter' | 'initial';

type AstroNavigationEvent = Event & {
  direction?: string;
  navigationType?: string;
};

let initialized = false;
let clearTimer = 0;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clearScheduledPhase() {
  if (clearTimer) {
    window.clearTimeout(clearTimer);
    clearTimer = 0;
  }
}

function clearPhase() {
  clearScheduledPhase();
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

export function initRouteTransitions() {
  if (initialized || typeof document === 'undefined') return;
  initialized = true;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleMotionChange = () => {
    if (motionQuery.matches) {
      clearPhase();
    }
  };

  if ('addEventListener' in motionQuery) {
    motionQuery.addEventListener('change', handleMotionChange);
  }

  document.addEventListener('astro:before-preparation', (event) => {
    const navigationEvent = event as AstroNavigationEvent;
    setPhase('prepare', {
      direction: navigationEvent.direction ?? 'forward',
      clearAfter: 4000,
    });
  });

  document.addEventListener('astro:before-swap', () => {
    setPhase('swap', { clearAfter: 4000 });
  });

  document.addEventListener('astro:after-swap', () => {
    setPhase('enter', { clearAfter: 720 });
  });

  window.addEventListener('pagehide', clearPhase);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(runInitialEnter);
    }, { once: true });
  } else {
    requestAnimationFrame(runInitialEnter);
  }
}
