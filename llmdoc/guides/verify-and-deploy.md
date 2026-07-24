# Verify and Deploy

## Preconditions

- 已替换模板身份和媒体占位值。
- 已决定外部集成、隐私和 token 策略。
- 当前只支持根路径部署；`BASE` 必须保持 `/`。

## Local Verification

```bash
npm ci
npm run verify
npm run audit
npm run preview -- --host 127.0.0.1
```

真实部署再运行 `SITE=<真实 HTTPS origin> npm run check:production`；不要把文档中的 `.example`、`.invalid` 或 `yourusername` 占位值当作可发布配置。

`test:e2e:dist` 固定在 `127.0.0.1:4322` 启动独立生产 preview，不复用常见于 4321 的 Astro dev server。Pagefind 索引只存在于完整 `dist`，因此不要把 dev server 成功响应误当作生产 E2E 就绪。

然后至少检查：

- `/`、`/blog/`、`/gallery/`、`/projects/`、`/search/`
- `/rss.xml`、`/robots.txt`、`/sitemap-index.xml`
- `/pagefind/pagefind.js`
- canonical/OG/RSS URLs 没有 `example.com`
- 主题、语言、Astro client navigation 和返回/滚动行为
- Playwright/Axe 的核心导航、Pagefind、404、图库、移动菜单和 WCAG 自动检查通过
- `npm run test:performance` 与 `npm run test:security` 通过，且共享 theme/markdown CSS 可访问
- 配置的 GitHub/评论/外部媒体实际可用

## GitHub Pages

1. 配置 `Settings -> Pages -> GitHub Actions`。
2. 在 workflow build 环境显式传递生产 `SITE`，根部署传 `BASE=/`。
3. deploy workflow 会运行 production check、完整 verify 与 audit；仍建议用 branch protection 阻止绕过评审。
4. 部署后读取真实 HTML、RSS、robots 和 Sitemap，不以本地构建成功代替线上验证。

## Other Static Hosts

- Build command: `npm run build`
- Output directory: `dist`
- Node: `>=22.12.0`
- 设置 `SITE` 和根 `BASE`。
- 404、headers/CSP、cache-control 和 redirects 按宿主平台配置。

## Rollback

- 保留上一可用 commit/artifact。
- 外部 provider 故障可先关闭对应实际配置开关或 mount，再重新构建。
- SEO origin 错误应阻止发布，而不是部署后等待索引自行修复。

## Known Limits

- route smoke 不 crawl 内链；Playwright E2E 只覆盖核心路径。
- 当前已有核心 E2E 与 Axe 自动检查，但没有全站 link crawl、visual regression、人工无障碍或 live provider suite。
- 只支持根路径部署，不把缺少 BASE crawl 视为待实现的隐含子路径能力。

## Related Docs

- `llmdoc/architecture/build-and-release.md`
- `llmdoc/must/operations-basics.md`
- `llmdoc/memory/doc-gaps.md`
