# 常见问题

## 为什么 `check:production` 失败？

它会拒绝以下状态：

- 缺少 `SITE`，或 `SITE` 不是无路径的 HTTPS origin。
- `SITE` 仍是 `.example`、`.invalid`、`example.com` 或 `yourusername` 占位地址。
- `BASE` 不是 `/`。
- `site.templateMode` 仍为 `true`。
- `user.config.ts` 仍包含 `YOUR_*`、`yourusername` 或示例邮箱。

这是发布保护，不影响 `npm run dev` 与普通 `npm run verify`。

## 为什么不支持 GitHub Pages 项目子路径？

当前内部链接、Feed、Pagefind、静态资产和 canonical 统一采用根路径合同。请使用 `username.github.io` 用户/组织站点或自定义域名。将 `BASE` 改为 `/repository-name` 会被生产检查拒绝。

## 为什么开发环境搜索结果不完整？

Pagefind 在 `npm run build` 后生成 `dist/pagefind`。开发服务器会使用 Blog/Plog 构建期轻量回退，完整搜索请运行：

```bash
npm run build
npm run preview
```

## 为什么 Projects 为空？

模板默认 `user.github.username = 'yourusername'`，为了避免无意义请求会直接返回空目录。替换为真实公开用户名，并确认 `features.config.ts` 中 `integrations.githubProjects` 为 `true`。

GitHub 限额不足时可在 `.env` 提供 `GITHUB_TOKEN`，不要写入 `user.config.ts`。

## 为什么 GitHub 数据不是最新的？

构建使用 `.cache/github` 与 ETag；网络失败时允许读取过期缓存。删除本地 `.cache/github` 后重新构建可强制刷新，但 CI 仍可能从 Actions cache 恢复。生产问题应先检查构建日志和 API 状态。

## 为什么评论或留言板没有输入框？

评论有两层开关：

1. `features.config.ts` 的 `integrations.comments`。
2. `comments.config.ts` 的 `enabled`、页面级开关和 provider 必填参数。

默认 `autoLoad: false`，访客需要明确点击才会加载第三方脚本。启用前请阅读 provider 的隐私、CSP 与数据政策。

## 如何关闭 Microlink 截图？

```ts
// src/app/config/links.config.ts
previews: {
  provider: 'none',
  endpoint: 'https://api.microlink.io/',
}
```

卡片会继续使用放大头像作为背景。也可以为单条 link 设置 `screenshot`，避免远程截图请求。

## 为什么音乐播放器不显示？

默认 `integrations.music: false`。启用前需要在 `media.config.ts` 配置真实 track，并确保 `src` 指向 `public/` 中存在的音频文件。

## 如何切换主题或主色？

只编辑 `theme.config.ts` 的 `defineTheme({ ... })`：

```ts
export const themeConfig = defineTheme({
  preset: 'paper',
  primary: '#52634F',
});
```

访客本地已经选择 light/dark/system 时，`localStorage.theme` 优先于预设默认 mode。清除该项可重新观察预设默认值。

## 为什么新增 Iconify 图标没有样式？

动态类名无法总被 UnoCSS 静态扫描。配置中的图标应放在现有可扫描字段，或同步加入 `uno.config.ts` safelist。新增 icon collection 时还需安装对应 `@iconify-json/*` 包。

## 如何预览草稿？

`draft: true` 或 `published: false` 的内容在开发环境可见、生产构建不可见。发布前用生产构建确认最终集合：

```bash
npm run build
npm run test:security
```

## 应该运行哪些检查？

普通变更：

```bash
npm run lint
npm run check
```

提交或发布前：

```bash
npm run verify
npm run audit
```

涉及真实部署时再额外运行 `npm run check:production`。

## 仍然无法定位问题怎么办？

1. 确认 Node 22、`npm ci` 和当前 lockfile。
2. 查看终端第一个错误，不要只看最后的汇总。
3. 对照 [安装](./INSTALLATION.md)、[用户配置](./USER-CONFIG.md)、[项目结构](./PROJECT-STRUCTURE.md) 与 [部署](./DEPLOYMENT.md)。
4. 提交 issue 时附上复现步骤、运行命令、环境版本和已脱敏日志；不要附带 token 或私有信息。
