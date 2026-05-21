# User Configuration Guide

Complete reference for configuring your personal information and site settings.

## Configuration Layers

Editable settings are split by feature under `src/data/`. Application code reads those files through `src/data/site.config.ts`, which is the central read layer.

| File | Purpose |
| --- | --- |
| `src/data/user.config.ts` | Profile, social links, multilingual personal content, about page data |
| `src/data/theme.config.ts` | Colors, typography, and background |
| `src/data/projects.config.ts` | GitHub project fetching and display options |
| `src/data/links.config.ts` | Friend links, resource links, and link application info |
| `src/data/i18n.config.ts` | Default language and UI translations |
| `src/data/site.config.ts` | Central app-facing access layer; usually do not edit |

## Basic Information

### User Profile (Language-Independent)

```typescript
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
    token: '', // Use environment variables instead
  },
}
```

### Multilingual User Content (Single Source of Truth)

**Important**: This is the **only place** to define your personal content. All pages (home, about, etc.) will read from here.

```typescript
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
    greeting: '你好，我是',
    description: '一个记录技术笔记、项目实践与长期学习的个人博客。',
  },
}
```

**Fields**:
- **tagline**: Short professional tagline (shown on home page and about page)
- **bio**: Brief personal introduction (shown on home page and about page intro)
- **greeting**: Greeting text for about page (e.g., "Hello, I am" or "你好，我是")
- **description**: Site-level intro sentence used by layouts and meta information

**Why Single Source?**
- ✅ Define once, use everywhere
- ✅ Automatic language switching
- ✅ Easy maintenance
- ✅ No content duplication

### Usage in Components

```typescript
import { getLocalizedUserContent, getUserProfile } from '../../data/site.config';
import { useI18n } from '../../utils/i18n';

const { currentLang } = useI18n();
const user = getUserProfile();
const content = getLocalizedUserContent(currentLang);

// Now use: user.name, user.avatar, content.tagline, content.bio, content.greeting
```

### Fields

- **name**: Your display name (shown in all pages)
- **avatar**: Path to avatar image (store in `public/`)
- **location**: Where you're based
- **socials**: Array of social links with icons
- **github.username**: For fetching repository stats
- **github.token**: Optional, use environment variables for higher API limits

## Social Links

Social links are defined in the `user.socials` array:

```typescript
export const user = {
  socials: [
    { 
      icon: 'i-carbon:logo-github',  // UnoCSS icon class
      label: 'GitHub',                // Platform name
      url: 'https://github.com/yourusername'  // Profile URL
    },
    { 
      icon: 'i-carbon:logo-twitter', 
      label: 'Twitter', 
      url: 'https://twitter.com/yourusername' 
    },
    { 
      icon: 'i-carbon:email', 
      label: 'Email', 
      url: 'mailto:your.email@example.com' 
    },
  ],
}
```

### Supported Icons (UnoCSS Carbon Icons)

| Platform | Icon Class | Example URL |
|----------|------------|-------------|
| GitHub | `i-carbon:logo-github` | `https://github.com/username` |
| Twitter/X | `i-carbon:logo-twitter` | `https://twitter.com/username` |
| LinkedIn | `i-carbon:logo-linkedin` | `https://linkedin.com/in/username` |
| Email | `i-carbon:email` | `mailto:your@email.com` |
| Instagram | `i-carbon:logo-instagram` | `https://instagram.com/username` |
| YouTube | `i-carbon:logo-youtube` | `https://youtube.com/@username` |
| Discord | `i-carbon:logo-discord` | `https://discord.gg/invite` |

For more icons, see [Icônes](https://icones.js.org/collection/carbon)

## GitHub Configuration

```typescript
export const user = {
  github: {
    username: 'yourusername',
    token: '', // Keep tokens in environment variables instead
  }
}
```

### Why GitHub Token?

- **Without token**: 60 API requests/hour
- **With token**: 5,000 requests/hour

### Creating a Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `public_repo` (read-only)
4. Copy the token
5. Create `.env` file:
   ```env
   GITHUB_TOKEN=<your-github-token>
   ```

Do not commit `.env` or hard-code tokens in `user.config.ts`.

## About Site Information

```typescript
export const aboutConfig = {
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
    ],
  },
}
```

### Fields

- **name**: Site name displayed on the about/site section
- **description**: Short site description
- **builtWith**: Technology summary
- **since**: Start year
- **stats**: Initial stats; some page stats are calculated at build time
- **techStack**: Technologies displayed in the site info section

## About Page Configuration

```typescript
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
      ],
    },
  ],
  socialNetworks: [],
  education: [],
  experience: [],
  timeline: [],
  site: {
    name: 'Your Site Name',
    description: 'A personal technology blog for notes, projects, and long-term learning.',
    builtWith: 'Built with Astro, UnoCSS, and TypeScript',
    since: '2024',
    stats: { posts: 0, words: 0, visitors: 0 },
    techStack: [],
  },
}
```

## Statistics Configuration

```typescript
export const aboutConfig = {
  // ...
  site: {
    since: '2024',
    stats: {
      posts: 0,
      words: 0,
      visitors: 0,
    },
    techStack: [
      { name: 'Astro', description: 'Modern static site generator', url: 'https://astro.build/', icon: 'i-carbon:rocket' },
    ],
  },
}
```

## Navigation Menu

Configure site navigation in `src/data/i18n.config.ts`:

```typescript
export const translations = {
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.archives': 'Archives',
  },
  zh: {
    'nav.home': '首页',
    'nav.blog': '博客',
    'nav.projects': '项目',
    'nav.about': '关于',
    'nav.archives': '归档',
  }
}
```

Routes are currently declared in `src/components/common/Header.astro`; add matching translation keys when adding navigation items.

## Language Configuration

```typescript
export const defaultLang = 'zh' as const;

export const languages = {
  en: 'English',
  zh: '中文',
} as const;
```

## Examples

### Personal Blog
```typescript
export const user = {
  name: 'Jane Doe',
  avatar: '/images/jane.jpg',
  location: 'Your City',
  socials: [
    { icon: 'i-carbon:logo-github', label: 'GitHub', url: 'https://github.com/janedoe' },
    { icon: 'i-carbon:logo-linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/janedoe' },
  ],
  github: {
    username: 'janedoe',
    token: '',
  },
}

export const userContent = {
  en: {
    tagline: 'Full-stack developer · Tech writer',
    bio: 'Full-stack developer and tech writer.',
    greeting: 'Hello, I am',
    description: 'Notes on web development and product building.',
  },
  zh: {
    tagline: '全栈开发者 · 技术作者',
    bio: '全栈开发者与技术作者。',
    greeting: '你好,我是',
    description: '记录 Web 开发和产品实践。',
  },
}
```

### Developer Portfolio
```typescript
export const user = {
  name: 'John Smith',
  avatar: '/images/profile/avatar.png',
  location: 'Remote',
  socials: [
    { icon: 'i-carbon:logo-github', label: 'GitHub', url: 'https://github.com/johnsmith' },
    { icon: 'i-carbon:email', label: 'Email', url: 'mailto:john@example.com' },
  ],
  github: {
    username: 'johnsmith',
    token: '',
  },
}
```

### Chinese Blog
```typescript
export const user = {
  name: '张三',
  avatar: '/images/profile/avatar.png',
  location: '北京，中国',
  socials: [
    { icon: 'i-carbon:logo-github', label: 'GitHub', url: 'https://github.com/zhangsan' },
    { icon: 'i-carbon:email', label: 'Email', url: 'mailto:zhangsan@example.com' },
  ],
  github: {
    username: 'zhangsan',
    token: '',
  },
}
```

## Best Practices

1. **Avatar Image**: Use square image, at least 400x400px
2. **Bio**: Keep it under 200 characters
3. **Social Links**: Only add platforms you actively use
4. **Site URL**: Use production URL, not localhost
5. **GitHub Token**: Keep it secret, never commit to Git
6. **SEO**: Fill all meta fields for better search visibility

## Testing Your Configuration

After making changes:

1. Restart dev server: `npm run dev`
2. Check homepage for updated info
3. Visit About page to verify details
4. Test social links work correctly
5. Check browser tab title
6. Verify dark/light mode displays correctly

## Troubleshooting

### Avatar not showing
- Check file exists in `public/images/`
- Verify path starts with `/`
- Try absolute URL as fallback

### Social links not appearing
- Ensure field name matches supported platforms
- Check value is not empty string
- Verify icon name is correct

### GitHub API rate limit
- Add GitHub token to `.env`
- Check token has correct permissions
- Verify token is not expired

## Related Documentation

- [Theme Configuration](./THEME-CONFIG.md)
- [Blog System](./BLOG-SYSTEM.md)
- [Projects Configuration](./PROJECTS.md)
- [Deployment](./DEPLOYMENT.md)
