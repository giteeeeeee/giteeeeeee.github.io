/**
 * Comment and guestbook configuration.
 *
 * The built-in component loads third-party comment systems lazily so blog pages
 * stay fast before readers reach the interaction section.
 */

import { user } from './user.config';

export type CommentProvider = 'giscus' | 'utterances' | 'waline' | 'twikoo' | 'artalk' | 'disqus';

const defaultRepo =
  user.github.username && user.github.username !== 'yourusername'
    ? `${user.github.username}/${user.github.username}.github.io`
    : '';

export const commentsConfig = {
  /** Enable only after the selected provider has been configured and verified. */
  enabled: false,
  provider: 'utterances' as CommentProvider,
  lazy: true,
  /** Third-party scripts require an explicit visitor action by default. */
  autoLoad: false,
  article: {
    enabled: true,
  },
  guestbook: {
    enabled: true,
    route: '/guestbook',
  },
  giscus: {
    repo: '',
    repoId: '',
    category: 'Announcements',
    categoryId: '',
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    lang: 'zh-CN',
  },
  utterances: {
    repo: defaultRepo,
    issueTerm: 'pathname',
    label: 'comment',
  },
  waline: {
    serverURL: '',
    lang: 'zh-CN',
    reaction: true,
    dark: 'html[data-theme="dark"]',
  },
  twikoo: {
    envId: '',
    lang: 'zh-CN',
  },
  artalk: {
    server: '',
    site: user.name,
    locale: 'zh-CN',
  },
  disqus: {
    shortname: '',
  },
} as const;

export type CommentsConfig = typeof commentsConfig;
