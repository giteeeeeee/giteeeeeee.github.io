# 部署指南

Astro Theme Reay 输出纯静态站点，构建目录为 `dist/`。当前只支持根路径部署：自定义域名或 GitHub Pages 用户/组织站点；不支持 `/repository-name/` 形式的项目子路径。

## 发布前条件

1. `src/app/config/user.config.ts` 中的身份与文案已替换，`site.templateMode` 为 `false`。
2. `SITE` 是真实 HTTPS origin，不含 path、query 或 hash。
3. `BASE=/`。
4. 外部 GitHub、评论、截图、媒体配置已经按隐私要求确认。
5. 本地通过 `verify` 与 `audit`。

```bash
npm ci
SITE=https://your-production-origin.invalid npm run check:production
SITE=https://your-production-origin.invalid npm run verify
npm run audit
```

命令中的 `.invalid` 地址用于提示替换，不能直接通过生产检查。

## 生产变量

| 变量 | 必需 | 说明 |
| --- | --- | --- |
| `SITE` | 是 | canonical、OpenGraph、RSS、robots 与 Sitemap 的 origin |
| `BASE` | 是 | 当前必须为 `/` |
| `GITHUB_TOKEN` | 否 | 构建期 GitHub API；仅存入 Secret |
| `GITHUB_CACHE_TTL_MS` | 否 | GitHub 缓存 TTL，单位毫秒 |

`PUBLIC_SITE_URL` 仅作为历史兼容回退；新部署统一使用 `SITE`。`SITE_URL` 和 `PUBLIC_GA_ID` 没有源码消费者，不应配置。

## GitHub Pages

仓库已提供 `.github/workflows/deploy.yml`：

1. 仓库 `Settings → Pages` 的 Source 选择 `GitHub Actions`。
2. 在 `Settings → Secrets and variables → Actions → Variables` 新建 `SITE`，值为真实站点 origin。
3. 可选：在 Secrets 中提供 `GITHUB_TOKEN`；工作流默认也能使用 GitHub 自动令牌。
4. 使用用户/组织站点仓库或绑定自定义域名，确保最终页面位于根路径。
5. 推送到 `main` 或手动触发 Deploy workflow。

工作流顺序：

```text
npm ci
→ check:production
→ verify
→ audit
→ upload-pages-artifact
→ deploy-pages
```

部署权限只需要 `contents: read`、`pages: write` 与 `id-token: write`，不需要允许 Actions 修改仓库内容或创建 PR。

## 其他静态宿主

| 设置 | 值 |
| --- | --- |
| Node | `22` |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `dist` |
| Environment | `SITE=<真实 origin>`、`BASE=/` |

Vercel、Netlify、Cloudflare Pages 等平台还应按各自文档配置：

- SPA fallback 不应吞掉真实的 `404.html`。
- `theme.css`、`markdown.css`、`pagefind/` 和带 hash 的 Astro 资产适合长期缓存。
- HTML、RSS、robots 与 Sitemap 应允许及时刷新。
- 若设置 CSP，应显式纳入已启用的评论 provider、Microlink、KaTeX CDN 或远程图片 origin。

## 部署后验收

至少检查：

- `/`、`/blog/`、`/archives/`、`/gallery/`、`/projects/`、`/search/`
- `/404.html`、`/rss.xml`、`/robots.txt`、`/sitemap-index.xml`
- `/pagefind/pagefind.js`、`/theme.css`、`/markdown.css`
- HTML 的 canonical、OpenGraph 与 RSS URL 使用真实 `SITE`
- 主题、语言、移动导航、搜索、详情页返回与图片灯箱
- 已启用的 GitHub、评论、外链截图和媒体服务

## 回滚

- 保留上一个可用 commit 或宿主平台 artifact。
- 外部 provider 故障时先关闭对应 `features.config.ts` / provider 配置，再重新构建。
- 生产 origin 错误应阻止发布；不要等待搜索引擎自行纠正。

## 已知限制

- 不支持 GitHub Pages 项目子路径。
- 自动化测试不等价于全站链接 crawl、像素级视觉回归、人工无障碍或真实第三方 provider 测试。
- 仓库不负责评论 SaaS、GitHub、Microlink、CDN 或远程媒体的可用性和数据政策。
