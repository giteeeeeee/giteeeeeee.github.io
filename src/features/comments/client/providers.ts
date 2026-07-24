import type {
  CommentClientConfig,
  CommentProviderLoader,
  DisqusConfigContext,
} from './types';

const WALINE_VERSION = '3.15.2';
const ARTALK_VERSION = '2.9.1';
const WALINE_MODULE_URL = `https://unpkg.com/@waline/client@${WALINE_VERSION}/dist/waline.js`;
const ARTALK_MODULE_URL = `https://cdn.jsdelivr.net/npm/artalk@${ARTALK_VERSION}/dist/Artalk.js`;

function getThemeName() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function addStylesheet(id: string, href: string) {
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

const loadGiscus: CommentProviderLoader = (host, config) => {
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.setAttribute('data-repo', config.giscus.repo);
  script.setAttribute('data-repo-id', config.giscus.repoId);
  script.setAttribute('data-category', config.giscus.category);
  script.setAttribute('data-category-id', config.giscus.categoryId);
  script.setAttribute('data-mapping', config.giscus.mapping || 'pathname');
  script.setAttribute('data-term', config.pageKey);
  script.setAttribute('data-strict', config.giscus.strict || '0');
  script.setAttribute('data-reactions-enabled', config.giscus.reactionsEnabled || '1');
  script.setAttribute('data-emit-metadata', config.giscus.emitMetadata || '0');
  script.setAttribute('data-input-position', config.giscus.inputPosition || 'top');
  script.setAttribute('data-theme', getThemeName());
  script.setAttribute('data-lang', config.giscus.lang || 'zh-CN');
  host.appendChild(script);
};

const loadUtterances: CommentProviderLoader = (host, config) => {
  const script = document.createElement('script');
  script.src = 'https://utteranc.es/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.setAttribute('repo', config.utterances.repo);
  script.setAttribute('issue-term', config.utterances.issueTerm || 'pathname');
  script.setAttribute('label', config.utterances.label || 'comment');
  script.setAttribute('theme', getThemeName() === 'dark' ? 'github-dark' : 'github-light');
  host.appendChild(script);
};

const loadWaline: CommentProviderLoader = async (host, config) => {
  addStylesheet('waline-css', `https://unpkg.com/@waline/client@${WALINE_VERSION}/dist/waline.css`);
  const waline = await import(/* @vite-ignore */ WALINE_MODULE_URL) as {
    init(options: Record<string, unknown>): { destroy?: () => void } | void;
  };

  const instance = waline.init({
    el: host,
    serverURL: config.waline.serverURL,
    path: config.pageKey,
    lang: config.waline.lang || 'zh-CN',
    reaction: config.waline.reaction,
    dark: config.waline.dark || 'html[data-theme="dark"]',
  });

  return () => instance?.destroy?.();
};

const loadTwikoo: CommentProviderLoader = (host, config) => new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.all.min.js';
  script.async = true;
  script.onload = async () => {
    await window.twikoo?.init({
      el: host,
      envId: config.twikoo.envId,
      path: config.pageKey,
      lang: config.twikoo.lang || 'zh-CN',
    });
    resolve();
  };
  script.onerror = () => reject(new Error('Twikoo client failed to load.'));
  document.head.appendChild(script);
});

const loadArtalk: CommentProviderLoader = async (host, config) => {
  addStylesheet('artalk-css', `https://cdn.jsdelivr.net/npm/artalk@${ARTALK_VERSION}/dist/Artalk.css`);
  const artalk = await import(/* @vite-ignore */ ARTALK_MODULE_URL) as {
    default: { init(options: Record<string, unknown>): { destroy?: () => void } | void };
  };

  const instance = artalk.default.init({
    el: host,
    pageKey: config.pageKey,
    pageTitle: config.pageTitle,
    server: config.artalk.server,
    site: config.artalk.site,
    locale: config.artalk.locale || 'zh-CN',
  });

  return () => instance?.destroy?.();
};

const loadDisqus: CommentProviderLoader = (host, config) => {
  const thread = document.createElement('div');
  thread.id = 'disqus_thread';
  host.appendChild(thread);

  window.disqus_config = function (this: DisqusConfigContext) {
    this.page.url = window.location.href;
    this.page.identifier = config.pageKey;
    this.page.title = config.pageTitle;
  };

  const script = document.createElement('script');
  script.src = `https://${config.disqus.shortname}.disqus.com/embed.js`;
  script.async = true;
  script.setAttribute('data-timestamp', String(Date.now()));
  host.appendChild(script);

  return () => {
    delete window.disqus_config;
  };
};

export const commentProviderLoaders = {
  giscus: loadGiscus,
  utterances: loadUtterances,
  waline: loadWaline,
  twikoo: loadTwikoo,
  artalk: loadArtalk,
  disqus: loadDisqus,
} satisfies Record<CommentClientConfig['provider'], CommentProviderLoader>;
