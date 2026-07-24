export const featuresConfig = {
  home: {
    /** `flow` uses normal document scrolling; `snap` enables section-by-section navigation. */
    layout: 'flow' as 'flow' | 'snap',
    /** Homepage showcase limits. Featured content is preferred before recent-content fallback. */
    showcase: {
      posts: 4,
      projects: 2,
      plogAlbums: 2,
    },
  },
  search: {
    /** Search stays available at /search; this controls navigation exposure. */
    showInNavigation: true,
  },
  discovery: {
    /** RSS and Sitemap endpoints are always generated; these control footer links. */
    showRssLink: true,
    showSitemapLink: true,
  },
  i18n: {
    /** The client translation runtime is always present; this controls the switcher. */
    showLanguageSwitcher: true,
  },
  integrations: {
    comments: true,
    githubProjects: true,
    music: false,
    seasonalEffects: false,
  },
} as const

export type FeaturesConfig = typeof featuresConfig
