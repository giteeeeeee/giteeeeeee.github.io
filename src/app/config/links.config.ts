/**
 * Links Configuration
 *
 * This file owns link-page behavior and curated external entries only.
 * Personal contact and site information come from `user.config.ts` through
 * `site.config.ts`; do not duplicate them here.
 */

export const linksConfig: LinksConfig = {
  previews: {
    // Automatic screenshots are loaded lazily; failed requests fall back to
    // the enlarged avatar backdrop rendered by LinkCard.
    provider: 'microlink',
    endpoint: 'https://api.microlink.io/',
  },
  friendLinks: [
    {
      name: 'Astro',
      url: 'https://astro.build',
      avatar: 'https://astro.build/assets/press/astro-icon-light-gradient.svg',
      description: 'links.catalog.astro',
      category: 'framework',
      type: 'friend',
      featured: true,
    },
    {
      name: 'Vue.js',
      url: 'https://vuejs.org',
      avatar: 'https://vuejs.org/images/logo.png',
      description: 'links.catalog.vue',
      category: 'framework',
      type: 'friend',
      featured: true,
    },
    {
      name: 'MDN Web Docs',
      url: 'https://developer.mozilla.org',
      avatar: 'https://developer.mozilla.org/favicon-48x48.png',
      description: 'links.catalog.mdn',
      category: 'resource',
      type: 'site',
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      avatar: 'https://github.githubassets.com/favicons/favicon.png',
      description: 'links.catalog.github',
      category: 'tool',
      type: 'site',
    },
    {
      name: 'Stack Overflow',
      url: 'https://stackoverflow.com',
      avatar: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png',
      description: 'links.catalog.stackOverflow',
      category: 'community',
      type: 'site',
    },
  ],

  linkCategories: {
    friend: [
      { id: 'all', label: 'All', icon: 'i-carbon:apps' },
      { id: 'featured', label: 'Featured', icon: 'i-carbon:star-filled' },
      { id: 'framework', label: 'Framework', icon: 'i-carbon:code' },
      { id: 'tool', label: 'Tool', icon: 'i-carbon:tool-box' },
    ],
    site: [
      { id: 'all', label: 'All', icon: 'i-carbon:apps' },
      { id: 'resource', label: 'Resource', icon: 'i-carbon:book' },
      { id: 'tool', label: 'Tool', icon: 'i-carbon:tool-box' },
      { id: 'community', label: 'Community', icon: 'i-carbon:user-multiple' },
    ],
    social: [
      { id: 'all', label: 'All', icon: 'i-carbon:apps' },
    ],
  },

  linkApplicationInfo: {
    description: 'links.apply.intro',
  },
};

export interface LinkPreviewConfig {
  provider: 'none' | 'microlink';
  endpoint: string;
}

export type LinkType = 'friend' | 'site' | 'social';

export interface BaseLink {
  name: string;
  url: string;
  avatar: string;
  description: string;
}

export interface FriendLink extends BaseLink {
  category?: string;
  type: LinkType;
  featured?: boolean;
  screenshot?: string;
}

export interface LinkCategoryItem {
  id: string;
  label: string;
  icon: string;
}

export interface LinkCategoriesConfig {
  friend: LinkCategoryItem[];
  site: LinkCategoryItem[];
  social: LinkCategoryItem[];
}

export interface LinkApplicationInfo {
  description: string;
}

export interface LinksConfig {
  previews: LinkPreviewConfig;
  friendLinks: FriendLink[];
  linkCategories: LinkCategoriesConfig;
  linkApplicationInfo: LinkApplicationInfo;
}
