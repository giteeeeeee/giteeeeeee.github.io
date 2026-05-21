# Links Page Configuration

Configure friend links, resource links, and social profile links in `src/data/links.config.ts`.

Application code reads this file through `src/data/site.config.ts`, so most users should edit `links.config.ts` only.

## Main Shape

```typescript
export const linksConfig = {
  friendLinks,
  linkCategories,
  linkApplicationInfo,
  mySiteInfo,
}
```

## Link Items

Add links to `friendLinks`:

```typescript
export const friendLinks = [
  {
    name: 'Astro',
    url: 'https://astro.build',
    avatar: 'https://astro.build/assets/press/astro-icon-light-gradient.svg',
    description: 'Modern static site generator',
    category: 'framework',
    type: 'site',
    featured: true,
  },
]
```

Fields:

- `name`: Display name.
- `url`: Destination URL.
- `avatar`: Logo or avatar URL.
- `description`: Short card description.
- `type`: One of `friend`, `site`, or `social`.
- `category`: Optional category id used by tabs.
- `featured`: Optional featured flag used by the featured filter.

## Categories

Tabs are configured by link type:

```typescript
export const linkCategories = {
  friend: [
    { id: 'all', label: 'All', icon: 'i-carbon:grid' },
    { id: 'featured', label: 'Featured', icon: 'i-carbon:star-filled' },
    { id: 'blog', label: 'Blogs', icon: 'i-carbon:blog' },
  ],
  site: [
    { id: 'all', label: 'All', icon: 'i-carbon:grid' },
    { id: 'resource', label: 'Resources', icon: 'i-carbon:book' },
  ],
  social: [
    { id: 'all', label: 'All', icon: 'i-carbon:grid' },
  ],
}
```

Use category ids that match `friendLinks[].category`.

## Link Applications

`linkApplicationInfo` controls the contact buttons in the link exchange section:

```typescript
export const linkApplicationInfo = {
  title: 'Apply for Link Exchange',
  description: 'Send your site information through one of the contacts below.',
  contacts: [
    { label: 'Email', value: 'mailto:your.email@example.com', icon: 'i-carbon:email' },
  ],
}
```

## Your Site Card

`mySiteInfo` is displayed in the application section:

```typescript
export const mySiteInfo = {
  name: 'Your Site Name',
  url: 'https://yourdomain.com',
  avatar: '/images/profile/avatar.png',
  description: 'Technical notes, project practice, and long-term learning logs',
}
```

## Notes

- Keep placeholder contact values in the public template.
- Do not put private contact methods or API keys in this file.
- For app code, prefer `getLinksConfig()` from `src/data/site.config.ts`.
