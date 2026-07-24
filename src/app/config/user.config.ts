/**
 * User Configuration
 *
 * Edit the four sections below first:
 * 1. Identity and public contact
 * 2. Multilingual intro copy
 * 3. Site information
 * 4. About page content
 */

import { defaultLang, type Language } from './i18n.config';

// ---------------------------------------------------------------------------
// 1. Identity and public contact
// ---------------------------------------------------------------------------

export const user = {
  name: 'YOUR_NAME',
  avatar: '/images/profile/avatar.png',
  /** Optional public profile detail. Leave empty to hide it everywhere. */
  location: 'YOUR_LOCATION',

  /**
   * The only source for public contact details.
   * Home, About, Links, and Footer all consume these values through site.config.
   */
  contact: {
    email: 'your.email@example.com',
    /** Full public Twitter/X profile URL. Leave empty to hide it everywhere. */
    twitter: 'https://x.com/yourusername',
    website: 'https://yourusername.github.io',
    additionalLinks: [] as AdditionalContactLink[],
  },

  /** The GitHub profile URL is derived from this username. */
  github: {
    username: 'yourusername',
    token: '',
  },
} satisfies User;

// ---------------------------------------------------------------------------
// 2. Multilingual intro copy
// ---------------------------------------------------------------------------

export const userContent = {
  en: {
    role: 'YOUR_ROLE',
    tagline: 'YOUR_TAGLINE',
    bio: 'YOUR_SHORT_BIO',
    status: 'YOUR_CURRENT_STATUS',
    focus: ['YOUR_FOCUS_1', 'YOUR_FOCUS_2', 'YOUR_FOCUS_3', 'YOUR_FOCUS_4'],
    story: {
      title: 'YOUR_STORY_TITLE',
      lead: 'YOUR_STORY_LEAD',
      body: ['YOUR_STORY_PARAGRAPH_1', 'YOUR_STORY_PARAGRAPH_2'],
      principles: ['YOUR_PRINCIPLE_1', 'YOUR_PRINCIPLE_2', 'YOUR_PRINCIPLE_3'],
    },
    greeting: 'YOUR_GREETING',
    description: 'YOUR_SITE_DESCRIPTION',
  },
  zh: {
    role: '你的身份或职业',
    tagline: '你的个人标语',
    bio: '你的个人简介',
    status: '你的当前状态',
    focus: ['你的关注方向 1', '你的关注方向 2', '你的关注方向 3', '你的关注方向 4'],
    story: {
      title: '你的故事标题',
      lead: '你的故事引言',
      body: ['你的故事正文 1', '你的故事正文 2'],
      principles: ['你的原则 1', '你的原则 2', '你的原则 3'],
    },
    greeting: '你的问候语',
    description: '你的站点简介',
  },
} satisfies UserContent;

// ---------------------------------------------------------------------------
// 3. Site information
// ---------------------------------------------------------------------------

export const site = {
  /** Keep true while this repository still contains template placeholders. */
  templateMode: true,
  builtWith: 'site.tech.description',
  since: 'YYYY',
  techStack: [
    { name: 'Astro', description: 'about.tool.astro', url: 'https://astro.build/', icon: 'i-carbon:rocket' },
    { name: 'UnoCSS', description: 'about.tool.unocss', url: 'https://unocss.dev/', icon: 'i-carbon:color-palette' },
    { name: 'TypeScript', description: 'about.tool.typescript', url: 'https://www.typescriptlang.org/', icon: 'i-carbon:code' },
  ],
} satisfies SiteDetails;

// ---------------------------------------------------------------------------
// 4. About page content
// ---------------------------------------------------------------------------

export const aboutConfig = {
  sections: [
    {
      id: 'dev-tools',
      title: 'about.dev-tools.title',
      description: 'about.dev-tools.subtitle',
      icon: 'i-carbon:development',
      columns: 3,
      compact: false,
      colorTheme: 'primary',
      items: [
        { name: 'Astro', description: 'about.tool.astro', url: 'https://astro.build/', icon: 'i-carbon:rocket' },
        { name: 'TypeScript', description: 'about.tool.typescript', url: 'https://www.typescriptlang.org/', icon: 'i-carbon:code' },
        { name: 'UnoCSS', description: 'about.tool.unocss', url: 'https://unocss.dev/', icon: 'i-carbon:color-palette' },
        { name: 'GitHub', description: 'about.tool.github', url: 'https://github.com/', icon: 'i-carbon:logo-github' },
      ],
    },
    {
      id: 'productivity',
      title: 'about.productivity.title',
      description: 'about.productivity.subtitle',
      icon: 'i-carbon:rocket',
      columns: 4,
      compact: true,
      colorTheme: 'secondary',
      items: [
        { name: 'Git', description: 'about.tool.git', url: 'https://git-scm.com/', icon: 'i-carbon:branch' },
        { name: 'Markdown', description: 'about.tool.markdown', url: 'https://commonmark.org/', icon: 'i-carbon:document' },
        { name: 'Pagefind', description: 'about.tool.pagefind', url: 'https://pagefind.app/', icon: 'i-carbon:search' },
        { name: 'Playwright', description: 'about.tool.playwright', url: 'https://playwright.dev/', icon: 'i-carbon:test-tool' },
      ],
    },
    {
      id: 'interests',
      title: 'about.interests.title',
      description: 'about.interests.subtitle',
      icon: 'i-carbon:favorite',
      columns: 4,
      compact: true,
      colorTheme: 'accent',
      items: [
        { name: 'about.interest.openSource', description: 'about.tool.openSource', icon: 'i-carbon:logo-github' },
        { name: 'about.interest.technicalWriting', description: 'about.tool.technicalWriting', icon: 'i-carbon:book' },
        { name: 'about.interest.webDesign', description: 'about.tool.webDesign', icon: 'i-carbon:color-palette' },
        { name: 'about.interest.performance', description: 'about.tool.performance', icon: 'i-carbon:chart-line' },
      ],
    },
  ],

  education: [] as Education[],

  experience: [] as Experience[],

  timeline: [] as TimelineEvent[],
} satisfies AboutConfig;

// ---------------------------------------------------------------------------
// Helper exports
// ---------------------------------------------------------------------------

export function getUserContent(lang: Language = defaultLang) {
  return {
    ...user,
    ...userContent[lang],
  };
}

export const userConfig = {
  user,
  userContent,
  site,
  aboutConfig,
} satisfies UserConfig;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AdditionalContactLink {
  /** Stable key used for deduplication and DOM hooks. */
  id: string;
  icon: string;
  label: string;
  url: string;
  /** Optional short value such as @username; the URL host is used otherwise. */
  displayValue?: string;
}

export interface GithubUserConfig {
  username: string;
  token?: string;
}

export interface User {
  name: string;
  avatar: string;
  location?: string;
  contact: {
    email?: string;
    twitter?: string;
    website?: string;
    additionalLinks: AdditionalContactLink[];
  };
  github: GithubUserConfig;
}

export interface UserContentLanguage {
  role?: string;
  tagline: string;
  bio: string;
  status?: string;
  focus?: string[];
  story?: {
    title: string;
    lead: string;
    body: string[];
    principles: string[];
  };
  greeting: string;
  description: string;
}

export interface UserContent {
  en: UserContentLanguage;
  zh: UserContentLanguage;
}

export interface AboutSectionItem {
  name: string;
  description?: string;
  url?: string;
  icon?: string;
}

export interface AboutSection {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  columns: 2 | 3 | 4 | 5;
  compact: boolean;
  colorTheme: 'primary' | 'secondary' | 'tertiary' | 'accent';
  items: AboutSectionItem[];
}

export interface Education {
  school: string;
  major?: string;
  degree: string;
  startDate: string;
  endDate: string;
  logo?: string;
  url?: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  logo?: string;
  url?: string;
  description?: string;
}

export interface TechStackItem {
  name: string;
  description: string;
  url: string;
  icon: string;
}

export interface SiteDetails {
  templateMode: boolean;
  builtWith: string;
  since: string;
  techStack: TechStackItem[];
}

export interface TimelineEvent {
  year: string;
  event: string;
  description?: string;
}

export interface AboutConfig {
  sections: AboutSection[];
  education: Education[];
  experience: Experience[];
  timeline: TimelineEvent[];
}

export interface UserConfig {
  user: User;
  userContent: UserContent;
  site: SiteDetails;
  aboutConfig: AboutConfig;
}
