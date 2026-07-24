# Configure External Integrations

## GitHub Projects

1. 在 `user.config.ts` 设置真实 GitHub username。
2. 保持 config token 为空；需要提高限额时用 `.env`/CI `GITHUB_TOKEN`。
3. 运行生产构建，核对公开非 fork、非 archived 仓库结果和贡献 source。
4. 远程 README 会经过白名单净化；仍只展示可信仓库并核对外链与内容来源。

当前目录从 `user.github` 读取唯一 username/token，从 `projectsConfig.source` 消费 `excludeRepos/includeForked`，并继续读取 `defaultSort` 与 `featuredRepos`；显式 featured 还可引入外部仓库并覆盖 category/description/tags。

## Comments and Guestbook

1. 在 `comments.config.ts` 选择 provider。
2. 只填写公开 repo ID、category ID、endpoint、site/shortname 等客户端值。
3. 启用 `features.integrations.comments`、`commentsConfig.enabled`、article/guestbook mode，并确认单篇 `comment` frontmatter。
4. 根据 provider 准备 GitHub app/issue、服务端、数据库、域名和隐私政策。
5. 用真实浏览器测试首次加载、失败重试、主题、移动端、CSP 和 Astro 导航。

当前默认 `autoLoad: false`，访客必须点击按钮才联系第三方。若改为 `autoLoad: true`，接近 viewport 即加载，不再构成显式同意。

## Search

- Header 开关只控制入口显示，不移除路由或索引。
- 完整全站索引由 `npm run build` 生成；开发服务器使用从可见 Blog/Plog 集合派生的轻量标题/摘要/主题文档，不能据此判断项目和其他静态页面的生产结果。
- 生产加载失败会显示轻量索引状态和重试入口；开发模式不会请求不存在的 `/pagefind`。
- 查询在浏览器本地执行，并同步到 `/search?q=...` 以便刷新和分享。

## Remote Previews and Assets

- Friend-link preview 默认使用 `microlink`，卡片接近 viewport 时才请求远程 screenshot；显式 `screenshot` 优先，失败回退头像背景。对隐私或 CSP 更敏感的部署可改为 `provider: none`。
- Blog math CSS 从 jsDelivr 加载。
- 链接 avatar/图片可来自第三方域名。
- 部署者负责 CSP、隐私说明、SRI/版本策略和服务条款核对。

## Verification

- 无 token/invalid token/valid token 三种 GitHub 场景。
- provider 正常、超时、被阻止和缺少配置场景。
- 静态页面源码不包含 secret。
- `npm audit` 与第三方脚本/服务审查分别记录。

## Related Docs

- `llmdoc/architecture/external-integrations.md`
- `llmdoc/reference/environment-and-dependencies.md`
- `llmdoc/memory/doc-gaps.md`
