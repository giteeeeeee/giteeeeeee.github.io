# Configuration Reference

## Scope

`src/app/config/site.config.ts` 聚合用户配置，并提供应用优先使用的 getter。用户通常编辑同目录的领域配置，不直接复制 `siteConfig`。

## Configuration Map

| 文件 | 稳定职责 |
| --- | --- |
| `user.config.ts` | 身份、统一公开联系方式、GitHub、双语个人文案、About 内容与站点事实的唯一编辑源 |
| `theme.config.ts` | 唯一 `defineTheme` 对象；聚合预设、MD3 source、字体、shape、背景和 effects |
| `presets/themes/` | 十三套可复用视觉参数与注册表，不包含个人或内容数据；默认 technology，扩展含彩墨、黑白水墨、动画、宇宙、浮世绘、海岸和终端风格 |
| `features.config.ts` | 首页模式、入口显示与 comments/GitHub/music/seasonal 集成 gate |
| `navigation.config.ts` | Header 主导航与 Footer resources |
| `i18n.config.ts` | 默认语言、中英文 UI 字典，以及 About/Links/站点技术说明使用的配置化展示文案 |
| `projects.config.ts` | 项目过滤、分类、显示设置与 featured 仓库；不重复 GitHub 身份或 token |
| `comments.config.ts` | provider、lazy/autoLoad、article/guestbook 和公开 provider 参数 |
| `links.config.ts` | friend/resource links、分类、交换文案与可选远程预览 provider；不重复个人联系方式或站点卡片 |
| `media.config.ts` | 音乐播放列表、曲目和 player 选项 |
| `markdown.config.ts` | Unified、Remark/Rehype、Shiki |
| `markdown-style.config.ts` | Markdown 视觉样式合同 |

`user.config.ts` 把身份、联系方式、本地化叙事、站点事实和 About 专属集合分开：

- `user.name/avatar/location` 是个人身份源。
- `user.contact.email/twitter/website/additionalLinks` 是公开联系方式唯一来源，空值全站隐藏；Hero 只消费 GitHub、Twitter/X 与 Email。
- `user.github.username/token` 是 GitHub 唯一来源；公开主页 URL 从 username 派生，token 应保持为空并优先使用环境变量。
- `userContent` 提供本地化 `role/status/focus/tagline/bio/greeting/description/story`；`story` 保存 About 的标题、引言、正文和原则，其中 `description` 同时作为本地化站点描述。
- `site` 只保存 `since/builtWith/techStack` 等不应从身份或内容统计重复推导的事实；站点名、头像、URL、描述分别从 user/contact/userContent 派生，文章、主题、字数和写作年份在构建期从内容集合计算。
- `site.templateMode` 是模板发布保护标记；占位内容替换完成后才改为 `false`，生产检查还会独立扫描常见占位 token。
- `aboutConfig` 只保存 sections、education、experience、timeline，不再保存 socialNetworks 或第二份 site identity。

About section/item、timeline、`site.builtWith`/tech description 与 Links curated description 可保存对应的 `about.*`、`site.*`、`links.*` translation key；消费者只对这些命名空间解析词典，普通自定义字符串仍原样展示。Links 分类继续由稳定 `id` 派生 `links.category.<id>`，因此新增分类时需要同时补齐中英文 key。

客户端 `data-user-content` 支持 `focus.0` 形式的点路径。

`user-contact.ts` 把 email、website、派生 GitHub URL 和 additionalLinks 规范化为同一联系人集合并按 URL 去重。Home、About、Links、Footer 都通过 getter 读取；Links 的个人 social cards 和站点交换卡也在页面层从同一数据生成。

`theme.config.ts` 是全站视觉唯一用户编辑入口：`themeConfig = defineTheme({ preset: 'technology', ... })` 在一个对象中选择预设并填写站点差异。未填写 primary/source 时完整采用预设 key colors；填写 `primary` 时清除预设 secondary/tertiary/neutral 并由 MD3 从新主色重推，只有 variant（paper/monochrome-ink 的 neutral、eink 的 monochrome）随预设保留；填写 `source` 时仅采用显式 key colors，`source.primary` 优先于顶层 primary。typography/fontFamilies/scale、shape、background/imageStyle/gradient、effects/seasonal/seasons 深度合并；global 字体改变会传播到原本继承 base global 的角色，但不抹掉预设刻意不同的字体角色。十三套预设提供完整视觉基础，其中 inkwash/monochrome-ink/anime-spring/anime-night/cosmic-abyss/ukiyo/ocean/retro-terminal 使用对应原创 CSS 场景且不依赖外部背景资产；DocumentShell 通过 `data-theme-preset` 启用统一的组件身份层，不由 feature 重复判断。普通扩展主题可由 primary/source 重着色并保留材质，cosmic-abyss 默认深色并保留黑洞银河场景，monochrome-ink 固定中性黑白、系统楷体回退与朱砂身份，retro-terminal 固定经典黑绿 CRT 身份。`mode` 只在 localStorage 没有显式选择时成为默认值，初始化不写回 storage。兼容导出的 `activeThemePreset`、`fontFamilies`、`backgroundConfig` 只从最终对象派生。Header/Hero/Footer、共享表面与首页功能区消费生成的字体、radius 和 shadow token；头像等固有圆形媒体仍保持圆形。

## site.config.ts Getters

```text
getUserProfile
getUserContact
getUserContactLinks
getUserSocialLinks
getLocalizedUserContent
getSiteProfile
getAboutConfig
getThemeConfig
getBackgroundConfig
getEffectsConfig
getLinksConfig
getMediaConfig
getMusicConfig
getCommentsConfig
getProjectsConfig
getGitHubConfig
getFeaturesConfig
getNavigationConfig
```

`getGitHubConfig()` 合并 `user.github` 与 `projectsConfig.source` 的仓库过滤选项；Projects/Home/GitHub API 不读取第二份 username。`getSiteProfile(lang)` 派生统一站点视图，RSS、Home、About、Links 与 Footer 不维护 name/avatar/url/description 副本。

## Feature Flag Behavior

| 值 | 当前实际效果 |
| --- | --- |
| `home.layout` | 控制首页 flow/snap |
| `home.showcase.posts/projects/plogAlbums` | 控制首页内容橱窗中三类内容的最大展示数量；featured 优先，再按日期或更新时间回退 |
| `search.showInNavigation` | 控制 Header SearchButton；route/index 仍存在 |
| `discovery.showRssLink/showSitemapLink` | 控制 Footer 入口；生成端点始终存在 |
| `i18n.showLanguageSwitcher` | 控制 Header LanguageToggle；runtime 始终存在 |
| `integrations.music` | 控制 Header MusicDock mount；默认关闭，启用前提供真实音频 |
| `integrations.comments` | Comments 全局门禁，再与 comments config/props 合并 |
| `integrations.githubProjects` | 控制配置化 GitHub 项目目录与构建期取数 |
| `integrations.seasonalEffects` | SeasonalEffects mount 门禁，再与 theme effects config 合并；默认关闭 |

`comments.config.ts` 当前 `enabled: false`、`autoLoad: false`；`links.config.ts` 当前 preview provider 为 `microlink`。每条 link 可用 `screenshot` 覆盖 provider；远程截图失败时保留头像轻虚化 fallback，不阻止链接访问。

## Navigation Contract

- primary item 使用存在于两种翻译字典中的 `NavigationKey`。
- `showInFooter` 决定 Footer quick links。
- resource entries 当前使用固定 label，而不是 i18n key。
- 项目链接使用 root-absolute URL；这是根路径部署合同的一部分。

## Sources of Truth

- `src/app/config/site.config.ts` (`siteConfig`)
- `src/shared/components/Header.astro`
- `src/shared/components/Footer.astro`
- `src/app/layouts/home/FullscreenLayout.astro`
- `src/pages/index.astro`
