# Astro Theme Reay

A clean, configurable Astro blog theme with Material Design 3 colors, bilingual UI, Markdown styling, project pages, links, archives, and GitHub repository integration.

## Features

- Material Design 3 color tokens with light and dark themes
- English and Chinese UI dictionaries
- Astro Content Collections based blog system
- Unified Markdown rendering for posts and project READMEs
- Archives by timeline, tags, and series
- GitHub project showcase with repository metadata and README rendering
- Links page for friends, resources, and social profiles
- Personal gallery page with album filters and lightbox browsing
- Global music dock with playlist filters, player controls, and configurable tracks
- Config-driven user, theme, project, Markdown, and links settings
- Built-in GitHub Pages workflow

## Quick Start

```bash
git clone https://github.com/yourusername/Astro-Theme-Reay.git
cd Astro-Theme-Reay
npm install
npm run dev
```

Open `http://localhost:4321`.

## Configuration

Most template customization lives in `src/data/`. Edit the feature-specific `*.config.ts` files; application code reads them through `src/data/site.config.ts` so configuration access stays consistent.

| File | Purpose |
| --- | --- |
| `src/data/site.config.ts` | Central read layer used by pages, layouts, and utilities |
| `src/data/user.config.ts` | User profile, multilingual bio, about page sections |
| `src/data/theme.config.ts` | Brand color, typography, background settings |
| `src/data/i18n.config.ts` | UI translations and default language |
| `src/data/projects.config.ts` | GitHub project settings and display options |
| `src/data/links.config.ts` | Friend links, resource links, contact info |
| `src/content/plog/` | Photo posts and album metadata for the gallery |
| `src/data/media.config.ts` | Music dock playlists and tracks |
| `src/data/markdown.config.ts` | Astro Markdown processing |
| `src/data/markdown-style.config.ts` | Markdown visual style tokens |

Blog posts live in `src/content/blog/`.

## Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run Astro type and content checks |

## Deployment

### GitHub Pages

This template includes `.github/workflows/deploy.yml`.

1. Enable **Settings -> Pages -> Source -> GitHub Actions** in your repository.
2. Configure `SITE` and `BASE` when needed.
3. Push to `main`.

Common environment values:

```env
# User or organization site
SITE=https://yourusername.github.io
BASE=/

# Project site
SITE=https://yourusername.github.io
BASE=/repository-name
```

### Vercel / Netlify

Use the platform dashboard and these settings:

- Build command: `npm run build`
- Output directory: `dist`

## Documentation

- [Documentation Index](./docs/README.md)
- [Installation](./docs/INSTALLATION.md)
- [Quick Start](./docs/QUICK-START.md)
- [User Configuration](./docs/USER-CONFIG.md)
- [Theme Configuration](./docs/THEME-CONFIG.md)
- [Gallery and Music](./docs/MEDIA.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [GitHub Actions](./docs/GITHUB-ACTIONS.md)
- [FAQ](./docs/FAQ.md)

## Privacy Notes

This repository is intended to be a reusable template. Replace placeholder values such as `Your Name`, `yourusername`, and `your.email@example.com` with your own content in a private fork or site repository. Keep API tokens in environment variables or GitHub Secrets; do not commit secrets to `src/data/user.config.ts`.

## License

MIT
