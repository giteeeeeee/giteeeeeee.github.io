# Blog System

Complete guide to using the blog functionality in Astro Theme Reay.

## Overview

The blog system is built on Astro Content Collections, providing:
- Type-safe frontmatter
- Automatic file-based routing
- MDX support
- Reading time calculation
- Tag system
- Draft posts
- SEO optimization

## Creating Posts

### File Location

All blog posts go in `src/content/blog/`:

```
src/content/blog/
├── my-first-post.md
├── typescript-tips.md
├── react-hooks-guide.mdx
└── web-performance.md
```

### File Naming

Use kebab-case (lowercase with hyphens):
- ✅ `getting-started-with-astro.md`
- ✅ `top-10-css-tricks.md`
- ❌ `Getting Started With Astro.md`
- ❌ `top_10_css_tricks.md`

The filename becomes the URL slug:
- `my-post.md` → `/blog/my-post`

### Basic Post Structure

```markdown
---
title: Your Post Title
description: A brief description for SEO and previews
publishDate: 2024-01-01
tags: ['javascript', 'tutorial']
---

# Your Content Here

Write your post content using Markdown...
```

## Frontmatter Reference

### Required Fields

```yaml
---
title: Post Title                    # Display title
description: Post description        # SEO description
publishDate: 2024-01-01             # Publication date (YYYY-MM-DD)
---
```

### Optional Fields

```yaml
---
# Optional fields
tags: ['tag1', 'tag2']              # Post tags (array)
draft: false                         # Hide post if true
image: /images/post-cover.jpg       # Cover image
imageAlt: Image description         # Cover image alt text
series: Series Name                 # Part of a series
seriesOrder: 1                      # Order in series
updatedDate: 2024-01-15             # Last update date
author: John Doe                    # Override default author
---
```

### Complete Example

```yaml
---
title: "Getting Started with TypeScript"
description: "Learn TypeScript basics and set up your first project"
publishDate: 2024-01-15
updatedDate: 2024-01-20
tags: ['typescript', 'tutorial', 'beginner']
series: "TypeScript Fundamentals"
seriesOrder: 1
image: /images/typescript-intro.jpg
imageAlt: TypeScript logo
draft: false
---
```

See [Blog Frontmatter Reference](./BLOG-FRONTMATTER.md) for complete details.

## Writing Content

### Markdown Basics

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](https://example.com)

![Image alt](/images/example.jpg)
```

### Code Blocks

````markdown
```javascript
function hello() {
  console.log('Hello, world!');
}
```

```typescript
interface User {
  name: string;
  age: number;
}
```
````

### Advanced Features

**Blockquotes:**
```markdown
> This is a blockquote
> It can span multiple lines
```

**Tables:**
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

**Task Lists:**
```markdown
- [x] Completed task
- [ ] Pending task
```

**Footnotes:**
```markdown
Here's a sentence with a footnote[^1].

[^1]: This is the footnote.
```

## Using MDX

MDX allows using components in Markdown.

**Filename**: Use `.mdx` extension
```
src/content/blog/interactive-post.mdx
```

**Import Components:**
```mdx
---
title: Interactive Post
---

import CustomComponent from '@features/custom/components/CustomComponent.astro';

# Regular Markdown

<CustomComponent prop="value" />

More markdown content...
```

## Tags System

### Adding Tags

```yaml
---
tags: ['javascript', 'react', 'tutorial']
---
```

**Best Practices:**
- Use lowercase
- Be consistent (always `javascript`, not `JavaScript`)
- 2-5 tags per post
- Use existing tags when possible

### Tag Pages

Automatic tag pages at `/blog/tag/[tag-name]`

Examples:
- `/blog/tag/javascript` - All JavaScript posts
- `/blog/tag/tutorial` - All tutorial posts

## Draft Posts

### Creating Drafts

```yaml
---
title: Work in Progress
draft: true
---
```

**Behavior:**
- Hidden in production builds
- Visible in development mode
- Not in RSS feed
- Not in sitemaps

### Publishing Drafts

Change `draft: false` or remove the field:
```yaml
---
title: Now Published
draft: false  # or remove this line
---
```

## Series

Group related posts:

```yaml
# Post 1
---
title: "TypeScript Basics - Part 1"
series: "TypeScript Fundamentals"
seriesOrder: 1
---

# Post 2
---
title: "TypeScript Basics - Part 2"
series: "TypeScript Fundamentals"
seriesOrder: 2
---
```

Series posts show:
- Navigation to previous/next
- Series index
- Progress indicator

## Images

### Cover Images

```yaml
---
image: /images/my-cover.jpg
imageAlt: Description of image
---
```

**Requirements:**
- Store in `public/images/`
- Recommended size: 1200x630px
- Formats: JPG, PNG, WebP
- Path starts with `/`

### Inline Images

```markdown
![Alt text](/images/diagram.png)
```

**Tips:**
- Use descriptive alt text
- Optimize images before adding
- WebP for better compression
- Add captions if needed

## SEO Optimization

### Meta Description

```yaml
---
description: "Clear, concise description under 160 characters"
---
```

### Open Graph

Automatic Open Graph tags from frontmatter:
- `title` → og:title
- `description` → og:description
- `image` → og:image
- `publishDate` → article:published_time

### Canonical URLs

Automatically generated from post slug.

## Reading Time

Automatically calculated and displayed:
- Based on word count
- ~200 words per minute
- Rounded up to nearest minute

Customize in `src/app/config/user.config.ts`:
```typescript
export const site = {
  showReadingTime: true,  // Set false to hide
}
```

## Table of Contents

Automatically generated from headings.

**Requirements:**
- Post must have H2 or H3 headings
- Enabled in config

**Configure:**
```typescript
export const site = {
  showTableOfContents: true,
}
```

## Pagination

Blog list pages are paginated.

**Configure:**
```typescript
export const site = {
  postsPerPage: 10,  // Posts per page
}
```

## Sorting and Filtering

### Default Sort

Posts sorted by `publishDate` (newest first).

### Filter by Tag

Click tags to see related posts.

### Archives View

See posts organized by year/month at `/archives`.

## RSS Feed

Published posts are included in `/rss.xml`. The endpoint is implemented in `src/pages/rss.xml.ts` and uses the configured `SITE` URL.

## Best Practices

### Writing

1. **Clear titles**: Descriptive and specific
2. **Good descriptions**: Engaging, under 160 chars
3. **Relevant tags**: 2-5 tags per post
4. **Quality content**: Well-structured, proofread
5. **Images**: Optimize and add alt text

### Organization

1. **Consistent naming**: Use kebab-case
2. **Logical tags**: Create tag strategy
3. **Series**: Group related content
4. **Updates**: Use `updatedDate` for revisions

### SEO

1. **Unique titles**: Don't duplicate
2. **Meta descriptions**: Every post
3. **Alt text**: All images
4. **Internal links**: Link to other posts
5. **External links**: Add value

## Common Workflows

### Write a new post

1. Create file: `src/content/blog/my-post.md`
2. Add frontmatter
3. Write content
4. Preview: `npm run dev`
5. Commit and deploy

### Update existing post

1. Edit the `.md` file
2. Update `updatedDate` in frontmatter
3. Save and rebuild

### Add a series

1. Create posts with same `series` value
2. Set `seriesOrder` for each
3. Posts will link automatically

### Convert draft to published

1. Change `draft: false`
2. Verify `publishDate`
3. Deploy

## Troubleshooting

### Post not showing

- Check `draft` is not `true`
- Verify `publishDate` is not in future
- Ensure file is in `src/content/blog/`
- Check frontmatter syntax

### Images not loading

- Confirm file in `public/images/`
- Check path starts with `/`
- Verify file extension matches
- Try absolute URL as test

### Tags not working

- Use lowercase consistently
- Check for typos
- Verify array format: `['tag1', 'tag2']`

### Build errors

- Validate frontmatter YAML
- Check for unclosed code blocks
- Verify all required fields present
- Run `npm run check`

## Examples

See existing posts in `src/content/blog/` for real examples.

## Related Documentation

- [Blog Frontmatter Reference](./BLOG-FRONTMATTER.md)
- [Markdown Customization](./MARKDOWN-CUSTOM-GUIDE.md)
- [User Configuration](./USER-CONFIG.md)
- [SEO Guide](./DEPLOYMENT.md#seo)
