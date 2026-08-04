# Content System Architecture

## Purpose

说明 Blog/Plog 从源文件到静态路由、聚合页面、搜索和 Feed 的数据流与不变量。

## Collections

`src/content.config.ts` 使用 Astro Content Layer 的显式 `glob` loader：

```text
src/content/blog/**/*.{md,mdx} -> blog
src/content/plog/**/*.{md,mdx} -> plog
```

schema 负责构建期校验和默认值。内容目录属于 Git 跟踪源，不是部署机私有状态。

## Blog Flow

```text
Markdown/MDX
  -> blog collection
  -> features/blog/lib/blog.ts queries and URL helpers
  -> /blog, /archives/*, homepage posts
  -> /blog/[...slug] render()
  -> Pagefind + RSS + Sitemap
```

- 目录型条目 `<slug>/index.md` 的 ID 会去掉扩展名和末尾 `/index`。
- `getPostUrl()` 负责链接编码；动态 `getStaticPaths()` 参数保持未编码。
- `getAllPosts()` 在生产排除 `draft` 和 `published:false`，开发环境显示全部以便预览。
- 标签和系列都从已发布集合聚合；系列内部按 `seriesOrder` 排序，缺失顺序放在后面。
- 标签或系列名中的 `/` 会在单段归档路由中转义为可逆的 `~2F~` 标记；页面标题与内容查询仍使用原始值，避免改变文章 frontmatter 语义。
- Blog detail 对有 `series` 的文章调用 `getPostsBySeries()`，用当前 entry 在有序集合中的真实索引显示 `3 / 5` 一类结构位置，并通过 `getPostUrl()` / `getSeriesUrl()` 生成相邻章节和系列目录入口。
- `remarkReadingTime` 在 Markdown processor 中写入渲染 frontmatter。
- 文章详情静态路径与列表入口共用 `isPublishableContentVisible()`，生产环境同时排除 `draft` 与 `published:false`。

## Plog Flow

```text
Plog index.md + sibling images/
  -> plog collection + eager import.meta.glob
  -> createPlogAlbum() per entry
  -> createPlogCollections() by album.id
  -> gallery collection list / moment detail
  -> Astro getImage() WebP derivatives
  -> Pagefind + Sitemap
```

- 嵌套目录路径成为相册 slug。
- 同级 `images/` 文件按自然文件名排序。
- 构建工具返回的图片模块路径可能带多层 `../`；路径归一化会移除任意层级的 `../content/plog/` 前缀，再以不区分大小写的 entry slug 匹配相册，确保迁移后的嵌套个人相册不会退化为单图 fallback。
- 每个 Markdown/MDX entry 是一个可独立访问的 photographic moment；共享 `album.id` 的 entries 在 `/gallery` 聚合成一个 collection，`album.title/description` 提供合集身份。
- `photos[].file` 只覆盖匹配图片的元数据，不是图片发现清单。
- 图片缺失时退化到条目封面或视觉占位，不应让构建崩溃。
- 生产同样排除 `draft` 和 `published:false`，开发显示全部。

## Markdown Rendering

`src/app/config/markdown.config.ts` 统一 GFM、数学、heading slug、KaTeX、阅读时间与 Shiki transformers。`markdown-style.config.ts` 和生成器管理文章视觉样式，Blog detail、Plog detail 的 entry 叙事与项目 README 复用该视觉层。Blog/Plog 正文消费 `--reay-font-prose`，其中 Markdown heading 消费 `--reay-font-prose-heading`；代码继续消费 `--reay-font-mono`。

## Search Discovery

生产构建仍由 Pagefind 索引 `data-pagefind-body` 下的全站公开内容。搜索页同时在构建期从可见 Blog/Plog 集合派生一份轻量文档，只包含 URL、标题、摘要、日期和主题关键词；它不复制正文，也不形成第三套内容源。浏览器在开发环境或 Pagefind 模块加载失败时使用这份文档进行本地匹配，使搜索不依赖生产索引才能完成基本发现。

## Publishing Invariants

- 改 schema 后同时更新内容 reference、写作 guide 和示例。
- 改 slug/URL helper 后同时检查动态路由、归档、RSS、Pagefind 与 Sitemap。
- 草稿和未发布内容不得意外进入生产发现入口。
- 不把内容数量写入稳定 docs。

## Related Docs

- `llmdoc/reference/content-schema.md`
- `llmdoc/guides/add-blog-post.md`
- `llmdoc/guides/add-plog-album.md`
- `llmdoc/reference/routes.md`
