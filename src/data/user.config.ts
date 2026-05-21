/**
 * User Configuration
 *
 * Edit the three sections below first:
 * 1. Basic profile
 * 2. Multilingual intro copy
 * 3. About page content
 */

import { defaultLang, type Language } from './i18n.config';

// ---------------------------------------------------------------------------
// 1. Basic profile
// ---------------------------------------------------------------------------

export const user = {
  name: 'Your Name',
  avatar: '/images/profile/avatar.png',
  location: 'Your Location',
  socials: [
    { icon: 'i-carbon:logo-github', label: 'GitHub', url: 'https://github.com/yourusername' },
    { icon: 'i-carbon:logo-twitter', label: 'Twitter', url: 'https://twitter.com/yourusername' },
    { icon: 'i-carbon:email', label: 'Email', url: 'mailto:your.email@example.com' },
  ],

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
    tagline: 'Software Developer · Technical Notes · Project Practice',
    bio: 'Write a short intro about your engineering focus, current projects, and the technical problems you like to explore.',
    greeting: 'Hello, I am',
    description: 'A personal technology blog for notes, projects, and long-term learning.',
  },
  zh: {
    tagline: '软件开发者 · 技术笔记 · 项目实践',
    bio: '在这里写下你的工程方向、正在打磨的项目，以及你持续探索的技术问题。',
    greeting: '你好,我是',
    description: '一个记录技术笔记、项目实践与长期学习的个人博客。',
  },
} satisfies UserContent;

// ---------------------------------------------------------------------------
// 3. About page content
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
        { name: 'VS Code', description: 'Code editor', url: 'https://code.visualstudio.com/', icon: 'i-carbon:code' },
        { name: 'Terminal', description: 'Command line interface', url: '#', icon: 'i-carbon:terminal' },
        { name: 'GitHub', description: 'Code hosting platform', url: 'https://github.com/', icon: 'i-carbon:logo-github' },
        { name: 'Figma', description: 'Design collaboration', url: 'https://www.figma.com/', icon: 'i-carbon:pen' },
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
        { name: 'Browser', description: 'Modern web browser', url: '#', icon: 'i-carbon:cloud' },
        { name: 'Launcher', description: 'Quick access tool', url: '#', icon: 'i-carbon:rocket' },
        { name: 'Notes', description: 'Knowledge management', url: '#', icon: 'i-carbon:notebook' },
        { name: 'Editor', description: 'Markdown editing', url: '#', icon: 'i-carbon:edit' },
      ],
    },
    {
      id: 'hobbies',
      title: 'about.interests.title',
      description: 'about.interests.subtitle',
      icon: 'i-carbon:favorite',
      columns: 4,
      compact: true,
      colorTheme: 'accent',
      items: [
        { name: 'Photography', description: 'Capturing moments', icon: 'i-carbon:camera' },
        { name: 'Reading', description: 'Books and articles', icon: 'i-carbon:book' },
        { name: 'Music', description: 'Various genres', icon: 'i-carbon:music' },
        { name: 'Sports', description: 'Staying active', icon: 'i-carbon:bicycle' },
      ],
    },
  ],

  socialNetworks: [
    {
      platform: 'GitHub',
      username: 'yourusername',
      url: 'https://github.com/yourusername',
      icon: 'i-carbon:logo-github',
      followers: 0,
    },
    {
      platform: 'Twitter',
      username: '@yourusername',
      url: 'https://twitter.com/yourusername',
      icon: 'i-carbon:logo-twitter',
      followers: 0,
    },
  ],

  education: [
    {
      school: 'Your University',
      major: 'Your Major',
      degree: 'Bachelor / Master / PhD',
      startDate: '2020-09',
      endDate: '2024-06',
      logo: '/images/education/school-logo.png',
      url: 'https://www.example.edu/',
      description: 'Brief description of your studies',
    },
  ],

  experience: [
    // Uncomment and customize as needed.
    // {
    //   company: 'Company Name',
    //   position: 'Your Position',
    //   startDate: '2024-07',
    //   endDate: 'present',
    //   logo: '/images/company-logo.png',
    //   url: 'https://www.company.com/',
    //   description: 'Brief description of your role',
    // },
  ],

  site: {
    name: 'Your Site Name',
    description: 'A personal technology blog for notes, projects, and long-term learning.',
    builtWith: 'Built with Astro, UnoCSS, and TypeScript',
    since: '2024',
    stats: {
      posts: 0,
      words: 0,
      visitors: 0,
    },
    techStack: [
      { name: 'Astro', description: 'Modern static site generator', url: 'https://astro.build/', icon: 'i-carbon:rocket' },
      { name: 'UnoCSS', description: 'Atomic CSS engine', url: 'https://unocss.dev/', icon: 'i-carbon:color-palette' },
      { name: 'TypeScript', description: 'Type-safe JavaScript', url: 'https://www.typescriptlang.org/', icon: 'i-carbon:code' },
    ],
  },

  timeline: [
    { year: '2024', event: 'Started the technical blog', description: 'Organized project notes and learning logs' },
    { year: '2023', event: 'Explored the web stack', description: 'Built small projects while learning frontend fundamentals' },
  ],
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
  aboutConfig,
} satisfies UserConfig;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SocialLink {
  icon: string;
  label: string;
  url: string;
}

export interface GithubUserConfig {
  username: string;
  token?: string;
}

export interface User {
  name: string;
  avatar: string;
  location: string;
  socials: SocialLink[];
  github: GithubUserConfig;
}

export interface UserContentLanguage {
  tagline: string;
  bio: string;
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

export interface SocialNetwork {
  platform: string;
  username: string;
  url: string;
  icon: string;
  followers: number;
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

export interface SiteInfo {
  name: string;
  description: string;
  builtWith: string;
  since: string;
  stats: {
    posts: number;
    words: number;
    visitors: number;
  };
  techStack: TechStackItem[];
}

export interface TimelineEvent {
  year: string;
  event: string;
  description?: string;
}

export interface AboutConfig {
  sections: AboutSection[];
  socialNetworks: SocialNetwork[];
  education: Education[];
  experience: Experience[];
  site: SiteInfo;
  timeline: TimelineEvent[];
}

export interface UserConfig {
  user: User;
  userContent: UserContent;
  aboutConfig: AboutConfig;
}
