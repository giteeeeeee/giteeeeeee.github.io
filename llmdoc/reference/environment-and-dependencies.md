# Environment and Dependencies Reference

## Environment Variables

| Variable | Consumer | Default/Note |
| --- | --- | --- |
| `SITE` | `astro.config.mjs` | preferred production origin |
| `PUBLIC_SITE_URL` | `astro.config.mjs` | compatibility fallback after SITE |
| `BASE` | 生产检查/Actions | 必须为 `/`；Astro `base` 固定为根路径 |
| `GITHUB_TOKEN` | GitHub build integration | optional; env loses to non-empty user config token |
| `GITHUB_CACHE_TTL_MS` | GitHub cache | optional, undocumented in example env |
`SITE_URL` 和 `PUBLIC_GA_ID` 不是源码支持变量；公开部署文档只把它们作为不应配置的旧名称说明。`check:production` 通过 Node `--env-file-if-exists=.env` 自动读取本地环境文件，CI 仍可显式传入变量。

## Core Open-source Packages

- Astro、@astrojs/mdx/rss/sitemap/check
- UnoCSS 与 Iconify JSON sets
- Fontsource Variable Nunito/Noto Sans SC 与 `@chinese-fonts/hcqyt` 寒蝉全圆体 Unicode 分片（自托管拉丁、中文圆体与缺字 fallback；字体为 OFL-1.1，Web 分片包为 MIT）
- TypeScript
- Material color utilities
- Pagefind/default UI
- Shiki transformers
- Remark/Rehype/KaTeX/reading-time/mdast utilities
- marked

精确版本和许可证以 `package.json`、`package-lock.json` 和各 package metadata 为准。`npm audit` 只覆盖 npm advisory，不证明远程脚本、资产或服务安全/许可。

## Runtime/Build External Origins

- `api.github.com`: build-time REST/GraphQL。
- `giscus.app`, `utteranc.es`, provider Disqus domain。
- `unpkg.com`: Waline client/CSS。
- `cdn.jsdelivr.net`: Twikoo、Artalk、KaTeX CSS。
- `api.microlink.io`: `linksConfig.previews.provider = 'microlink'` 时在 link 卡片接近 viewport 后请求；当前默认启用，可改为 `none`。
- Configured remote avatar/link/image origins。

## Cache

- `.cache/github/` 是忽略的 build cache，可由 Actions restore。
- 正常 singleton TTL 为六小时，可由 `GITHUB_CACHE_TTL_MS` 覆盖。
- 故障 fallback 可读取过期 stale 数据，因此页面可能展示旧信息。
- cache 不应包含 token；token 只进入 request headers。

## Secret Rules

- `.env` 与 CI secrets 是唯一允许的 secret 存储面。
- 评论 config 会序列化到 HTML，只能包含公开参数。
- 不把 token 写入 user config、llmdoc、scratch 报告、构建日志或 Git history。

## Licensing Boundary

仓库本身声明 Apache-2.0。npm dependencies、第三方脚本/服务、远程 README、用户内容、照片、音频和图标/字体各自受其许可与条款约束；当前没有完整第三方许可证/资产来源 inventory。
