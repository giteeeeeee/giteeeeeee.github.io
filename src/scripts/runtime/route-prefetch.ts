type IdleCallbackHandle = number;

type NavigatorConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

let initialized = false;
const prefetched = new Set<string>();
const pending = new Set<string>();

function getConnection(): NavigatorConnection | undefined {
  return (navigator as Navigator & { connection?: NavigatorConnection }).connection;
}

function canIdlePrefetch() {
  const connection = getConnection();
  if (!connection) return true;
  if (connection.saveData) return false;
  return !/^(slow-2g|2g)$/i.test(connection.effectiveType ?? '');
}

function scheduleIdle(callback: () => void): IdleCallbackHandle {
  const idle = window.requestIdleCallback;

  if (idle) {
    return idle(callback, { timeout: 2200 });
  }

  return window.setTimeout(callback, 650);
}

function normalizeDocumentUrl(rawHref: string) {
  const url = new URL(rawHref, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (url.hash && url.pathname === window.location.pathname) return null;
  if (/\.[a-z0-9]{2,8}$/i.test(url.pathname)) return null;

  url.hash = '';
  url.search = '';

  if (url.pathname !== '/' && !url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }

  return url;
}

function prefetchDocument(rawHref: string, reason: 'idle' | 'intent' | 'load' = 'intent') {
  const url = normalizeDocumentUrl(rawHref);
  if (!url) return;

  const href = url.href;
  if (prefetched.has(href) || pending.has(href)) return;
  if (url.pathname === window.location.pathname && !url.search) return;

  pending.add(href);

  const existing = document.querySelector<HTMLLinkElement>(`link[rel="prefetch"][href="${href}"]`);
  if (!existing) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'document';
    link.href = href;
    document.head.appendChild(link);
  }

  const requestInit: RequestInit & { priority?: 'high' | 'low' | 'auto' } = {
    credentials: 'same-origin',
    cache: 'force-cache',
    priority: reason === 'intent' ? 'high' : 'low',
  };

  window
    .fetch(href, requestInit)
    .then((response) => {
      if (response.ok) {
        prefetched.add(href);
      }
    })
    .catch(() => {
      // Prefetch is an optimization only; navigation must not depend on it.
    })
    .finally(() => {
      pending.delete(href);
    });
}

function findPrefetchAnchor(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  return target.closest<HTMLAnchorElement>(
    'a[href][data-reay-prefetch], a[href][data-astro-prefetch], a[href].project-card',
  );
}

function shouldPrefetchAnchor(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;
  if (anchor.dataset.reayPrefetch === 'off') return false;

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/i.test(href)) return false;

  return Boolean(normalizeDocumentUrl(href));
}

function handleIntent(event: Event) {
  const anchor = findPrefetchAnchor(event.target);
  if (!anchor || !shouldPrefetchAnchor(anchor)) return;

  prefetchDocument(anchor.href, 'intent');
}

function prefetchIdleRoutes() {
  if (!canIdlePrefetch()) return;

  scheduleIdle(() => {
    document
      .querySelectorAll<HTMLAnchorElement>('a[href][data-reay-prefetch="idle"], a[href][data-astro-prefetch="load"]')
      .forEach((anchor) => {
        if (shouldPrefetchAnchor(anchor)) {
          prefetchDocument(anchor.href, 'idle');
        }
      });

    if (window.location.pathname !== '/projects/') {
      prefetchDocument('/projects/', 'idle');
    }
  });
}

export function initRoutePrefetch() {
  if (initialized || typeof document === 'undefined') return;
  initialized = true;

  document.addEventListener('pointerenter', handleIntent, true);
  document.addEventListener('focusin', handleIntent);
  document.addEventListener('touchstart', handleIntent, { passive: true, capture: true });
  document.addEventListener('astro:page-load', prefetchIdleRoutes);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prefetchIdleRoutes, { once: true });
  } else {
    prefetchIdleRoutes();
  }
}
