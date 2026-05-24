type Cleanup = () => void;

function createScope() {
  const cleanups: Cleanup[] = [];
  const timers = new Set<number>();
  const frames = new Set<number>();

  const on = (
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions | boolean,
  ) => {
    target.addEventListener(type, listener, options);
    cleanups.push(() => target.removeEventListener(type, listener, options));
  };

  const later = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      callback();
    }, delay);

    timers.add(timer);
    return timer;
  };

  const frame = (callback: () => void) => {
    const id = window.requestAnimationFrame(() => {
      frames.delete(id);
      callback();
    });

    frames.add(id);
    return id;
  };

  const cleanup = () => {
    cleanups.splice(0).reverse().forEach((dispose) => dispose());
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
    frames.forEach((id) => window.cancelAnimationFrame(id));
    frames.clear();
  };

  return { on, later, frame, cleanup };
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard API is unavailable in this context.');
  }

  await navigator.clipboard.writeText(text);
}

function shouldShowByCategory(element: HTMLElement, category: string) {
  if (category === 'all') return true;
  if (category === 'featured') return element.dataset.featured === 'true';
  return element.dataset.category === category;
}

function initLinkFilters(scope: ReturnType<typeof createScope>) {
  const tabs = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.category-tabs-container .category-tab[data-group]'),
  );

  if (tabs.length === 0) return;

  document.querySelectorAll<HTMLElement>('[data-link-card]').forEach((card) => {
    card.classList.add('animate-in');
  });

  tabs.forEach((tab) => {
    const handleClick: EventListener = (event) => {
      event.preventDefault();

      const category = tab.dataset.category;
      const groupId = tab.dataset.group;
      if (!category || !groupId) return;

      const groupTabs = document.querySelectorAll<HTMLElement>(
        `.category-tabs-container .category-tab[data-group="${groupId}"]`,
      );
      const groupGrid = document.querySelector<HTMLElement>(`.links-grid[data-group="${groupId}"]`);
      if (!groupGrid) return;

      const cards = groupGrid.querySelectorAll<HTMLElement>('[data-link-card]');

      scope.frame(() => {
        groupTabs.forEach((item) => item.classList.toggle('active', item === tab));

        cards.forEach((card) => {
          const visible = shouldShowByCategory(card, category);
          card.classList.toggle('hidden', !visible);
          card.classList.toggle('animate-in', visible);
        });
      });
    };

    scope.on(tab, 'click', handleClick);
  });
}

function initLinkPreviewLoading(scope: ReturnType<typeof createScope>) {
  const cards = document.querySelectorAll<HTMLElement>('[data-link-card][data-preview-src]');

  cards.forEach((card) => {
    const loadPreview = () => {
      if (card.dataset.previewLoaded === 'true') return;

      const image = card.querySelector<HTMLImageElement>('[data-link-preview]');
      const source = card.dataset.previewSrc;
      if (!image || !source) return;

      card.dataset.previewLoaded = 'true';

      const handleLoad = () => {
        card.classList.add('has-preview');
        card.classList.remove('preview-error');
      };

      const handleError = () => {
        card.classList.add('preview-error');
      };

      scope.on(image, 'load', handleLoad, { once: true });
      scope.on(image, 'error', handleError, { once: true });
      image.src = source;
    };

    scope.on(card, 'pointerenter', loadPreview, { passive: true });
    scope.on(card, 'focusin', loadPreview);

    if (card.matches(':hover') || card.matches(':focus-within')) {
      loadPreview();
    }
  });
}

function initLinksCopy(scope: ReturnType<typeof createScope>) {
  document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach((button) => {
    const handleClick: EventListener = (event) => {
      event.preventDefault();

      void (async () => {
        const row = button.closest<HTMLElement>('.info-row');
        const text = row?.dataset.copy;
        if (!text) return;

        try {
          await copyText(text);

          const icon = button.querySelector<HTMLElement>('i');
          const originalIcon = icon?.getAttribute('class') ?? '';
          button.classList.add('copied');
          icon?.setAttribute('class', 'i-carbon:checkmark-filled');

          scope.later(() => {
            button.classList.remove('copied');
            if (icon && originalIcon) {
              icon.setAttribute('class', originalIcon);
            }
          }, 1800);
        } catch (error) {
          console.error('Copy failed:', error);
        }
      })();
    };

    scope.on(button, 'click', handleClick);
  });

  document.querySelectorAll<HTMLAnchorElement>('.contact-button[data-copy-only="true"]').forEach((button) => {
    const handleClick: EventListener = (event) => {
      event.preventDefault();

      void (async () => {
        const text = button.dataset.contact;
        if (!text) return;

        try {
          await copyText(text);
          button.classList.add('copied');
          scope.later(() => button.classList.remove('copied'), 1600);
        } catch (error) {
          console.error('Copy contact failed:', error);
        }
      })();
    };

    scope.on(button, 'click', handleClick);
  });
}

function initProjectFilters(scope: ReturnType<typeof createScope>) {
  const tabs = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('.projects-categories .category-tab[data-category]'),
  );
  const cards = Array.from(document.querySelectorAll<HTMLElement>('#projects-list .project-card'));

  if (tabs.length === 0 || cards.length === 0) return;

  const applyCategory = (category: string, updateUrl: boolean) => {
    scope.frame(() => {
      tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.category === category));
      cards.forEach((card) => card.classList.toggle('hidden', !shouldShowByCategory(card, category)));
    });

    if (!updateUrl) return;

    const url = new URL(window.location.href);
    if (category === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    window.history.pushState({}, '', url);
  };

  tabs.forEach((tab) => {
    const handleClick: EventListener = (event) => {
      event.preventDefault();
      applyCategory(tab.dataset.category ?? 'all', true);
    };

    scope.on(tab, 'click', handleClick);
  });

  const initialCategory = new URLSearchParams(window.location.search).get('category') ?? 'all';
  applyCategory(initialCategory, false);
}

export function initPageInteractions(): Cleanup {
  const scope = createScope();

  initLinkFilters(scope);
  initLinkPreviewLoading(scope);
  initLinksCopy(scope);
  initProjectFilters(scope);

  return scope.cleanup;
}
