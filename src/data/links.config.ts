/**
 * Links Configuration
 *
 * Edit `linksConfig` first. Compatibility exports are provided below for older
 * custom code that imports `friendLinks`, `linkCategories`, and related values.
 */

export const linksConfig: LinksConfig = {
  friendLinks: [
    {
      name: 'Astro',
      url: 'https://astro.build',
      avatar: 'https://astro.build/assets/press/astro-icon-light-gradient.svg',
      description: 'Modern static site generator',
      category: 'framework',
      type: 'friend',
      featured: true,
    },
    {
      name: 'Vue.js',
      url: 'https://vuejs.org',
      avatar: 'https://vuejs.org/images/logo.png',
      description: 'Progressive JavaScript framework',
      category: 'framework',
      type: 'friend',
      featured: true,
    },
    {
      name: 'MDN Web Docs',
      url: 'https://developer.mozilla.org',
      avatar: 'https://developer.mozilla.org/favicon-48x48.png',
      description: 'Web developer documentation',
      category: 'resource',
      type: 'site',
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      avatar: 'https://github.githubassets.com/favicons/favicon.png',
      description: 'Code hosting platform',
      category: 'tool',
      type: 'site',
    },
    {
      name: 'Stack Overflow',
      url: 'https://stackoverflow.com',
      avatar: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png',
      description: 'Developer Q&A community',
      category: 'community',
      type: 'site',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/yourusername',
      avatar: 'https://github.githubassets.com/favicons/favicon.png',
      description: 'Code, project experiments, and open-source work',
      category: 'social',
      type: 'social',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/yourusername',
      avatar: 'https://abs.twimg.com/favicons/twitter.ico',
      description: 'Short updates and technical notes',
      category: 'social',
      type: 'social',
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
    title: 'Apply for Link Exchange',
    description: 'Share a personal site, technical blog, or useful resource.',
    contacts: [
      { label: 'Email', value: 'your.email@example.com', icon: 'i-carbon:email' },
      { label: 'GitHub', value: 'github.com/yourusername', icon: 'i-carbon:logo-github' },
      { label: 'Twitter', value: '@yourusername', icon: 'i-carbon:logo-twitter' },
    ],
  },

  mySiteInfo: {
    name: 'Your Site Name',
    url: 'https://your-site.example.com',
    avatar: '/images/profile/avatar.png',
    description: 'Technical notes, project practice, and long-term learning logs',
  },
};

// Backward-compatible exports for older custom code.
export const friendLinks = linksConfig.friendLinks;
export const linkCategories = linksConfig.linkCategories;
export const linkApplicationInfo = linksConfig.linkApplicationInfo;
export const mySiteInfo = linksConfig.mySiteInfo;

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

export interface ContactInfo {
  label: string;
  value: string;
  icon: string;
}

export interface LinkApplicationInfo {
  title: string;
  description: string;
  contacts: ContactInfo[];
}

export interface SiteInfo extends BaseLink {}

export interface LinksConfig {
  friendLinks: FriendLink[];
  linkCategories: LinkCategoriesConfig;
  linkApplicationInfo: LinkApplicationInfo;
  mySiteInfo: SiteInfo;
}
