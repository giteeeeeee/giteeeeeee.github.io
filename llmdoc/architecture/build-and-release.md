# Build and Release Architecture

## Purpose

说明从内容/config 到生产产物、验证、CI 和 GitHub Pages 部署的实际流程。

## Local Pipeline

```text
npm ci
  -> SITE=<origin> npm run check:production (release only)
  -> ESLint
  -> npm run check
  -> Markdown local-link validation
  -> astro build
  -> pagefind --site dist
  -> scripts/check-routes.mjs
  -> scripts/check-performance-budget.mjs
  -> scripts/check-security-contracts.mjs
  -> Playwright/Axe E2E against dist
  -> npm audit (separate)
```

`npm run verify` 包含 lint、Astro check、文档链接、配置合同、完整 build、route smoke、静态性能预算、安全合同和 Playwright/Axe E2E，但不包含 audit。生产部署在 verify 前额外运行 `check:production`。

## Astro Build

`astro.config.mjs` 注册 UnoCSS 和 Sitemap，使用集中 Markdown processor，输出静态站点。`SITE`/`PUBLIC_SITE_URL` 设置 origin，缺失时回退到 `https://example.com`；Astro base 固定为 `/`，不支持子路径部署。

构建期还会：

- 同步并校验 Blog/Plog collections。
- 调用 GitHub API并使用 `.cache/github`。
- 优化本地 Plog 图片。
- 生成 RSS、robots 和 Sitemap。
- 生成双语自定义 `404.html`。
- 为动态内容生成静态详情页。
- 生成可缓存的 `/theme.css` 与 `/markdown.css`。

## Artifact Verification

`scripts/check-routes.mjs` 要求首页、404、主要栏目、Search、RSS、robots、Sitemap index、Pagefind JS、theme.css 和 markdown.css 等 16 个产物存在，并检查少量标记；它还递归扫描生成 HTML，拒绝缺少尾斜杠的目录型 root-absolute href，避免静态托管为站内导航增加 301 往返。

`scripts/check-performance-budget.mjs` 约束首页/Blog 列表 HTML、首页 inline 资源、`data-astro-rerun` 和共享 CSS 合同。它是静态回归门禁，不测 FPS、INP、LCP、内存或 layer。

`scripts/check-security-contracts.mjs` 验证 `draft/published` 的统一生产可见性和远程 README 净化。Playwright suite 验证核心导航/持久化、Pagefind、404、图库、移动菜单与 Axe WCAG A/AA。

`scripts/check-docs.mjs` 遍历 README、CONTRIBUTING、公开 docs、llmdoc 与预设说明，拒绝缺失的本地 Markdown 链接；它不验证外部 URL 可用性或标题锚点。

现有门禁仍不 crawl 全站内链、不验证全部 canonical/OG、不测试真实 provider，也不替代视觉回归或人工可访问性检查。

## GitHub Actions

CI workflow：

- PR -> main/develop、push develop、manual。
- Node 22、npm ci、GitHub cache restore、Chromium 安装、完整 verify、audit。
- `contents: read`。

Deploy workflow：

- push main 或 manual。
- Node 22、cache restore、Chromium 安装、`SITE`/`BASE=/` 生产配置检查、完整 verify、audit、Pages artifact upload/deploy。

## SEO Outputs

- `HeadMeta.astro`: title、description、canonical、robots、RSS discovery、OpenGraph、Twitter。
- `rss.xml.ts`: 发布文章 Feed。
- `robots.txt.ts`: 允许抓取并广告 Sitemap。
- `@astrojs/sitemap`: sitemap index 与分片。
- 客户端 i18n 只有一个静态默认语言索引，无 hreflang/语言路由。

## Release Invariants

- 生产构建不得保留 `example.com` 或模板身份。
- 完整搜索验证必须使用 `npm run build`。
- 依赖变更必须提交 lockfile 并运行 audit。
- main 直接部署必须通过与 CI 一致的 verify/audit，并额外通过生产配置检查。
- 子路径部署明确不支持；根路径合同由配置和 workflow 强制。

## Related Docs

- `llmdoc/guides/verify-and-deploy.md`
- `llmdoc/reference/environment-and-dependencies.md`
- `llmdoc/reference/routes.md`
- `llmdoc/memory/doc-gaps.md`
