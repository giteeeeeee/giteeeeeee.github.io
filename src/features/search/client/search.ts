import type { SearchFallbackDocument, SearchDocumentKind } from '../lib/search-data';

type SearchResultKind = SearchDocumentKind | 'project' | 'page';
type SearchSource = 'pagefind' | 'fallback';

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  kind: SearchResultKind;
  date?: string;
}

interface PagefindResultData {
  url: string;
  excerpt?: string;
  plain_excerpt?: string;
  meta?: Record<string, string> & { title?: string; url?: string };
}

interface PagefindModule {
  options?: (options: { baseUrl?: string }) => Promise<void>;
  search: (term: string) => Promise<{
    results: Array<{ data: () => Promise<PagefindResultData> }>;
  }>;
  destroy?: () => Promise<void>;
}

interface ReayI18nApi {
  getCurrentLang: () => 'en' | 'zh';
  translate: (key: string, lang: 'en' | 'zh') => string;
}

type ReayWindow = Window & { __REAY_I18N__?: ReayI18nApi };

const RESULT_PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 180;

let pagefindModulePromise: Promise<PagefindModule> | null = null;
let pagefindModule: PagefindModule | null = null;

function currentLanguage() {
  return document.documentElement.dataset.lang === 'en' ? 'en' : 'zh';
}

function translate(key: string, values: Record<string, string | number> = {}) {
  const api = (window as ReayWindow).__REAY_I18N__;
  let message = api?.translate(key, currentLanguage()) ?? key;

  Object.entries(values).forEach(([name, value]) => {
    message = message.replaceAll(`{${name}}`, String(value));
  });

  return message;
}

function normalizeResultUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl, window.location.origin);
    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return url.toString();
  } catch {
    return rawUrl || '/';
  }
}

function inferResultKind(url: string): SearchResultKind {
  const pathname = normalizeResultUrl(url).split(/[?#]/, 1)[0];
  if (pathname.startsWith('/blog/')) return 'blog';
  if (pathname.startsWith('/gallery/')) return 'plog';
  if (pathname.startsWith('/projects/')) return 'project';
  return 'page';
}

function getExcerptText(value?: string) {
  if (!value) return '';
  const template = document.createElement('template');
  template.innerHTML = value;
  return template.content.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

function parseFallbackDocuments(root: HTMLElement): SearchFallbackDocument[] {
  const payload = root.querySelector<HTMLScriptElement>('[data-search-fallback]')?.textContent;
  if (!payload) return [];

  try {
    const documents = JSON.parse(payload) as SearchFallbackDocument[];
    return Array.isArray(documents) ? documents : [];
  } catch {
    return [];
  }
}

async function loadPagefind(root: HTMLElement, forceReload = false) {
  if (forceReload) {
    await pagefindModule?.destroy?.().catch(() => undefined);
    pagefindModule = null;
    pagefindModulePromise = null;
  }

  if (!pagefindModulePromise) {
    const base = root.dataset.searchBase || '/';
    const moduleUrl = new URL(`${base}pagefind/pagefind.js`, window.location.origin).href;

    pagefindModulePromise = import(/* @vite-ignore */ moduleUrl)
      .then(async (module) => {
        const resolved = module as PagefindModule;
        await resolved.options?.({ baseUrl: base });
        pagefindModule = resolved;
        return resolved;
      })
      .catch((error) => {
        pagefindModulePromise = null;
        pagefindModule = null;
        throw error;
      });
  }

  return pagefindModulePromise;
}

async function searchPagefind(root: HTMLElement, query: string): Promise<SearchResult[]> {
  const module = await loadPagefind(root);
  const response = await module.search(query);
  const settled = await Promise.allSettled(
    response.results.slice(0, 60).map(result => result.data()),
  );

  return settled.flatMap((result) => {
    if (result.status !== 'fulfilled') return [];
    const data = result.value;
    const url = normalizeResultUrl(data.meta?.url || data.url);
    const title = data.meta?.title?.trim();
    if (!title || !url) return [];

    return [{
      url,
      title,
      excerpt: data.plain_excerpt?.trim() || getExcerptText(data.excerpt),
      kind: inferResultKind(url),
    } satisfies SearchResult];
  });
}

function searchFallback(documents: SearchFallbackDocument[], query: string): SearchResult[] {
  const normalizedQuery = query.toLocaleLowerCase().trim();
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  const scoredResults: Array<{ score: number; result: SearchResult }> = [];

  documents.forEach((document) => {
    const title = document.title.toLocaleLowerCase();
    const description = document.description.toLocaleLowerCase();
    const keywords = document.keywords.join(' ').toLocaleLowerCase();
    const haystack = `${title} ${description} ${keywords}`;

    if (!terms.every(term => haystack.includes(term))) return;

    let score = 0;
    if (title === normalizedQuery) score += 80;
    if (title.includes(normalizedQuery)) score += 40;
    if (keywords.includes(normalizedQuery)) score += 24;
    if (description.includes(normalizedQuery)) score += 12;
    score += terms.filter(term => title.includes(term)).length * 8;

    scoredResults.push({
      score,
      result: {
        url: document.url,
        title: document.title,
        excerpt: document.description,
        kind: document.kind,
        date: document.date,
      },
    });
  });

  return scoredResults
    .sort((left, right) => right.score - left.score || right.result.date!.localeCompare(left.result.date!))
    .map(entry => entry.result);
}

function appendHighlightedText(target: HTMLElement, text: string, query: string) {
  const terms = [...new Set(query.trim().split(/\s+/).filter(Boolean))]
    .sort((left, right) => right.length - left.length);

  if (!text || terms.length === 0) {
    target.textContent = text;
    return;
  }

  const escaped = terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const matcher = new RegExp(`(${escaped.join('|')})`, 'giu');
  const matches = text.split(matcher);

  matches.forEach((part) => {
    if (terms.some(term => term.toLocaleLowerCase() === part.toLocaleLowerCase())) {
      const mark = document.createElement('mark');
      mark.textContent = part;
      target.append(mark);
    } else {
      target.append(document.createTextNode(part));
    }
  });
}

function createResultElement(result: SearchResult, query: string) {
  const item = document.createElement('li');
  const link = document.createElement('a');
  const title = document.createElement('h2');
  const meta = document.createElement('span');
  const excerpt = document.createElement('p');

  item.className = 'search-result';
  item.dataset.searchResult = '';
  link.href = result.url;
  title.className = 'search-result-title';
  meta.className = 'search-result-meta';
  excerpt.className = 'search-result-excerpt';

  appendHighlightedText(title, result.title, query);
  appendHighlightedText(excerpt, result.excerpt, query);
  meta.textContent = [translate(`search.kind.${result.kind}`), result.date].filter(Boolean).join(' · ');

  link.append(title, meta);
  if (result.excerpt) link.append(excerpt);
  item.append(link);
  return item;
}

function updateQueryUrl(query: string) {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set('q', query);
  else url.searchParams.delete('q');
  window.history.replaceState(window.history.state, '', url);
}

export function initSearch() {
  const root = document.querySelector<HTMLElement>('[data-search-root]');
  if (!root) return null;

  const form = root.querySelector<HTMLFormElement>('[data-search-form]');
  const input = root.querySelector<HTMLInputElement>('[data-search-input]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-search-clear]');
  const status = root.querySelector<HTMLElement>('[data-search-status]');
  const idle = root.querySelector<HTMLElement>('[data-search-idle]');
  const loading = root.querySelector<HTMLElement>('[data-search-loading]');
  const empty = root.querySelector<HTMLElement>('[data-search-empty]');
  const error = root.querySelector<HTMLElement>('[data-search-error]');
  const retryButton = root.querySelector<HTMLButtonElement>('[data-search-retry]');
  const resultsList = root.querySelector<HTMLOListElement>('[data-search-results]');
  const loadMoreButton = root.querySelector<HTMLButtonElement>('[data-search-load-more]');
  const suggestionButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-search-suggestion]')];

  if (!form || !input || !clearButton || !status || !idle || !loading || !empty || !error || !retryButton || !resultsList || !loadMoreButton) {
    return null;
  }

  const fallbackDocuments = parseFallbackDocuments(root);
  const developmentMode = root.dataset.searchDevelopment === 'true';
  const controller = new AbortController();
  const { signal } = controller;
  let debounceTimer = 0;
  let autofocusFrame = 0;
  let searchGeneration = 0;
  let activeResults: SearchResult[] = [];
  let activeQuery = '';
  let activeSource: SearchSource = 'pagefind';
  let visibleResults = RESULT_PAGE_SIZE;

  const setPrimaryState = (state: 'idle' | 'loading' | 'empty' | 'results') => {
    root.dataset.searchState = state;
    idle.hidden = state !== 'idle';
    loading.hidden = state !== 'loading';
    loading.setAttribute('aria-hidden', String(state !== 'loading'));
    empty.hidden = state !== 'empty';
    resultsList.hidden = state !== 'results';
    loadMoreButton.hidden = state !== 'results' || visibleResults >= activeResults.length;
  };

  const renderResults = () => {
    resultsList.replaceChildren(
      ...activeResults.slice(0, visibleResults).map(result => createResultElement(result, activeQuery)),
    );
    setPrimaryState(activeResults.length > 0 ? 'results' : 'empty');
    error.hidden = activeSource !== 'fallback';
    status.textContent = translate(
      activeSource === 'fallback' ? 'search.status.fallbackResults' : 'search.status.results',
      { query: activeQuery, count: activeResults.length },
    );
  };

  const resetSearch = (updateUrl = true) => {
    searchGeneration += 1;
    activeQuery = '';
    activeResults = [];
    visibleResults = RESULT_PAGE_SIZE;
    resultsList.replaceChildren();
    clearButton.hidden = true;
    error.hidden = true;
    status.textContent = translate('search.idleTitle');
    setPrimaryState('idle');
    if (updateUrl) updateQueryUrl('');
  };

  const runSearch = async (rawQuery: string, options: { updateUrl?: boolean; forcePagefind?: boolean } = {}) => {
    const query = rawQuery.trim();
    window.clearTimeout(debounceTimer);

    if (!query) {
      resetSearch(options.updateUrl !== false);
      return;
    }

    const generation = ++searchGeneration;
    activeQuery = query;
    visibleResults = RESULT_PAGE_SIZE;
    clearButton.hidden = false;
    error.hidden = true;
    status.textContent = translate('search.status.loading', { query });
    setPrimaryState('loading');
    if (options.updateUrl !== false) updateQueryUrl(query);

    try {
      if (developmentMode) throw new Error('Pagefind is generated after the production build.');
      if (options.forcePagefind) await loadPagefind(root, true);
      activeResults = await searchPagefind(root, query);
      activeSource = 'pagefind';
    } catch {
      activeResults = searchFallback(fallbackDocuments, query);
      activeSource = 'fallback';
    }

    if (generation !== searchGeneration) return;
    renderResults();
  };

  const scheduleSearch = () => {
    window.clearTimeout(debounceTimer);
    const query = input.value;
    if (!query.trim()) {
      resetSearch();
      return;
    }
    debounceTimer = window.setTimeout(() => void runSearch(query), SEARCH_DEBOUNCE_MS);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void runSearch(input.value);
  }, { signal });

  input.addEventListener('input', scheduleSearch, { signal });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      input.value = '';
      resetSearch();
      input.blur();
    }
  }, { signal });

  clearButton.addEventListener('click', () => {
    input.value = '';
    resetSearch();
    input.focus({ preventScroll: true });
  }, { signal });

  retryButton.addEventListener('click', () => {
    void runSearch(input.value, { updateUrl: false, forcePagefind: true });
  }, { signal });

  loadMoreButton.addEventListener('click', () => {
    visibleResults += RESULT_PAGE_SIZE;
    renderResults();
  }, { signal });

  suggestionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.searchSuggestion ?? button.textContent?.trim() ?? '';
      void runSearch(input.value);
      input.focus({ preventScroll: true });
    }, { signal });
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isEditable = target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || (target instanceof HTMLElement && target.isContentEditable);

    if (event.key === '/' && !isEditable && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      input.focus({ preventScroll: true });
    }
  }, { signal });

  window.addEventListener('languagechange', () => {
    if (activeQuery) renderResults();
    else status.textContent = translate('search.idleTitle');
  }, { signal });

  const initialQuery = new URLSearchParams(window.location.search).get('q')?.trim() ?? '';
  retryButton.hidden = developmentMode;
  input.value = initialQuery;
  if (initialQuery) {
    void runSearch(initialQuery, { updateUrl: false });
  } else {
    resetSearch(false);
    if (window.matchMedia('(pointer: fine)').matches) {
      autofocusFrame = window.requestAnimationFrame(() => input.focus({ preventScroll: true }));
    }
  }

  return () => {
    searchGeneration += 1;
    window.clearTimeout(debounceTimer);
    if (autofocusFrame) window.cancelAnimationFrame(autofocusFrame);
    controller.abort();
    void pagefindModule?.destroy?.().catch(() => undefined);
  };
}
