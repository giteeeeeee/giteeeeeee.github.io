# API Reference

Technical reference for theme APIs and utilities.

## Overview

This document provides technical details about the theme's internal APIs, utilities, and helper functions.

## Theme System API

### ThemeConfig

Main theme configuration interface.

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primary: string
  palette?: {
    light?: Partial<Palette>
    dark?: Partial<Palette>
  }
  typography?: Partial<Typography>
  shape?: Partial<Shape>
}
```

#### Usage

```typescript
import { themeConfig } from '@/data/theme.config'

// Access current theme
const mode = themeConfig.mode
const primary = themeConfig.primary
```

### generateTheme()

Generates complete theme from config.

```typescript
function generateTheme(config: ThemeConfig): {
  light: Palette
  dark: Palette
  typography: Typography
  shape: Shape
}
```

#### Parameters

- **config**: `ThemeConfig` - Theme configuration object

#### Returns

Complete theme with light/dark palettes, typography, and shape tokens.

#### Example

```typescript
import { generateTheme } from '@/theme'

const theme = generateTheme({
  mode: 'light',
  primary: '#1976d2'
})

console.log(theme.light.primary) // Generated primary colors
```

### getCSSVariables()

Converts theme to CSS custom properties.

```typescript
function getCSSVariables(
  palette: Palette,
  typography: Typography,
  shape: Shape
): Record<string, string>
```

#### Returns

Object with CSS variable names and values.

#### Example

```typescript
const vars = getCSSVariables(theme.light, theme.typography, theme.shape)
// {
//   '--color-primary': '#1976d2',
//   '--font-family-base': 'Inter, sans-serif',
//   ...
// }
```

## Content Collections API

### getCollection()

Fetch blog posts or other collections.

```typescript
import { getCollection } from 'astro:content'

const posts = await getCollection('blog')
const draftPosts = await getCollection('blog', ({ data }) => {
  return data.draft === true
})
```

#### Parameters

- **collection**: `string` - Collection name ('blog')
- **filter**: `(entry) => boolean` - Optional filter function

### getEntry()

Get single entry by slug.

```typescript
import { getEntry } from 'astro:content'

const post = await getEntry('blog', 'my-post')
```

## Blog Utilities

Located in `src/utils/blog.ts`

### getSortedPosts()

Get all posts sorted by date.

```typescript
function getSortedPosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[]
```

#### Example

```typescript
import { getSortedPosts } from '@/utils/blog'

const allPosts = await getCollection('blog')
const sorted = getSortedPosts(allPosts)
```

## Media Configuration API

Plog utilities are located in `src/utils/plog.ts`. Music configuration is
located in `src/data/media.config.ts`.

### getPlogGallery()

Returns plog album collections and their photos derived from `src/content/plog`.
Each `index.md` is one album; files in its `images/` folder become album photos.

```typescript
import { getPlogGallery } from '@/utils/plog'

const gallery = await getPlogGallery()
console.log(gallery.albums, gallery.photos)
```

### getPlogAlbums()

Returns only the album collection list.

```typescript
import { getPlogAlbums } from '@/utils/plog'

const albums = await getPlogAlbums()
console.log(albums[0].href, albums[0].photoCount)
```

### getMusicConfig()

Returns configured playlists, tracks, and player defaults for the global music dock.

```typescript
import { getMusicConfig } from '@/data/site.config'

const music = getMusicConfig()
console.log(music.player.defaultTrackId, music.tracks)
```

### Media Asset Paths

Store public assets under `public/` and reference them with absolute paths:
Music files still use public paths:

```text
public/audio/song.mp3 -> /audio/song.mp3
```

Plog photos should usually live in an `images/` folder beside their `index.md`:

```text
src/content/plog/XiZang/images/DSC_1695.jpg
```

Optional per-photo metadata is configured through the `photos` array in the
same `index.md`.

### getPostsByTag()

Filter posts by tag.

```typescript
function getPostsByTag(
  posts: CollectionEntry<'blog'>[],
  tag: string
): CollectionEntry<'blog'>[]
```

#### Example

```typescript
const jsPosts = getPostsByTag(allPosts, 'javascript')
```

### getPostsBySeries()

Filter posts by series.

```typescript
function getPostsBySeries(
  posts: CollectionEntry<'blog'>[],
  series: string
): CollectionEntry<'blog'>[]
```

### getAllTags()

Get all unique tags with counts.

```typescript
function getAllTags(posts: CollectionEntry<'blog'>[]): Array<{
  name: string
  count: number
}>
```

#### Example

```typescript
const tags = getAllTags(allPosts)
// [
//   { name: 'javascript', count: 15 },
//   { name: 'typescript', count: 8 },
//   ...
// ]
```

### getAllSeries()

Get all series with post counts.

```typescript
function getAllSeries(posts: CollectionEntry<'blog'>[]): Array<{
  name: string
  count: number
}>
```

### getRelatedPosts()

Find related posts based on tags.

```typescript
function getRelatedPosts(
  post: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit?: number
): CollectionEntry<'blog'>[]
```

#### Parameters

- **post**: Current post
- **allPosts**: All available posts
- **limit**: Max number of related posts (default: 3)

## GitHub Utilities

Located in `src/utils/github.ts`

### getUserRepos()

Fetch user's repositories.

```typescript
async function getUserRepos(
  username: string,
  token?: string
): Promise<Repository[]>
```

#### Parameters

- **username**: GitHub username
- **token**: Optional GitHub token for higher rate limits

#### Returns

Array of repository objects.

#### Example

```typescript
import { getUserRepos } from '@/utils/github'

const repos = await getUserRepos('octocat')
```

### getRepoReadme()

Fetch repository README.

```typescript
async function getRepoReadme(
  owner: string,
  repo: string,
  token?: string
): Promise<string>
```

#### Returns

README content as markdown string.

### formatNumber()

Format numbers for display.

```typescript
function formatNumber(num: number): string
```

#### Example

```typescript
formatNumber(1234)    // "1.2k"
formatNumber(1234567) // "1.2m"
formatNumber(42)      // "42"
```

### formatDate()

Format dates relative to now.

```typescript
function formatDate(date: Date | string): string
```

#### Example

```typescript
formatDate(new Date('2024-01-01'))
// "2 months ago" or "Jan 1, 2024"
```

### getLanguageColor()

Get color for programming language.

```typescript
function getLanguageColor(language: string): string
```

#### Example

```typescript
getLanguageColor('JavaScript') // "#f1e05a"
getLanguageColor('TypeScript') // "#3178c6"
getLanguageColor('Unknown')    // "#ccc"
```

## Markdown Utilities

### getReadingTime()

Calculate reading time from markdown.

```typescript
function getReadingTime(content: string): number
```

Located in Remark plugin: `src/utils/remark-reading-time.ts`

#### Returns

Reading time in minutes.

### generateMarkdownStyles()

Generate custom markdown styles.

```typescript
function generateMarkdownStyles(config: MarkdownStyleConfig): string
```

Located in `src/utils/markdown-style-generator.ts`

#### Returns

CSS string for markdown content.

## Type Definitions

### Repository

GitHub repository type.

```typescript
interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
}
```

### BlogPost

Blog post frontmatter type.

```typescript
interface BlogPost {
  title: string
  description: string
  pubDate: Date
  updatedDate?: Date
  heroImage?: string
  tags?: string[]
  series?: string
  draft?: boolean
  author?: string
  canonicalUrl?: string
}
```

### Palette

Color palette type.

```typescript
interface Palette {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  secondary: string
  onSecondary: string
  // ... (see src/theme/types.ts for complete definition)
}
```

### Typography

Typography configuration type.

```typescript
interface Typography {
  fontFamily: {
    base: string
    mono: string
  }
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl': string
  }
  fontWeight: {
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeight: {
    tight: number
    normal: number
    relaxed: number
  }
}
```

### Shape

Shape tokens type.

```typescript
interface Shape {
  borderRadius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  borderWidth: {
    thin: string
    medium: string
    thick: string
  }
  shadow: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}
```

## Configuration Files

### site.config.ts

Central read layer for application code.

```typescript
export const siteConfig = {
  i18n: { defaultLang, languages, translations }
  user
  userContent
  about: aboutConfig
  theme: themeConfig
  background: backgroundConfig
  links: linksConfig
  projects: projectsConfig
}

export function getUserProfile()
export function getLocalizedUserContent(lang?)
export function getAboutConfig()
export function getThemeConfig()
export function getBackgroundConfig()
export function getLinksConfig()
export function getProjectsConfig()
export function getGitHubConfig()
```

### user.config.ts

User configuration.

```typescript
export const user = {
  name: string
  avatar: string
  location: string
  socials: Array<{ icon: string; label: string; url: string }>
  github: {
    username: string
    token?: string
  }
}

export const userContent = {
  en: { tagline: string; bio: string; greeting: string; description: string }
  zh: { tagline: string; bio: string; greeting: string; description: string }
}
```

### theme.config.ts

Theme configuration.

```typescript
export const themeConfig: UserThemeOverrides = {
  mode: 'light' | 'dark' | 'auto'
  primary: string
  palette?: { ... }
  typography?: { ... }
  shape?: { ... }
}
```

### markdown-style.config.ts

Markdown rendering configuration.

```typescript
export const markdownStyleConfig = {
  headings: { ... }
  text: { ... }
  links: { ... }
  code: { ... }
  // ...
}
```

### projects.config.ts

Projects configuration.

```typescript
export const projectsConfig = {
  categories: ProjectCategory[]
  githubUsername: string
  githubConfig: GithubConfig
  displaySettings: ProjectDisplaySettings
  featuredRepos?: ProjectRepo[]
}
```

### links.config.ts

Friend links configuration.

```typescript
export const linksConfig = {
  friendLinks: FriendLink[]
  linkCategories: LinkCategoriesConfig
  linkApplicationInfo: LinkApplicationInfo
  mySiteInfo: SiteInfo
}
```

## Path Aliases

Import aliases available throughout the project:

```typescript
// Configured in tsconfig.json
'@/*'           // src/*
'@/components'  // src/components
'@/layouts'     // src/layouts
'@/data'        // src/data
'@/utils'       // src/utils
'@/theme'       // src/theme
'@/styles'      // src/styles
'@/assets'      // src/assets
```

## Environment Variables

### Public Variables

Available in browser code:

```typescript
import.meta.env.PUBLIC_SITE_URL
import.meta.env.PUBLIC_GA_ID
```

### Private Variables

Server-only:

```typescript
import.meta.env.GITHUB_TOKEN
```

### Mode

```typescript
import.meta.env.MODE  // 'development' | 'production'
import.meta.env.DEV   // boolean
import.meta.env.PROD  // boolean
```

## Astro Built-ins

### Astro.props

Access component props:

```astro
---
const { title, description } = Astro.props
---
```

### Astro.params

Access URL parameters:

```astro
---
const { slug } = Astro.params
---
```

### Astro.url

Access current URL:

```astro
---
const pathname = Astro.url.pathname
const searchParams = Astro.url.searchParams
---
```

### Astro.request

Access request object:

```astro
---
const userAgent = Astro.request.headers.get('user-agent')
---
```

## Component Props

### Layout Props

**BaseLayout.astro:**
```typescript
interface Props {
  title?: string
  description?: string
  image?: string
  canonicalUrl?: string
}
```

**BlogPostLayout.astro:**
```typescript
interface Props {
  title: string
  description: string
  pubDate: Date
  updatedDate?: Date
  heroImage?: string
  tags?: string[]
}
```

### Common Component Props

**Container.astro:**
```typescript
interface Props {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: boolean
}
```

**Section.astro:**
```typescript
interface Props {
  title?: string
  id?: string
  background?: 'default' | 'elevated'
}
```

## CSS Custom Properties

### Colors

```css
--color-primary
--color-on-primary
--color-primary-container
--color-on-primary-container
--color-secondary
--color-on-secondary
--color-surface
--color-on-surface
--color-background
--color-on-background
--color-error
--color-on-error
/* ... and more */
```

### Typography

```css
--font-family-base
--font-family-mono
--font-size-xs
--font-size-sm
--font-size-base
--font-size-lg
/* ... and more */
```

### Spacing

```css
--spacing-xs: 0.5rem
--spacing-sm: 1rem
--spacing-md: 1.5rem
--spacing-lg: 2rem
--spacing-xl: 3rem
```

### Animation

```css
--transition-fast: 150ms
--transition-base: 250ms
--transition-slow: 350ms
```

## Utility Functions

### clsx()

Conditionally join class names:

```typescript
import { clsx } from 'clsx'

clsx('base', { active: isActive, disabled: !enabled })
// "base active" or "base disabled"
```

### cn()

Merge Tailwind classes (if using tailwind-merge):

```typescript
import { cn } from '@/utils/cn'

cn('px-4 py-2', 'px-6')
// "px-6 py-2" (later px-6 overrides px-4)
```

## Error Handling

### Try-Catch for API Calls

```typescript
try {
  const repos = await getUserRepos('username')
  // Handle success
} catch (error) {
  console.error('Failed to fetch repos:', error)
  // Handle error
}
```

### Optional Chaining

```typescript
const stars = repo?.stargazers_count ?? 0
const language = repo?.language || 'Unknown'
```

## Best Practices

### Type Safety

Always use TypeScript types:

```typescript
import type { CollectionEntry } from 'astro:content'

function processPosts(posts: CollectionEntry<'blog'>[]) {
  // Type-safe code
}
```

### Error Boundaries

Handle errors gracefully:

```astro
---
let data
try {
  data = await fetchData()
} catch (error) {
  console.error(error)
  data = null
}
---

{data ? (
  <Display data={data} />
) : (
  <ErrorMessage />
)}
```

### Performance

Use dynamic imports for heavy components:

```astro
---
const HeavyComponent = (await import('@/components/Heavy.astro')).default
---
```

## Related Documentation

- [Project Structure](./PROJECT-STRUCTURE.md)
- [User Configuration](./USER-CONFIG.md)
- [Theme Configuration](./THEME-CONFIG.md)
- [Blog System](./BLOG-SYSTEM.md)
