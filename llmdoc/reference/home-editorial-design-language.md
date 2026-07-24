# Home Editorial Showcase Design Language

## Intent

首页采用“沉浸 Hero + 编辑式个人主页”。Hero 的内容、排版、打字机、光晕、头像、按钮和滚动提示保持稳定；Hero 之后以 Shiro 式错位双栏组织个人摘要、Blog、项目与 Plog，但只借鉴排版节奏，不复制其内容模型、源码、组件或视觉资产。

首页负责让访客快速认识站点主人并发现代表性内容；About 继续负责完整自述、教育、经历、技能、兴趣和时间线。首页不得复制完整 About，也不得退化为 Blog、Gallery 或 Projects 的目录页。

## Theme Ownership

主色、全局字体与页面背景只有一条来源链：

```text
theme.config.ts source colors / typography / background
  -> MD3 tonal palettes + Background
  -> --md-sys-color-* / --reay-*
  -> home feature styles
```

- 首页不得写入固定品牌色或第二套页面底色。
- `Background.astro` 独占页面级渐变、图片和 none 背景模式。
- Profile status、project shelf、site pulse 与热度等级只使用 MD3 surface/container/outline/primary/tertiary 语义变量。
- 更换 source color、font stack 或 light/dark 后，首页不需要组件级配色或字体修改。

## Information Architecture

首页依次为：

1. Hero：唯一视口级沉浸区，视觉和交互保持稳定。
2. Profile Snapshot：短个人定位、简介、关注方向、当前状态和公开联系入口；不承载完整履历。
3. Editorial Showcase：同一错位双栏中展示配置数量的 Blog、GitHub 项目和 Plog，相互采用不同信息密度与视觉表达。
4. Site Pulse：站点定位、建站时间、技术信息、真实内容统计与 GitHub 公开活动热度表。
5. Seamless Footer：与首页背景连续，不再增加独立 Wayfinder。

Header 和 Footer 已提供全站导航；首页不再复制一组无上下文的导航链接。

## Profile Configuration

`user.config.ts` 把公开基础字段与本地化叙事字段分开：

- 基础字段：`name`、`avatar`、可选 `location`、`contact.email/twitter/website/additionalLinks` 和 GitHub；GitHub 公开链接只从 username 派生，Hero 联系入口按 GitHub、Twitter/X、Email 排序并对空值隐藏。
- 本地化字段：`role`、`tagline`、`bio`、`status`、`focus`、`greeting` 和 `description`。
- 可选字段为空时不渲染占位文案或空行。
- 首页通过统一 contact getter 展示联系方式，与 About、Links、Footer 不维护各自副本。
- `data-user-content` 支持 `focus.0` 形式的点路径，使数组项也能随客户端语言切换更新。

About 可继续读取同一配置，但应展示更完整的信息；首页只消费短摘要字段。

## Showcase Content Rules

- 展示数量由 `features.config.ts` 的 `home.showcase.posts/projects/plogAlbums` 控制。
- Blog 与 Plog 优先选择 frontmatter `featured`，再按日期回退；项目优先选择 projects config 中的 featured，再按更新时间回退。
- Blog 使用一篇 lead 与若干紧凑条目；项目集中在一个 tonal shelf；Plog 使用带真实封面或显式渐变 fallback 的错位影像卡。
- 项目缺少描述时不输出“暂无描述”占位段落。
- Plog 只展示真实照片数、地点和已有描述；不虚构浏览量或点赞。
- 所有详情链接继续使用 Blog/Plog URL helper 或项目详情路由，首页不替代领域目录页。

## Layout Rules

- `src/pages/index.astro` 只输出 `hero` 与 `activity` 两个 section；`activity` 是兼容 flow/snap 的首页编辑内容容器，不代表旧版混合时间流。
- flow 下只有 `[data-section="hero"]` 使用视口最小高度；编辑内容按自然高度增长。
- Profile 与 Showcase 都采用非对称双栏，右栏通过约数 rem 的纵向偏移形成节奏；语义顺序不依赖视觉定位。
- Blog 列以开放排版、细时间轴和少量 hairline 组织；项目只有一个集合主题表面；Plog 以错位图像建立视觉锚点，避免规则卡片墙。
- Site Pulse 横跨整行并合并站点统计与热度表；53 周画布在窄屏内部横向滚动，不扩大页面 `scrollWidth`。
- 740px 以下降为单列自然文档流；Plog 保持双图构图，极窄屏隐藏次要描述而保留标题和真实元信息。
- snap 仍可用，内容 section 自身提供纵向滚动；flow 是标准呈现。

## Typography and Motion

- 字体只由 `theme.config.ts` 的角色化 `fontFamilies`、`typography.baseSize` 和 `lineHeight` 控制；空角色回退 global，首页名称消费 brand，普通内容与元信息分别消费 body/metadata。
- 当前 15px 根字号下 Hero 不超过 36px，Showcase 标题约 24px，Blog lead 不超过约 22.2px，正文保持约 13.2–14.25px，元信息不低于约 10.5px。
- hover 只使用轻微位移、主题色变化和 Plog 图片短时 scale，不常驻 `will-change` 或大面积 blur。
- `prefers-reduced-motion` 下移除位移与缩放 transition。

## Responsive and Accessibility

- 1440×900 与 390×844 是必测视口；页面 `scrollWidth` 不得超过 `clientWidth`。
- Profile、Showcase、项目集合、Plog 集合、Site Pulse 与热度表使用 section/aside/article 等语义元素。
- 语言切换必须同时更新可见个人内容、`focus.*` 数组项、Profile aria-label 和热度表 aria-label。
- 热度表提供汇总统计和来源文字，单个色块不制造 365 个冗余可访问节点。
- `[data-home-stream]`、`[data-home-editorial]`、`[data-home-now]`、`[data-home-showcase]`、`[data-home-site]`、`[data-home-heatmap]` 与 `data-section="activity"` 是自动化合同。
- light/dark 与 source color 变化都要复测文字对比度、tonal surfaces、Plog overlay、focus-visible 和热度等级。

## Sources of Truth

- `src/app/config/user.config.ts`
- `src/app/config/features.config.ts`
- `src/app/config/theme.config.ts`
- `src/features/i18n/client/i18n-runtime.ts`
- `src/shared/components/Background.astro`
- `src/features/home/components/ActivityStreamSection.astro`
- `src/features/home/components/ContributionHeatmap.astro`
- `src/features/home/styles/editorial-home.css`
- `src/features/projects/lib/github.ts`
- `src/pages/index.astro`
- `tests/e2e/core.spec.ts`
