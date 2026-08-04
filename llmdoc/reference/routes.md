# Routes Reference

## Public Pages

| Route | Source | Data |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | 首页组件、配置、文章、项目 |
| `/404.html` | `src/pages/404.astro` | 双语自定义未找到页面 |
| `/blog/` | `src/pages/blog/index.astro` | blog collection |
| `/blog/[...slug]/` | `src/pages/blog/[...slug].astro` | 静态文章详情 |
| `/archives/` | `src/pages/archives/index.astro` | Blog/Plog 混合年份索引、类型筛选与上下文主题云 |
| `/archives/timeline/` | `src/pages/archives/timeline/index.astro` | 年份分组 |
| `/archives/tags/` | `src/pages/archives/tags/index.astro` | tag 聚合 |
| `/archives/tags/[tag]/` | `src/pages/archives/tags/[tag].astro` | 未编码 static param |
| `/archives/series/` | `src/pages/archives/series/index.astro` | series 聚合 |
| `/archives/series/[series]/` | `src/pages/archives/series/[series].astro` | 未编码 static param |
| `/gallery/` | `src/pages/gallery/index.astro` | Plog 聚合 |
| `/gallery/[...slug]/` | `src/pages/gallery/[...slug].astro` | 嵌套 Plog slug |
| `/projects/` | `src/pages/projects/index.astro` | 构建期 GitHub API |
| `/projects/[owner]/[repo]/` | `src/pages/projects/[owner]/[repo].astro` | 仓库详情与 README |
| `/links/` | `src/pages/links/index.astro` | links config |
| `/guestbook/` | `src/pages/guestbook/index.astro` | 留言准则、comments provider 或统一联系人派生的未开放状态 |
| `/about/` | `src/pages/about/index.astro` | about config + blog stats |
| `/search/` | `src/pages/search/index.astro` | Pagefind UI/index |

## Generated Endpoints

| Route | Source |
| --- | --- |
| `/rss.xml` | `src/pages/rss.xml.ts` |
| `/robots.txt` | `src/pages/robots.txt.ts` |
| `/sitemap-index.xml` | `@astrojs/sitemap` |
| `/pagefind/*` | Pagefind build stage |
| `/theme.css` | `src/pages/theme.css.ts` |
| `/markdown.css` | `src/pages/markdown.css.ts` |

## Route Invariants

- Blog/Plog link helper 编码每个 path segment；Astro static params 保持原始值。
- 旧 `/home` 兼容重定向已删除；首页唯一公共路径是 `/`。
- 项目详情失败重定向 `/404`；构建产物、双语标题和未命中路径 HTTP 404 由 route/E2E 覆盖。
- Sitemap/RSS/robots URL 正确性依赖 `SITE`。
- route/link 使用 root-absolute href；项目明确只支持根路径部署。
- Astro 使用 `trailingSlash: 'always'`；除根路径和文件端点外，生成链接与 canonical 均使用尾斜杠，route smoke 会拒绝无尾斜杠目录 href。

## Smoke-test Contract

`scripts/check-routes.mjs` 验证 16 个关键产物：404、主要栏目、Search、RSS、robots、Sitemap index、Pagefind JS 和两个共享 CSS，并检查关键内容标记与全部生成 HTML 的 canonical 目录 href。它不验证所有动态路由或完整 HTTP/browser behavior。
