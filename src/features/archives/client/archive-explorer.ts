type Cleanup = () => void;
type ArchiveKind = 'all' | 'blog' | 'plog';

function isArchiveKind(value: string | null | undefined): value is ArchiveKind {
  return value === 'all' || value === 'blog' || value === 'plog';
}

export function initArchiveExplorer(): Cleanup {
  const root = document.querySelector<HTMLElement>('[data-archive-explorer]');
  if (!root) return () => {};

  const controller = new AbortController();
  const options = { signal: controller.signal };
  const filters = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-archive-filter]'));
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-archive-row]'));
  const years = Array.from(root.querySelectorAll<HTMLElement>('[data-archive-year]'));
  const yearLinks = Array.from(root.querySelectorAll<HTMLElement>('[data-archive-year-link]'));
  const popularPanels = Array.from(root.querySelectorAll<HTMLElement>('[data-archive-topic-panel]'));
  const dialogPanels = Array.from(root.querySelectorAll<HTMLElement>('[data-archive-topic-dialog-panel]'));
  const topicButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-archive-topic]'));
  const seriesShelf = root.querySelector<HTMLElement>('[data-archive-series-shelf]');
  const collectionPanel = root.querySelector<HTMLElement>('[data-archive-collection-panel]');
  const results = root.querySelector<HTMLElement>('[data-archive-results]');
  const resultCount = root.querySelector<HTMLElement>('[data-archive-result-count]');
  const activeTopicText = root.querySelector<HTMLElement>('[data-archive-active-topic]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-archive-clear]');
  const empty = root.querySelector<HTMLElement>('[data-archive-empty]');
  const dialog = root.querySelector<HTMLDialogElement>('[data-archive-topic-dialog]');
  const dialogOpeners = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-archive-topic-dialog-open]'));
  const dialogClose = root.querySelector<HTMLButtonElement>('[data-archive-topic-dialog-close]');
  const topicSearch = root.querySelector<HTMLInputElement>('[data-archive-topic-search]');
  const topicSearchEmpty = root.querySelector<HTMLElement>('[data-archive-topic-search-empty]');
  const sortButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-archive-topic-sort]'));
  let activeKind: ArchiveKind = 'all';
  let activeTopic = '';
  let activeTopicLabel = '';
  let activeSort: 'popular' | 'alphabetical' = 'popular';
  let scrollFrame = 0;

  const updateUrl = (replace = false) => {
    const url = new URL(window.location.href);
    if (activeKind === 'all') url.searchParams.delete('type');
    else url.searchParams.set('type', activeKind);
    if (activeTopic) url.searchParams.set('topic', activeTopic);
    else url.searchParams.delete('topic');
    window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
  };

  const sortTopicLists = () => {
    root.querySelectorAll<HTMLElement>('[data-archive-topic-list]').forEach((list) => {
      const items = Array.from(list.querySelectorAll<HTMLButtonElement>('[data-archive-topic-item]'));
      items.sort((left, right) => {
        if (activeSort === 'alphabetical') {
          return (left.dataset.archiveTopicLabel ?? '').localeCompare(right.dataset.archiveTopicLabel ?? '');
        }
        return Number(right.dataset.archiveTopicCount ?? 0) - Number(left.dataset.archiveTopicCount ?? 0)
          || (left.dataset.archiveTopicLabel ?? '').localeCompare(right.dataset.archiveTopicLabel ?? '');
      });
      items.forEach((item) => list.append(item));
    });
    sortButtons.forEach((button) => {
      const selected = button.dataset.archiveTopicSort === activeSort;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  };

  const filterTopicDialog = () => {
    const query = topicSearch?.value.trim().toLocaleLowerCase() ?? '';
    const activePanel = dialogPanels.find((panel) => panel.dataset.archiveTopicDialogPanel === activeKind);
    let visibleCount = 0;

    activePanel?.querySelectorAll<HTMLElement>('[data-archive-topic-group]').forEach((group) => {
      let groupCount = 0;
      group.querySelectorAll<HTMLButtonElement>('[data-archive-topic-item]').forEach((button) => {
        const visible = !query || (button.dataset.archiveTopicLabel ?? '').toLocaleLowerCase().includes(query);
        button.hidden = !visible;
        if (visible) {
          visibleCount += 1;
          groupCount += 1;
        }
      });
      group.hidden = groupCount === 0;
    });

    if (topicSearchEmpty) topicSearchEmpty.hidden = visibleCount > 0;
  };

  const apply = () => {
    let visibleCount = 0;

    rows.forEach((row) => {
      const matchesKind = activeKind === 'all' || row.dataset.archiveKind === activeKind;
      const topics = JSON.parse(row.dataset.archiveTopics ?? '[]') as string[];
      const matchesTopic = !activeTopic || topics.includes(activeTopic);
      row.hidden = !(matchesKind && matchesTopic);
      if (!row.hidden) visibleCount += 1;
    });

    years.forEach((year) => {
      const visibleRows = Array.from(year.querySelectorAll<HTMLElement>('[data-archive-row]'))
        .filter((row) => !row.hidden);
      year.hidden = visibleRows.length === 0;
      const count = year.querySelector<HTMLElement>('[data-year-count]');
      if (count) count.textContent = String(visibleRows.length);
    });

    yearLinks.forEach((link) => {
      const year = link.dataset.archiveYearLink;
      link.hidden = !years.some((section) => section.dataset.archiveYear === year && !section.hidden);
    });

    filters.forEach((filter) => {
      const selected = filter.dataset.archiveFilter === activeKind;
      filter.classList.toggle('is-active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    popularPanels.forEach((panel) => { panel.hidden = panel.dataset.archiveTopicPanel !== activeKind; });
    dialogPanels.forEach((panel) => { panel.hidden = panel.dataset.archiveTopicDialogPanel !== activeKind; });
    topicButtons.forEach((button) => {
      const selected = button.dataset.archiveTopic === activeTopic;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    if (seriesShelf) seriesShelf.hidden = activeKind === 'plog';
    if (collectionPanel) collectionPanel.hidden = activeKind !== 'plog';
    if (resultCount) resultCount.textContent = String(visibleCount);
    if (activeTopicText) {
      activeTopicText.hidden = !activeTopic;
      activeTopicText.textContent = activeTopic ? `· ${activeTopicLabel}` : '';
    }
    if (clearButton) clearButton.hidden = !activeTopic;
    if (empty) empty.hidden = visibleCount > 0;
    filterTopicDialog();
  };

  const readUrlState = () => {
    const url = new URL(window.location.href);
    const requestedKind = url.searchParams.get('type');
    activeKind = isArchiveKind(requestedKind) ? requestedKind : 'all';
    activeTopic = url.searchParams.get('topic') ?? '';
    const matchingButton = topicButtons.find((button) => button.dataset.archiveTopic === activeTopic);
    activeTopicLabel = matchingButton?.dataset.archiveTopicLabel ?? activeTopic.split(':').slice(1).join(':');
  };

  const revealResults = () => {
    if (!results) return;
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      results.focus({ preventScroll: true });
      results.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  };

  const closeDialog = () => {
    if (!dialog?.open) return;
    dialog.close();
  };

  const selectTopic = (button: HTMLButtonElement) => {
    const topic = button.dataset.archiveTopic ?? '';
    const requestedKind = button.dataset.archiveTopicKind;
    if (isArchiveKind(requestedKind)) activeKind = requestedKind;
    activeTopic = activeTopic === topic ? '' : topic;
    activeTopicLabel = activeTopic ? (button.dataset.archiveTopicLabel ?? '') : '';
    closeDialog();
    apply();
    updateUrl();
    revealResults();
  };

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const requestedKind = filter.dataset.archiveFilter;
      activeKind = isArchiveKind(requestedKind) ? requestedKind : 'all';
      activeTopic = '';
      activeTopicLabel = '';
      apply();
      updateUrl();
    }, options);
  });

  topicButtons.forEach((button) => {
    button.addEventListener('click', () => selectTopic(button), options);
  });

  clearButton?.addEventListener('click', () => {
    activeTopic = '';
    activeTopicLabel = '';
    apply();
    updateUrl();
    revealResults();
  }, options);

  dialogOpeners.forEach((opener) => {
    opener.addEventListener('click', () => {
      if (!dialog || dialog.open) return;
      if (topicSearch) topicSearch.value = '';
      apply();
      sortTopicLists();
      dialog.showModal();
      topicSearch?.focus();
    }, options);
  });
  dialogClose?.addEventListener('click', closeDialog, options);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  }, options);

  topicSearch?.addEventListener('input', filterTopicDialog, options);
  sortButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeSort = button.dataset.archiveTopicSort === 'alphabetical' ? 'alphabetical' : 'popular';
      sortTopicLists();
    }, options);
  });

  window.addEventListener('popstate', () => {
    readUrlState();
    apply();
  }, options);

  readUrlState();
  apply();
  updateUrl(true);

  return () => {
    controller.abort();
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    if (dialog?.open) dialog.close();
  };
}
