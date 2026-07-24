# Operations Basics

## 运行环境

- Node.js `>=22.12.0`，npm `>=9.6.5`；`.nvmrc` 和 Actions 使用 Node 22。
- 静态输出目录是 `dist/`。
- `npm run build` 等于 Astro 构建加 Pagefind 索引；`npm run build:astro` 不生成可用搜索索引。

## 生产 URL

- `SITE` 是 canonical、RSS、Sitemap 和 robots 的生产 origin。
- `PUBLIC_SITE_URL` 是源码兼容回退，主文档以 `SITE` 为准。
- 缺少生产值时回退到 `https://example.com`，构建仍可能成功但 SEO/Feed 会错误。
- 项目明确只支持根路径部署：Astro `base` 固定为 `/`，生产检查要求 `BASE=/`。GitHub Pages 项目子路径不在支持范围内。

## 凭据

- GitHub token 只放 `.env` 或 CI secrets；评论配置只允许浏览器可见的公开 ID/endpoint。
- `.env`、`.cache/`、`.llmdoc-tmp/` 必须保持忽略。
- 当前 GitHub token 读取顺序是用户配置优先、环境变量其次；安全实践仍应保持用户配置为空。

## 验证合同

```bash
npm ci
npm run verify
npm run audit
```

- `verify`: ESLint -> `astro check` -> 文档本地链接 -> 个人配置单一来源合同 -> 完整构建 -> 16 个关键产物 smoke test -> 静态性能预算 -> 发布可见性/README 净化安全合同 -> Playwright/Axe E2E。
- `verify` 不包含安全审计，必须显式运行 `npm run audit`。
- E2E 覆盖核心导航、主题/语言持久化、Pagefind、404、图库兜底、移动菜单和三个页面的 WCAG A/AA 自动检查；它仍不等价于全站链接 crawl、视觉回归或真实 provider 测试。

## CI 与部署

- PR/develop CI 安装 Chromium，运行完整 `verify` 和 `audit`。
- main 部署工作流从仓库变量读取 `SITE`、固定 `BASE=/`，先运行 `check:production`，再运行完整 `verify`、`audit` 和 Pages 部署。
- 派生仓库必须在 GitHub Actions variables 中把 `SITE` 配置为自己的真实 HTTPS origin；未配置、示例域名或占位身份会被生产检查阻止部署。
