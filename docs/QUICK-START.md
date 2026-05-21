# Quick Start Guide

Get your blog up and running in 5 minutes!

## Step 1: Install (2 minutes)

```bash
# Clone or use template
git clone https://github.com/yourusername/Astro-Theme-Reay.git
cd Astro-Theme-Reay

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:4321` - Your site is running! 🎉

## Step 2: Configure Your Site (2 minutes)

Edit `src/data/user.config.ts`:

```typescript
export const user = {
  name: 'Your Name',
  avatar: '/images/profile/avatar.png',
  location: 'Your Location',
  socials: [
    { icon: 'i-carbon:logo-github', label: 'GitHub', url: 'https://github.com/yourusername' },
    { icon: 'i-carbon:email', label: 'Email', url: 'mailto:your.email@example.com' },
  ],
  github: {
    username: 'yourusername',
    token: '',
  },
}

export const userContent = {
  en: {
    tagline: 'Software Developer · Technical Notes · Project Practice',
    bio: 'Write a short intro about your engineering focus and active projects.',
    greeting: 'Hello, I am',
    description: 'A personal technology blog for notes, projects, and long-term learning.',
  },
  zh: {
    tagline: '软件开发者 · 技术笔记 · 项目实践',
    bio: '在这里写下你的工程方向和正在打磨的项目。',
    greeting: '你好,我是',
    description: '一个记录技术笔记、项目实践与长期学习的个人博客。',
  },
}
```

Save and the site will auto-reload with your information!

## Step 3: Write Your First Post (1 minute)

Create `src/content/blog/my-first-post.md`:

```markdown
---
title: My First Post
description: This is my first blog post
publishDate: 2024-01-01
tags: ['hello', 'blog']
---

# Hello World!

This is my first post using Astro Theme Reay.

## Features I Love

- Material Design 3
- Dark mode
- Easy to use

Let's start blogging!
```

Save and check `http://localhost:4321/blog` - Your post is live!

## What's Next?

### Customize Theme Colors
Edit `src/data/theme.config.ts`:
```typescript
export const themeConfig = {
  primary: '#5B8CFF',  // Change primary color
}
```

### Add More Posts
Just create more `.md` files in `src/content/blog/`

### Add Projects
Configure GitHub projects in `src/data/projects.config.ts`

### Customize Styles
Modify Markdown styles in `src/data/markdown-style.config.ts`

## Essential Files to Know

```
src/data/
├── site.config.ts           ← Central read layer for app code
├── user.config.ts           ← Your personal info
├── theme.config.ts          ← Theme colors
├── markdown-style.config.ts ← Content styles
├── links.config.ts          ← Links page
└── projects.config.ts       ← Projects showcase
```

## Common Tasks

### Add a new page
Create file in `src/pages/`:
```typescript
// src/pages/custom.astro
---
import DefaultLayout from '../layouts/base/DefaultLayout.astro';
---
<DefaultLayout title="Custom Page">
  <h1>My Custom Page</h1>
</DefaultLayout>
```

### Change homepage
Edit `src/pages/index.astro`

### Add navigation link
Edit `src/data/i18n.config.ts` navigation section

### Enable dark mode by default
Edit `src/data/theme.config.ts`:
```typescript
mode: 'dark'  // 'light', 'dark', or 'system'
```

## Build for Production

When ready to deploy:

```bash
# Build the site
npm run build

# Preview the build
npm run preview

# Output is in dist/ folder
```

## Deploy Quick Options

### GitHub Pages (Built In)
1. Enable **Settings → Pages → Source → GitHub Actions** in your repository.
2. Configure `SITE` and `BASE` if your site is not deployed at the domain root.
3. Push to `main`; `.github/workflows/deploy.yml` builds and deploys `dist/`.

### Vercel / Netlify
1. Push to GitHub and import the repository in the platform dashboard.
2. Use build command `npm run build`.
3. Use output directory `dist`.

See [Deployment Guide](./DEPLOYMENT.md) for detailed instructions.

## Getting Help

- 📖 [Full Documentation](./README.md)
- 🎨 [Markdown Styling](./MARKDOWN-CUSTOM-GUIDE.md)
- 🎯 [Blog System](./BLOG-SYSTEM.md)
- ⚙️ [User Config](./USER-CONFIG.md)

## Tips for Success

1. **Start simple** - Don't customize everything at once
2. **Use dev mode** - Changes reload instantly
3. **Check examples** - Look at existing blog posts
4. **Read docs** - Each feature has detailed documentation
5. **Experiment** - It's hard to break anything in dev mode!

## Cheat Sheet

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Maintenance
npm run check        # Check for issues
npm run format       # Format code

# Content
src/content/blog/    # Add blog posts here
src/data/            # Configure site here
```

## You're All Set! 🚀

Your blog is ready. Start writing and customizing!

**Next recommended reading:**
- [User Configuration](./USER-CONFIG.md) - Detailed setup
- [Blog System](./BLOG-SYSTEM.md) - Advanced blog features
- [Theme Configuration](./THEME-CONFIG.md) - Visual customization
