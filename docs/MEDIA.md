# Gallery and Music

Astro Theme Reay includes two personal blog media pages:

- `/gallery` for photo albums
- an optional global floating music dock, disabled by default for performance and until real audio is configured

The gallery is driven by `src/content/plog/`. The music dock is driven by `src/app/config/media.config.ts`.

## Gallery Configuration

The gallery is a `plog` content collection, similar to the blog system.
Each `index.md` under `src/content/plog/` is one album collection. The `/gallery`
page shows those collections, and each collection gets its own detail page such
as `/gallery/xizang/`.

### Album Folder

Use one folder for one plog album:

```text
src/content/plog/
└── XiZang/
    ├── index.md
    └── images/
        ├── DSC_1695.jpg
        ├── DSC_2438.jpg
        └── DSC_3400.jpg
```

The folder name becomes the album route. For example, `XiZang/index.md` becomes
`/gallery/xizang/`.

Create `index.md` in a photo folder:

```yaml
---
title: '西藏'
description: '高原路上收集的光、云和山。'
publishDate: 2026-05-22
album:
  id: 'xizang'
  title: '西藏'
  description: '高原、湖泊、寺院和旅途片段。'
  icon: 'i-carbon:camera'
  accent: '#2563eb'
location: '西藏'
camera: 'Camera'
tags: ['西藏', '旅行', '高原']
gradient: 'linear-gradient(135deg, #0f766e, #2563eb, #f59e0b)'
accent: '#2563eb'
featured: true
---

可选正文：写一点合集背后的记录。
```

Every supported image inside `images/` becomes one photo in that album.
The album detail page shows the photo list, opens a lightbox on click, and
provides a download button for the original emitted image asset.

### Photo Metadata

Use the optional `photos` array in the same `index.md` when one image needs a
custom title, caption, signature, alt text, or download filename:

```yaml
photos:
  - file: 'DSC_1695.jpg'
    title: '云下的路'
    caption: '驶向高原深处的一段路。'
    signature: 'YOUR_SIGNATURE'
    alt: '西藏公路与云'
    featured: true
    downloadName: 'xizang-road.jpg'
```

The `file` value can be `DSC_1695.jpg`, `images/DSC_1695.jpg`, or
`./images/DSC_1695.jpg`. Image order follows filename order. Without explicit
metadata, titles are generated from the album title plus a number, such as
`西藏 01`, and the detail panel still shows the original filename.

### Photo Assets

Put album images in `images/`; no extra markdown files are required:

```text
src/content/plog/XiZang/images/DSC_1695.jpg
```

You can also set a cover image for the album with `image: './cover.jpg'`.
If no cover or photo image is found, the page uses `gradient` as a placeholder.

### Publishing Rules

- `draft: true` hides the album in production builds.
- `published: false` hides the album in production builds.
- `featured: true` marks the album as the hero album on the gallery page.
- `publishDate` controls the sort order.

## Music Configuration

先在 `src/app/config/features.config.ts` 把 `integrations.music` 改为 `true`，并确保下列音频路径真实存在。默认关闭避免模板缺失音频时仍向每个页面挂载播放器。

Edit `musicConfig.playlists` and `musicConfig.tracks` in `src/app/config/media.config.ts`:

```typescript
export const musicConfig = {
  player: {
    defaultTrackId: 'background-music',
    autoAdvance: true,
  },
  playlists: [
    {
      id: 'background',
      title: '背景音乐',
      description: '站点背景音乐播放列表。',
      icon: 'i-carbon:music',
      accent: '#2563eb',
    },
  ],
  tracks: [
    {
      id: 'background-music',
      playlistId: 'background',
      title: 'Background Music',
      artist: 'YOUR_ARTIST_NAME',
      album: 'Personal Mix',
      duration: '03:30',
      durationSeconds: 210,
      src: '/audio/background.mp3',
      cover: '/images/music/background.jpg',
      tone: 'calm',
      tags: ['Background'],
      accent: '#2563eb',
      featured: true,
    },
  ],
}
```

### Audio and Cover Assets

Put audio files in `public/audio/` and cover images in `public/images/music/`:

```text
public/audio/background.mp3 -> /audio/background.mp3
public/images/music/background.jpg -> /images/music/background.jpg
```

## Navigation

The gallery page is already linked from the global header and footer:

- Gallery: `/gallery`

Labels are defined in `src/app/config/i18n.config.ts` as `nav.gallery` and `page.title.gallery`.

## Global Music Dock

`src/features/media/components/MusicDock.astro` is conditionally mounted by the shared Header when `integrations.music` is enabled:

- `src/app/layouts/base/DefaultLayout.astro`
- `src/app/layouts/home/FullscreenLayout.astro`

The dock appears at the bottom-right of every page. It supports:

- play and pause from the compact button
- expanding into a small playlist window
- switching playlist filters
- switching tracks from the configured `musicConfig.tracks`

## Icons

Media icons are scanned from `media.config.ts` by `uno.config.ts`, so icons placed in album and playlist config are available at build time.
