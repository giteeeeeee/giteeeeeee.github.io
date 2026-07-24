# Customize the Site

## Preconditions

- Node.js `>=22.12.0`，已完成 `npm ci`。
- 先读 `must/project-basics.md`、`reference/configuration.md` 和 `memory/doc-gaps.md`。

## Steps

1. 编辑 `src/app/config/user.config.ts`：替换全部 `YOUR_*`、`yourusername`、示例邮箱/URL 和中文占位叙事；在 `user` 设置姓名、头像、可选地点、`contact.email/twitter/website/additionalLinks` 与 GitHub；在 `userContent` 设置双语 role/tagline/bio/status/focus/story/description；在 `site` 与 `aboutConfig` 设置站点事实和完整档案。完成后把 `site.templateMode` 改为 `false`。空的可选公开字段会在 Home、About、Links、Footer 同时隐藏；不要在其他配置复制联系人、GitHub URL、头像或站点名。
2. 编辑 `theme.config.ts` 的唯一 `defineTheme({ ... })` 对象：在 `preset` 选择 technology/paper/eink/forest/editorial/inkwash/monochrome-ink/anime-spring/anime-night/cosmic-abyss/ukiyo/ocean/retro-terminal，随后直接填写主色、字体、shape、背景或 effects。只填 `primary` 会舍弃预设固定辅助关键色并由 MD3 重推整套 palette；填写 `source` 才进入显式关键色模式，且 `source.primary` 优先。fontFamilies/scale、shape、background/imageStyle/gradient 和 seasonal/seasons 按层级合并；修改 global 字体时，原本继承预设 global 的角色会自动跟随，预设刻意差异化的角色仍保留。内置 Nunito、寒蝉全圆体和 Noto Sans SC fallback 已在 DocumentShell 自托管；纸张/刊物使用系统衬线回退，monochrome-ink 使用系统楷体回退，不增加网络请求，水墨/动画/宇宙/浮世绘/海岸/终端场景也只使用原创 CSS。新增其他 WebFont 时还需安装并导入对应字体资源。
3. 选择 `features.config.ts` 的首页 `flow` 或 `snap`，并按需调整 `home.showcase` 的 Blog/项目/Plog 数量；区分只控制入口的 `show*` 与控制集成加载的 `integrations.*`。
4. 编辑 `navigation.config.ts`；若新增 translation key，同时更新 `i18n.config.ts` 两种字典。
5. 按需编辑 projects、comments、links、media 配置；projects 只设置过滤/分类/featured，links 只设置外部链接/分类/交换文案，GitHub 身份与个人联系仍只改 user config。
6. 替换 `public/` 中头像、favicon、音频和其他占位资产；核对配置引用的文件真实存在。
7. 设置生产 `SITE`；项目只支持根路径部署，保持 `BASE=/`。
8. 先运行 `npm run verify` 与 `npm run audit`，再用真实 HTTPS origin 运行 `SITE=<origin> npm run check:production`；占位 `.example`/`.invalid` origin 会被拒绝。

## Verification

- 搜索代码和产物中是否仍有 `Your Name`、`yourusername`、`example.com` 等占位值。
- 检查 Header/Footer 导航、主题/语言切换、首页 flow/snap、外部链接和媒体降级。
- 用生产 preview 检查 canonical、RSS、robots、Sitemap 和 Pagefind。

## Common Failures

- 只改 `site.config.ts`：该文件是聚合门面，不是主要用户编辑入口。
- 复制整套个人配置来换外观：主题预设只负责视觉，不应复制 user/navigation/content/credentials；只改 `themeConfig` 对象的 `preset` 和必要覆盖字段。
- 同时维护兼容导出的 `activeThemePreset`、`backgroundConfig` 或 `fontFamilies`：它们已从最终 `themeConfig` 派生，不是第二套编辑源。
- 在 `links.config.ts` 添加 contacts/mySiteInfo，或在 `projects.config.ts` 添加 githubUsername：这些值已经从 user config 派生，会重新制造配置分叉。
- 只在一个语言字典添加 key：TypeScript 或运行时会出现缺失文案。
- 开启 music 但没有真实音频文件。
- 配置 GitHub/评论后仍期待完全离线构建或浏览器运行。
- 把 `BASE` 设置为非根路径；production check 会按当前支持合同直接拒绝。

## Related Docs

- `llmdoc/reference/configuration.md`
- `llmdoc/reference/environment-and-dependencies.md`
- `llmdoc/guides/configure-integrations.md`
