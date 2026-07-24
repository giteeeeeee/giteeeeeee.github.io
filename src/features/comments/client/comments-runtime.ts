import type { Language } from '@app/config/i18n.config';
import { commentProviderLoaders } from './providers';
import type { CommentClientConfig, CommentUiLabel } from './types';

type Cleanup = () => void;

const sectionCleanups = new Map<HTMLElement, Cleanup>();
let runtimeBound = false;

type I18nWindow = Window & {
  __REAY_I18N__?: {
    getCurrentLang: () => Language;
    translate: (key: string, lang: Language) => string;
  };
};

function getUiText(label: CommentUiLabel) {
  const runtime = (window as I18nWindow).__REAY_I18N__;
  return runtime?.translate(label.key, runtime.getCurrentLang()) || label.fallback;
}

function setLocalizedText(element: HTMLElement, label: CommentUiLabel | null) {
  if (!label) {
    element.removeAttribute('data-i18n');
    element.textContent = '';
    return;
  }

  element.dataset.i18n = label.key;
  element.textContent = getUiText(label);
}

function clearHost(host: HTMLElement) {
  host.replaceChildren();
}

function parseConfig(node: HTMLScriptElement): CommentClientConfig | null {
  try {
    const config = JSON.parse(node.textContent || '{}') as CommentClientConfig;
    return config.provider in commentProviderLoaders ? config : null;
  } catch (error) {
    console.error('[comments] Invalid client configuration:', error);
    return null;
  }
}

function initCommentSection(root: HTMLElement) {
  if (sectionCleanups.has(root)) return;

  const host = root.querySelector<HTMLElement>('[data-comment-host]');
  const feedback = root.querySelector<HTMLElement>('[data-comment-feedback]');
  const button = root.querySelector<HTMLButtonElement>('[data-comment-load]');
  const buttonLabel = button?.querySelector<HTMLElement>('[data-comment-load-label]');
  const configNode = root.querySelector<HTMLScriptElement>('[data-comment-config]');
  if (!host || !feedback || !button || !buttonLabel || !configNode) return;

  const config = parseConfig(configNode);
  if (!config) return;

  const controller = new AbortController();
  let observer: IntersectionObserver | null = null;
  let providerCleanup: Cleanup | null = null;
  let loaded = false;

  const cleanup = () => {
    controller.abort();
    observer?.disconnect();
    observer = null;
    providerCleanup?.();
    providerCleanup = null;
    clearHost(host);
    setLocalizedText(feedback, null);
    host.setAttribute('aria-busy', 'false');
    root.classList.remove('is-loading', 'is-loaded', 'is-error');
    button.hidden = false;
    setLocalizedText(buttonLabel, config.ui.load);
    sectionCleanups.delete(root);
  };
  sectionCleanups.set(root, cleanup);

  const loadComments = async (focusHost = false) => {
    if (loaded) return;

    loaded = true;
    root.classList.remove('is-error');
    root.classList.add('is-loading');
    button.hidden = true;
    setLocalizedText(buttonLabel, config.ui.load);
    clearHost(host);
    setLocalizedText(feedback, config.ui.loading);
    host.setAttribute('aria-busy', 'true');

    try {
      const providerDisposer = await commentProviderLoaders[config.provider](host, config);
      if (controller.signal.aborted) {
        providerDisposer?.();
        return;
      }
      providerCleanup = providerDisposer ?? null;
      root.classList.remove('is-loading');
      root.classList.add('is-loaded');
      setLocalizedText(feedback, null);
      host.setAttribute('aria-busy', 'false');
      if (focusHost) host.focus({ preventScroll: true });
    } catch (error) {
      loaded = false;
      button.hidden = false;
      root.classList.remove('is-loading');
      root.classList.add('is-error');
      setLocalizedText(feedback, config.ui.error);
      host.setAttribute('aria-busy', 'false');
      setLocalizedText(buttonLabel, config.ui.retry);
      if (focusHost) button.focus({ preventScroll: true });
      console.error(`[comments] ${config.provider} failed to load:`, error);
    }
  };

  button.addEventListener('click', () => void loadComments(true), { signal: controller.signal });

  if (!config.autoLoad) return;

  if (!config.lazy || !('IntersectionObserver' in window)) {
    void loadComments(false);
    return;
  }

  observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer?.disconnect();
      void loadComments(false);
    }
  }, { rootMargin: '280px 0px' });

  observer.observe(root);
}

export function initCommentSections() {
  document
    .querySelectorAll<HTMLElement>('[data-comment-section][data-ready="true"]')
    .forEach(initCommentSection);
}

export function cleanupCommentSections() {
  [...sectionCleanups.values()].forEach((cleanup) => cleanup());
  sectionCleanups.clear();
}

export function initCommentsRuntime() {
  initCommentSections();
  if (runtimeBound) return;

  runtimeBound = true;
  document.addEventListener('astro:before-swap', cleanupCommentSections);
  document.addEventListener('astro:page-load', initCommentSections);
}
