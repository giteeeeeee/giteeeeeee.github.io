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
  name: 'giteeeeeee',
  avatar: '/images/profile/avatar.png',
  /** Optional public profile detail. Leave empty to hide it everywhere. */
  location: '',

  /**
   * The only source for public contact details.
   * Home, About, Links, and Footer all consume these values through site.config.
   */
  contact: {
    email: '',
    /** Full public Twitter/X profile URL. Leave empty to hide it everywhere. */
    twitter: '',
    website: 'https://giteeeeeee.github.io',
    additionalLinks: [] as AdditionalContactLink[],
  },

  /** The GitHub profile URL is derived from this username. */
  github: {
    username: 'giteeeeeee',
    token: '',
  },
} satisfies User;

// ---------------------------------------------------------------------------
// 2. Multilingual intro copy
// ---------------------------------------------------------------------------

export const userContent = {
  en: {
    role: 'Fitness Enthusiast',
    tagline: 'Documenting my fitness training journey',
    bio: 'Recording strength training, running, and posture recovery.',
    status: 'Training consistently',
    focus: ['Strength Training', 'Running', 'Posture & Recovery', 'Experience'],
    story: {
      title: 'My Training Story',
      lead: 'Starting from zero, witnessing every step of progress.',
      body: [
        'This site records my physical training growth, including strength training, running and posture recovery.',
        'Every photo album and article is a milestone of my progress.',
      ],
      principles: ['Consistency', 'Science', 'Record'],
    },
    greeting: 'Welcome to my training log',
    description: 'Recording my fitness training growth and experience',
  },
  zh: {
    role: '体能训练爱好者',
    tagline: '记录体能训练的成长与经验',
    bio: '一个坚持训练的普通人，记录力量训练、跑步与体态康复的点滴。',
    status: '坚持训练中',
    focus: ['力量训练', '跑步', '体态康复', '经验总结'],
    story: {
      title: '我的训练故事',
      lead: '从零开始，用记录见证每一次进步。',
      body: [
        '这里记录我的体能训练成长，涵盖力量训练、跑步与体态康复。',
        '每一个相册合集、每一篇文章，都是我进步的里程碑。',
      ],
      principles: ['坚持', '科学', '记录'],
    },
    greeting: '欢迎来到我的训练日志',
    description: '记录体能训练成长与经验总结',
  },
} satisfies UserContent;

// ---------------------------------------------------------------------------
// 3. Site information
// ---------------------------------------------------------------------------

export const site = {
  /** Keep true while this repository still contains template placeholders. */
  templateMode: false,
  builtWith: 'site.tech.description',
  since: '2026',
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
