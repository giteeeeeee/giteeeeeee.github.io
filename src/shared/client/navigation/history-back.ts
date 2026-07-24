type Cleanup = () => void;

interface PendingNavigation {
  from: string;
  to: string;
  timestamp: number;
}

const PENDING_STORAGE_KEY = 'reay:pending-navigation';
const RETURN_STATE_KEY = '__reayReturnTo';
const PENDING_MAX_AGE_MS = 15_000;

let trackerInitialized = false;

function currentRelativeUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function getHistoryState() {
  const state = window.history.state;
  return state && typeof state === 'object'
    ? state as Record<string, unknown>
    : {};
}

function readPendingNavigation(): PendingNavigation | null {
  try {
    const value = window.sessionStorage.getItem(PENDING_STORAGE_KEY);
    if (!value) return null;
    const pending = JSON.parse(value) as PendingNavigation;
    if (!pending.from || !pending.to || Date.now() - pending.timestamp > PENDING_MAX_AGE_MS) {
      window.sessionStorage.removeItem(PENDING_STORAGE_KEY);
      return null;
    }
    return pending;
  } catch {
    return null;
  }
}

function clearPendingNavigation() {
  try {
    window.sessionStorage.removeItem(PENDING_STORAGE_KEY);
  } catch {
    // Navigation remains usable without session storage.
  }
}

function applyPendingNavigation() {
  const pending = readPendingNavigation();
  if (!pending || pending.to !== currentRelativeUrl()) return;

  window.history.replaceState({
    ...getHistoryState(),
    [RETURN_STATE_KEY]: pending.from,
  }, '', window.location.href);
  clearPendingNavigation();
}

function trackInternalNavigation(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const target = event.target;
  if (!(target instanceof Element)) return;
  const anchor = target.closest<HTMLAnchorElement>('a[href]');
  if (!anchor || anchor.hasAttribute('data-history-back')) return;
  if (anchor.target && anchor.target !== '_self') return;
  if (anchor.hasAttribute('download')) return;

  let destination: URL;
  try {
    destination = new URL(anchor.href, window.location.href);
  } catch {
    return;
  }

  if (destination.origin !== window.location.origin) return;

  const from = currentRelativeUrl();
  const to = `${destination.pathname}${destination.search}${destination.hash}`;
  if (from === to || (destination.pathname === window.location.pathname && destination.search === window.location.search)) {
    return;
  }

  try {
    window.sessionStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify({
      from,
      to,
      timestamp: Date.now(),
    } satisfies PendingNavigation));
  } catch {
    // The href remains a fully functional fallback when storage is unavailable.
  }
}

export function initNavigationHistory() {
  if (trackerInitialized || typeof document === 'undefined') return;
  trackerInitialized = true;

  applyPendingNavigation();
  document.addEventListener('click', trackInternalNavigation, { capture: true });
  document.addEventListener('astro:after-swap', applyPendingNavigation);
  document.addEventListener('astro:page-load', applyPendingNavigation);
}

function getSameOriginReferrer() {
  if (!document.referrer) return '';
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin !== window.location.origin) return '';
    return `${referrer.pathname}${referrer.search}${referrer.hash}`;
  } catch {
    return '';
  }
}

export function initHistoryBackLinks(): Cleanup | null {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-history-back]')];
  if (links.length === 0) return null;

  const controller = new AbortController();
  const timers = new Set<number>();

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const stateReturnTo = getHistoryState()[RETURN_STATE_KEY];
      const returnTo = typeof stateReturnTo === 'string'
        ? stateReturnTo
        : getSameOriginReferrer();

      if (!returnTo || returnTo === currentRelativeUrl()) return;

      event.preventDefault();
      const currentUrl = window.location.href;
      window.history.back();

      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (window.location.href === currentUrl) {
          window.location.assign(link.href);
        }
      }, 700);
      timers.add(timer);
    }, { signal: controller.signal });
  });

  return () => {
    controller.abort();
    timers.forEach(timer => window.clearTimeout(timer));
    timers.clear();
  };
}
