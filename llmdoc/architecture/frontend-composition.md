# Frontend Composition Architecture

## Purpose

说明路由、布局、feature、shared 和 design-system 的真实所有权与组合关系。

## Ownership Map

- `src/pages/`: URL 入口和静态参数生成。
- `src/app/layouts/`: 全文档根布局与领域布局包装。
- `src/features/<domain>/`: 业务域的 components/lib/client/styles。
- `src/shared/`: 跨路由组件、布局原语和浏览器基础设施。
- `src/design-system/`: MD3 palette、token、CSS 变量和全局视觉基础。
- `src/app/config/`: 用户配置源与 `site.config.ts` 读取门面。

## Configuration Composition

个人与站点信息遵循单向派生链：

```text
user.config.ts identity/contact/github/content/site facts
  -> user-contact.ts normalization + site.config.ts getters
  -> Home / About / Links / Guestbook / Footer / Projects / RSS
```

页面不得回写或复制个人字段。Links 只拥有外部链接与交换文案；Projects 只拥有目录过滤/分类/featured；About 只拥有完整档案集合。GitHub URL、站点名/头像/URL/描述和所有公开联系人均由门面派生。

## Actual Dependency Shape

```text
pages -> app/layouts + features + shared + app/config
app/layouts -> shared + features + design-system + app/config
features -> app/config + selected features + occasional shared component
shared -> app/config + i18n/media features
design-system -> external Material color utility
```

这是一种 feature-first 组织，而不是严格分层。`shared` Header/Footer 使用 i18n/media feature，首页编辑组件组合 blog/gallery/projects 数据与 shared Footer，archives/home/projects 也复用其他领域逻辑。路径别名只表达意图，目前没有 lint 规则阻止越界或循环。

## Root Layouts

`src/app/layouts/base/DocumentShell.astro` 是唯一全文档根，`DefaultLayout.astro` 与 `home/FullscreenLayout.astro` 是它的两个组合包装；`EditorialPageLayout.astro` 再在 DefaultLayout 内统一非首页公开页的纵向间距与自动化标记。DocumentShell 统一负责：

1. 首屏前解析 light/dark。
2. 安装早期 i18n runtime。
3. 输出 HeadMeta 和 Astro `ClientRouter`。
4. 输出持久化主题 CSS 变量。
5. 安装页面 transition 和统一 ClientRuntime。
6. 挂载背景、季节效果、Header 和 Pagefind 内容边界。

两个包装只保留内容流差异：

- DefaultLayout 使用 Container、普通文档流、固定 Footer。
- FullscreenLayout 提供 flow/snap 首页外壳，Footer 由首页编辑内容末尾以 seamless 变体渲染。

修改主题/i18n/SEO/router/runtime/Pagefind 根合同应优先进入 DocumentShell；只有 default/home 的内容流确实不同时才修改对应包装。

## Domain Layouts

- Blog detail 组合开放式文章头、正文、TOC、Markdown 样式、增强脚本和评论；属于系列的文章还在元信息附近显示真实章节位置，并在文末提供系列目录与上一篇/下一篇。Blog/Plog 详情页的顶部返回入口消费共享历史来源状态，从归档、标签、系列、首页或搜索进入时回到原页面及查询状态，直接打开时分别回退 `/blog` 与 `/gallery`。
- Archives 在共享编辑式页首之后只保留 sticky `全部 / Blog / Plog` MD3 tonal 筛选；统一检索工作台按年份混排文章与 Plog 片刻，全部与 Blog 模式在主栏展示最多 4 个有序系列预览并提供完整目录入口，Plog 模式改为合集辅助面。侧栏不再复制无上限系列列表，热门主题每种内容最多显示 12 个，完整主题通过相对视口居中的可搜索/排序 dialog 选择并直接返回筛选结果。旧 tags/series/timeline URL 继续兼容，但不再作为同级主导航。
- Projects/Project detail 分别约束项目索引与 README 阅读宽度，详情统计采用线性元信息而非统计卡。
- Links 和 About 直接组合共享编辑式基础与领域 section；Links 使用有界自动换行的 16:9 视觉卡片，默认显示放大头像轻虚化背景，鼠标悬停或键盘聚焦后才按显式 screenshot、Microlink 截图的顺序加载预览，失败时继续保留头像背景。About 从统一用户配置读取个人摘要、完整叙事、工作流、联系人和真实站点统计。
- Gallery 目录页使用共享编辑式页首，把 Plog entry 按 `album.id` 组织为 collection，再以错落 moment 展示；详情页使用开放式影像与文字双栏、渲染 entry Markdown 叙事并保留灯箱。
- Guestbook 和 Search 使用共享编辑式页首，只把留言载体和搜索工作台保留为功能表面。Search 使用自有编辑式输入/状态/结果层，生产优先查询 Pagefind 全站索引，开发或索引加载失败时回退到构建期嵌入的 Blog/Plog 标题、摘要与主题文档；Guestbook 在有界居中内容流内先显示三条紧凑准则，再显示单一 MD3 tonal 留言表面；评论未开放时用访客文案说明状态，并从统一联系人门面派生替代入口，不显示 provider、thread 或源码配置路径。

## Homepage Composition

`src/pages/index.astro` 只组合 Hero 与 Activity 两个 section。`PageScrollContainer` 与 `FullPageSection` 保留 flow/snap DOM 合同；`viewportSized` 只用于 Hero，flow 下 Activity 按内容自然增长。

首页采用错位编辑式个人主页：

- Hero 保留打字机、光晕、全息头像、主次按钮和滚动提示等标志性效果。
- Profile Snapshot 只展示短个人定位、简介、关注方向、当前状态和公开联系入口；完整履历留在 About。
- Editorial Showcase 以 Shiro 式错位双栏分别表达 Blog、项目与 Plog；展示数量由 features config 控制，并优先使用 featured 内容。
- Site Pulse 合并配置化站点文案、真实内容统计与 GitHub 公开活动热度表，再由 seamless Footer 收尾；不再重复 Header/Footer 导航。
- 热度表只读取构建期 GitHub 数据并显示 GraphQL/events/repos/cache/empty 来源语义，不虚构访问量。
- 页面级主色和背景继续由 theme config、MD3 palette 与 `Background.astro` 统一管理。

首页网格、留白、响应式和交互规则位于 `src/features/home/styles/editorial-home.css`，不作为跨功能 design-system API。

## Invariants

- `flow` 是默认且无需 fullpage JavaScript 的可用模式；只有 Hero 使用视口最小高度。
- `snap` 才能把 section 绝对堆叠并捕获 wheel/touch/keyboard。
- 首页 section 顺序和 `data-section` 标记是 E2E 合同；`hero`、`activity`、`[data-home-stream]`、`[data-home-editorial]`、`[data-home-now]`、`[data-home-showcase]`、`[data-home-site]` 与 `[data-home-heatmap]` 必须各只有一个。
- 配置中动态 icon 类必须通过 UnoCSS extraction/safelist，否则不会生成 CSS。
- 个人邮箱、Twitter/X、网站、GitHub 和 additional links 必须经 `getUserContactLinks()` 或 `getUserSocialLinks()` 消费；新增个人展示面时不得创建新的联系人配置数组。
- 领域样式留在 feature；只有稳定跨域语义才进入 design-system。
- 非首页公开目录页统一使用 `EditorialPageLayout` 与 `EditorialPageHeader`；完整规则见 `reference/site-editorial-page-language.md`。

## Related Docs

- `llmdoc/architecture/client-runtime.md`
- `llmdoc/reference/design-system-contract.md`
- `llmdoc/reference/configuration.md`
- `llmdoc/reference/site-editorial-page-language.md`
- `llmdoc/memory/doc-gaps.md`
