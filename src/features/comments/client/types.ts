import type { CommentProvider, CommentsConfig } from '@app/config/comments.config';

export interface CommentClientConfig {
  provider: CommentProvider;
  providerLabel: string;
  pageKey: string;
  pageTitle: string;
  autoLoad: boolean;
  lazy: boolean;
  ui: {
    load: CommentUiLabel;
    retry: CommentUiLabel;
    loading: CommentUiLabel;
    error: CommentUiLabel;
  };
  giscus: CommentsConfig['giscus'];
  utterances: CommentsConfig['utterances'];
  waline: CommentsConfig['waline'];
  twikoo: CommentsConfig['twikoo'];
  artalk: CommentsConfig['artalk'];
  disqus: CommentsConfig['disqus'];
}

export interface CommentUiLabel {
  key: string;
  fallback: string;
}

export type CommentProviderLoader = (
  host: HTMLElement,
  config: CommentClientConfig,
) => void | (() => void) | Promise<void | (() => void)>;

interface TwikooClient {
  init(options: {
    el: HTMLElement;
    envId: string;
    path: string;
    lang: string;
  }): void | Promise<void>;
}

interface DisqusPageConfig {
  url?: string;
  identifier?: string;
  title?: string;
}

export interface DisqusConfigContext {
  page: DisqusPageConfig;
}

declare global {
  interface Window {
    twikoo?: TwikooClient;
    disqus_config?: (this: DisqusConfigContext) => void;
  }
}
