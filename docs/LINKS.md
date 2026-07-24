# Links Page Configuration

`src/app/config/links.config.ts` owns curated friend/resource entries, categories, preview behavior, and link-exchange copy. Personal contacts and the site card are derived from `user.config.ts` and must not be repeated here.

## Main Shape

```ts
export const linksConfig = {
  previews: {
    provider: 'microlink',
    endpoint: 'https://api.microlink.io/',
  },
  friendLinks: [],
  linkCategories: {
    friend: [],
    site: [],
    social: [],
  },
  linkApplicationInfo: {
    description: 'Share a personal site, technical blog, or useful resource.',
  },
}
```

## Curated Links

```ts
{
  name: 'Astro',
  url: 'https://astro.build',
  avatar: 'https://astro.build/assets/press/astro-icon-light-gradient.svg',
  description: 'Modern static site generator',
  category: 'framework',
  type: 'site',
  featured: true,
}
```

- `type` is `friend` or `site` for curated entries.
- `category` must match the corresponding category id.
- `featured` enables the featured filter.
- `screenshot` optionally supplies a local/remote preview image.
- Preview priority is `screenshot` -> Microlink -> enlarged avatar fallback. Requests start only when cards approach the viewport; set `previews.provider: 'none'` to disable remote screenshot requests.

## Personal Social Section

The personal social section is built from:

- `user.github.username`
- `user.contact.additionalLinks`

Configure those values once in `user.config.ts`. Do not add the owner's GitHub/social profiles to `friendLinks`.

## Link Application Contacts

The contact buttons use `getUserContactLinks()` and therefore reflect:

- `user.contact.email`
- `user.contact.website`
- `user.github.username`
- `user.contact.additionalLinks`

The site card uses `user.name`, `user.avatar`, `user.contact.website`, and the current language's `userContent.description`. There are no `contacts` or `mySiteInfo` fields in `links.config.ts`.

## Verification

```bash
npm run test:config
npm run check
```

Also visit `/links` and confirm that configured contact buttons and site-card values match Home, About, and Footer.
