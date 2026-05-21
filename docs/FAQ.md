# Frequently Asked Questions (FAQ)

Common questions and answers about the Astro Theme Reay.

## Getting Started

### What is this theme?

Astro Theme Reay is a modern, performant blog theme built with:
- **Astro 4.x** - Fast static site generator
- **Material Design 3** - Beautiful, adaptive design system
- **TypeScript** - Type-safe development
- **UnoCSS** - Utility-first CSS

Perfect for personal blogs, portfolios, and documentation sites.

### Do I need to know Astro to use this theme?

**No.** You can use the theme by just:
1. Installing dependencies
2. Editing config files
3. Writing markdown posts

**Yes**, if you want to:
- Customize components
- Modify layouts
- Add new features

See [Quick Start](./QUICK-START.md) for basic usage.

### Is this theme free?

**Yes**, completely free and open source under the MIT license.

You can:
- Use for personal or commercial projects
- Modify as needed
- Redistribute

No attribution required (but appreciated!).

## Installation & Setup

### What are the system requirements?

- **Node.js**: 18.0 or higher
- **npm/pnpm/yarn**: Latest version
- **Git**: For cloning repository

Works on:
- macOS
- Windows
- Linux

### Installation fails with error "Node version too old"

**Solution:**

Update Node.js to version 18 or higher:

```bash
# Check current version
node --version

# Install latest LTS
# Option 1: Download from https://nodejs.org
# Option 2: Use nvm
nvm install --lts
nvm use --lts
```

### Can I use npm instead of pnpm?

**Yes.** The theme works with any package manager:

```bash
# npm
npm install
npm run dev

# yarn
yarn install
yarn dev

# pnpm
pnpm install
pnpm dev
```

Choose whichever you prefer.

## Configuration

### Where do I change site settings?

Edit `src/data/user.config.ts`:

```typescript
export const user = {
  name: 'Your Name',
  avatar: '/images/profile/avatar.png',
  location: 'Your Location',
  socials: [
    { icon: 'i-carbon:logo-github', label: 'GitHub', url: 'https://github.com/yourusername' },
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

See [User Configuration](./USER-CONFIG.md) for all options.

### How do I change colors?

Edit `src/data/theme.config.ts`:

```typescript
export const themeConfig = {
  primary: '#1976d2',  // Your brand color
}
```

Material Design 3 automatically generates all color variations.

See [Theme Configuration](./THEME-CONFIG.md) for details.

### How do I add my social links?

Edit `src/data/user.config.ts`:

```typescript
export const user = {
  socials: [
    { icon: 'i-carbon:logo-github', label: 'GitHub', url: 'https://github.com/username' },
    { icon: 'i-carbon:logo-twitter', label: 'Twitter', url: 'https://twitter.com/username' },
    { icon: 'i-carbon:email', label: 'Email', url: 'mailto:your@email.com' },
  ],
}
```

Supported platforms:
- GitHub, Twitter/X, LinkedIn
- Instagram, YouTube, Mastodon
- Email, RSS, Website

### Can I use Google Analytics?

**Yes, with a small custom integration.** The template does not ship a committed analytics ID or analytics config. Add the provider script in a layout or component, and keep provider IDs in environment variables when needed:

```env
PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Content Creation

### Where do I write blog posts?

Create markdown files in `src/content/blog/`:

```
src/content/blog/
├── my-first-post.md
├── second-post.md
└── third-post.md
```

See [Blog System](./BLOG-SYSTEM.md) for guide.

### What frontmatter fields are required?

Minimum required:

```markdown
---
title: "Post Title"
description: "Brief description"
pubDate: 2024-01-01
---

Post content here...
```

Optional fields: tags, series, heroImage, draft, updatedDate

### How do I add images to posts?

**Option 1: Public folder**
```markdown
![Alt text](/images/photo.jpg)
```

**Option 2: Assets folder**
```markdown
---
import { Image } from 'astro:assets'
import photo from '@/assets/images/photo.jpg'
---

<Image src={photo} alt="Description" />
```

### Can I use MDX?

**Yes.** Just use `.mdx` extension:

```mdx
---
title: "My MDX Post"
---

import MyComponent from '@/components/MyComponent.astro'

Regular markdown content...

<MyComponent />
```

### How do I create a draft post?

Add `draft: true` to frontmatter:

```markdown
---
title: "Work in Progress"
draft: true
---
```

Draft posts won't appear in production builds.

## Projects

### How do I add GitHub projects?

Edit `src/data/projects.config.ts`:

```typescript
export const projects = [
  {
    id: 'my-project',
    owner: 'username',
    repo: 'repository-name',
    featured: true
  }
]
```

The theme automatically fetches:
- Repository info
- README
- Stars/forks
- Language

See [Projects Guide](./PROJECTS.md).

### Do I need a GitHub token?

**No**, but recommended for:
- Higher API rate limits
- Private repository access (if needed)

Without token: 60 requests/hour
With token: 5,000 requests/hour

### Projects not showing up?

**Check:**

1. Repository is public
2. Owner and repo names are correct
3. GitHub API is accessible
4. No rate limit errors (check console)

**Debug:**
```bash
# Check build logs
npm run build
```

## Deployment

### Which hosting platforms are supported?

All major platforms:
- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**
- **GitHub Pages**
- **Railway**
- **DigitalOcean**
- Self-hosted

See [Deployment Guide](./DEPLOYMENT.md).

### How do I deploy to Vercel?

1. Push code to GitHub
2. Import project in Vercel
3. Deploy (one click)

See [Deployment Guide](./DEPLOYMENT.md#vercel) for details.

### GitHub Pages deployment not working?

Common issues:

**1. Wrong base path:**
```javascript
// astro.config.mjs
export default defineConfig({
  base: '/repository-name',  // Add this
})
```

**2. Site URL:**
```javascript
site: 'https://username.github.io/repository-name'
```

**3. Workflow permissions:**
GitHub Settings → Actions → Allow GitHub Actions to create pages

### Can I use a custom domain?

**Yes.** Configure in your hosting platform:

**Vercel:**
1. Domains → Add Domain
2. Update DNS records

**Netlify:**
1. Domain settings → Add custom domain
2. Update DNS records

See hosting provider docs for details.

## Customization

### How do I customize the layout?

Edit layout files in `src/layouts/`:

```
src/layouts/
├── base/
│   └── BaseLayout.astro
├── blog/
│   └── BlogPostLayout.astro
├── home/
│   └── HomeLayout.astro
└── ...
```

### Can I add new pages?

**Yes.** Create files in `src/pages/`:

```
src/pages/
├── my-page.astro       # /my-page
├── contact.astro       # /contact
└── services/
    └── index.astro     # /services
```

### How do I change fonts?

Edit `src/theme/tokens.ts`:

```typescript
export const defaultTypography = {
  fontFamily: {
    base: 'Your Font, sans-serif',
    mono: 'Your Mono Font, monospace'
  }
}
```

Then import the font in `BaseLayout.astro`.

### Can I use Tailwind CSS?

The theme uses **UnoCSS** (similar to Tailwind).

To switch to Tailwind:
1. Uninstall UnoCSS
2. Install Tailwind
3. Update configuration
4. Update components

Not recommended - UnoCSS is faster and smaller.

## Troubleshooting

### Build fails with "Cannot find module"

**Solution:**

1. Delete `node_modules` and lockfile
2. Reinstall dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

### Styles not showing in development

**Try:**

1. Clear Astro cache
```bash
rm -rf .astro
npm run dev
```

2. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)

### Images not loading

**Check:**

1. File path is correct
2. Image is in `public/` or `src/assets/`
3. Image format is supported (JPG, PNG, WebP, SVG)
4. Build includes images

### GitHub API rate limit exceeded

**Solutions:**

1. Add GitHub token (see [User Config](./USER-CONFIG.md))
2. Wait for limit reset (1 hour)
3. Reduce number of projects
4. Use build cache

### Hot reload not working

**Try:**

1. Restart dev server
```bash
# Stop server (Ctrl+C)
npm run dev
```

2. Check port conflicts (default: 4321)

3. Update Astro:
```bash
npm update astro
```

## Performance

### How can I make my site faster?

1. Optimize images (WebP, correct sizes)
2. Use CDN for assets
3. Enable caching headers
4. Minimize JavaScript
5. Use system fonts

### What are the performance benchmarks?

Typical scores:
- **PageSpeed**: 90-95
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Bundle size too large?

**Check what's included:**
```bash
npm run build
npx vite-bundle-visualizer
```

**Common fixes:**
- Remove unused dependencies
- Use dynamic imports
- Optimize images

## Features

### Does it support dark mode?

**Yes**, with three modes:
- Light
- Dark  
- Auto (follows system preference)

Configure in `src/data/theme.config.ts`.

### Is it mobile responsive?

**Yes**, fully responsive:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

### Does it support RSS?

RSS is not currently configured as a user setting. Add an Astro RSS endpoint if your site needs `/rss.xml`.

### Can I add search functionality?

**Currently:** No built-in search

**Options:**
1. Add Algolia (external service)
2. Add Pagefind (local search)
3. Implement custom search

### Does it support comments?

**Currently:** No built-in comments

**Options:**
1. Add Giscus (GitHub Discussions)
2. Add Utterances (GitHub Issues)
3. Add Disqus
4. Add custom solution

See component integrations in Astro docs.

### Is there i18n support?

**Basic structure** is available.

Full implementation requires:
- Translation files
- Multi-language content
- Language switcher

See [i18n Guide](./I18N.md).

## Updates

### How do I update the theme?

**If you forked:**
```bash
git pull upstream main
npm install
```

**If you downloaded:**
1. Download latest version
2. Merge your changes manually
3. Test thoroughly

### Will updates break my site?

**Probably not**, but:
- Check CHANGELOG
- Test in local environment first
- Backup before updating

### How do I contribute?

1. Fork repository
2. Create feature branch
3. Make changes
4. Submit pull request

See CONTRIBUTING.md (if available).

## Support

### Where can I get help?

- **Documentation**: Check all guides in `docs/`
- **Issues**: GitHub Issues for bugs
- **Discussions**: GitHub Discussions for questions
- **Discord**: Community chat (if available)

### Found a bug?

1. Check if already reported
2. Create GitHub Issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

### Can I hire you for customization?

Check repository README for contact information.

## License

### What license is this under?

MIT License - free to use, modify, redistribute.

### Do I need to credit the author?

**Not required**, but appreciated:

```markdown
Built with [Astro Theme Reay](https://github.com/...)
```

### Can I use for commercial projects?

**Yes**, absolutely! No restrictions.

## Related Documentation

- [Quick Start](./QUICK-START.md)
- [Installation](./INSTALLATION.md)
- [User Configuration](./USER-CONFIG.md)
- [Blog System](./BLOG-SYSTEM.md)
- [Theme Configuration](./THEME-CONFIG.md)
- [Deployment](./DEPLOYMENT.md)
