# Design System Contract

## Theme Pipeline

`presets/themes/` 提供完整可复用视觉参数；`src/app/config/theme.config.ts` 用一个 `defineTheme({ preset, ...overrides })` 对象解析最终主题。简单 `primary` 会从新主色重建 MD3 source，显式 `source` 才控制高级 key colors；解析结果再交给 `createTheme()`，以 Tonal Spot、Neutral 或 Monochrome variant 生成 light/dark palette。`themeToCSSVars()` 由 `src/pages/theme.css.ts` 输出可缓存 `/theme.css`；DocumentShell 根据包含 preset 元数据的完整主题配置和 CSS schema version 生成查询版本号，配置变化后不复用旧主题缓存。

页面级背景只由最终 `themeConfig.background` 与 `src/shared/components/Background.astro` 解释；`aurora`、`paper`、`eink`、`plain` decoration 分别提供科技光场、纸纤维、电子纸点阵和无装饰背景，`inkwash`、`monochrome-ink`、`anime-spring`、`anime-night`、`cosmic-abyss`、`ukiyo`、`ocean`、`terminal` 使用三层原创 CSS 场景表达彩墨远山、黑白墨痕、云与花瓣、星空与城市、星野与黑洞吸积盘、日轮与版画波纹、海平线与水纹、网格与扫描线。所有场景不依赖外部背景资产；feature 不再建立第二套页面底色配置。

DocumentShell 把最终 preset ID 输出到 `html[data-theme-preset]`，`src/design-system/styles/preset-identities.css` 以此提供独立于 palette 的材质与组件身份层；页面 feature 不得自行读取 preset 或复制身份分支。普通扩展身份继续消费 MD3 token，因此自定义 primary/source 会重着色而保留材质。`monochrome-ink` 刻意固定 light/dark 中性灰阶表面、楷体细线与朱砂点缀，`retro-terminal` 刻意固定经典近黑/磷光绿 token、CRT 纹理与方角组件；二者不跟随普通重着色规则。

## Variable Layers

- `--md-ref-*`: reference/tonal palette。
- `--md-sys-color-*`: Material system colors。
- `--reay-font-global/brand/navigation/heading/body/metadata/prose/prose-heading/mono` 与 typography/shape variables。
- `--reay-*`: 组件语义、surface、shadow、motion aliases；radius/shadow aliases 由预设 shape 输出，不再固化默认科技风。

组件优先使用 system/Reay token，不硬编码主题颜色。新增跨功能 token 同时检查 light/dark 和 RGB companion variables。

`--reay-font-sans`、`--font-sans` 和 `--font-mono` 只保留为兼容别名；UnoCSS preset 也会声明部分同名变量，应用和 Markdown 样式必须消费具体的 `--reay-font-*` 语义角色，避免样式加载顺序改变主题字体。

## Typography Contract

- 默认拉丁字体是自托管 `Nunito Variable`，默认中文字体是更圆润的自托管 `寒蝉全圆体` Regular；中文圆体通过 `@chinese-fonts/hcqyt` 按 Unicode range 切分并使用 `font-display: swap`，缺字依次回退到 `Noto Sans SC Variable`、PingFang SC、Microsoft YaHei 和系统 sans-serif。
- 主题预设的 `fontStacks` 组合 rounded/paper/clean/mono，`fontFamilies` 再划分 semantic roles；`themeConfig.typography` 可只覆盖单一角色、`baseSize`、`lineHeight` 或 scale。修改 global 时，只把 base 中等于 base global 的角色迁移到新 global，保留预设明确差异化的角色；mono 独立解析。
- `html` 使用 `--text-base` 和 `--reay-font-global`；body、品牌、导航、标题、元信息、Markdown/Plog prose 与 prose heading 分别消费对应角色，代码/键盘提示消费 `--reay-font-mono`。
- `technology` 的 `global` 是 Nunito Variable + 寒蝉全圆体 + Noto Sans SC Variable fallback；`createFontRoles()` 默认让 brand/navigation/heading/body/metadata/prose/proseHeading 继承同一 global 栈，因此修改预设的 global 即可覆盖整套角色，单独填写角色时仍应提供完整语言回退栈。
- UI 序号、日期、统计与标签使用 metadata/global，不借用 mono 制造第二套界面字体；mono 只用于代码、键盘输入等技术文本。
- 首页 Hero 使用 `--reay-home-hero-title`；当前 15px 根字号下 Hero 不超过 36px，Showcase 标题不超过约 24.3px，Blog lead 不超过约 22.2px。
- 组件不自行放大一级标题；新标题先选择语义层级，再选择现有 typography token。

## Style Ownership

- `src/design-system/styles/cards.css`: 跨功能 card/glass compatibility API。
- `immersive.css`: 页面布局、motion、沉浸式视觉和 legacy selectors。
- `src/features/home/styles/editorial-home.css`: 仅首页的编辑网格、间距、主题表面、响应式和交互。
- `src/features/<domain>/styles`: 领域专属样式。
- Astro component `<style>`: 组件局部规则。
- UnoCSS: utility/shortcut/icon 生成，不是 palette source。

当前 cards/immersive 存在 legacy selector 和职责重叠；删除前需要搜索所有 consumers 并有视觉回归证据。首页特有布局不得提升为跨功能 design-system API。

## Home Editorial Showcase Contract

首页不定义固定品牌色，颜色链始终为：

```text
用户 source colors -> MD3 tonal palettes -> --md-sys-color-* -> --reay-* / home feature
```

- `Background.astro` 独占页面级 gradient/image/none 背景；`PageScrollContainer` 和内容 section 保持透明。
- Profile 与 Showcase 共享错位双栏节奏，但不共享一种重复卡片外观；Blog 使用开放排版，项目使用单一 tonal shelf，Plog 使用图像 overlay。
- Profile status 和 Site Pulse 可使用 MD3 tonal surface；它们不得发展为每条内容一个背景的卡片墙。
- 热度等级只消费 primary、surface 和 outline 语义角色，不固化当前默认蓝绿色结果。
- 所有主题表面由 surface/container/primary/tertiary 语义角色组合，不能固化当前默认蓝色或青色结果。
- Footer 的 seamless 变体移除首页中的独立区块背景和重复 pill 边界。
- flow 下只有 Hero 使用视口最小高度，Activity section 按内容自然增长。
- focus-visible 必须清晰；740px 以下降为单列且无横向溢出。

完整结构与响应式约束见 `llmdoc/reference/home-editorial-design-language.md`。

## Site Editorial Page Contract

- Hero 之外的公开目录页通过 `EditorialPageLayout`、`EditorialPageHeader` 和 `EditorialSectionHeader` 共享紧凑左对齐骨架。
- 统计使用线性 `dl` 与 hairline，不使用 summary cards；目录内容优先开放式列表，每个功能区最多保留一个明显 tonal surface。
- Blog、Project 与 Gallery 详情可保留领域头部，但标题尺度、元信息密度、主题 token 和响应式边界必须与目录页一致。
- Gallery 的影像 surface 是内容表达，不应扩散成其他页面的通用卡片 API。
- 1440×900 必须看到首组真实内容，390×844 不得横向溢出；完整合同见 `llmdoc/reference/site-editorial-page-language.md`。

## Performance Contract

- 默认关闭季节粒子和首页波浪；重新启用时尊重 reduced-motion，并单独测试移动端。
- 主题背景场景默认静态；移动端减少细节，reduced-motion 关闭背景动画与过渡。
- flow 首页离屏 section 暂停动画；不把 infinite animation 当作跨 section 默认行为。
- layout-default 与 layout-home 的重复 surface 不使用 backdrop-filter。
- 不在大量列表项上常驻 `translateZ(0)`/`will-change`；只使用短时 opacity/transform transition。
- 页面切换不使用大面积 blur/filter。

## Icon Contract

UnoCSS 静态扫描无法发现配置对象中的动态 icon classes。`uno.config.ts` 的 `extractIcons()` 从 user/media config 收集 icon，并结合 core safelist。

新增配置 icon 来源时：

1. 确认 extractIcons 覆盖该配置。
2. 或显式加入 safelist。
3. 运行生产 build 检查 CSS/icon。

## Runtime Theme Contract

- `data-theme` 始终是 resolved `light`/`dark`。
- `data-theme-preset` 是最终预设身份，`data-theme-default` 是配置默认 mode。
- localStorage `theme` 可为 `light`、`dark`、`system`。
- localStorage 缺失时才读取 `data-theme-default`；初始化不得把配置默认值写回 storage，只有显式用户切换可以持久化。anime-night/cosmic-abyss/retro-terminal 默认 dark，monochrome-ink 默认 light，其余内置预设默认 system。
- DocumentShell 必须统一输出主题变量、首屏解析逻辑和带版本的 theme.css 链接。
- reduced-motion 和背景 fallback behavior 需要保留。
- `source.variant` 只允许 `tonal-spot`、`neutral` 或 `monochrome`；paper 使用 Neutral 抑制赭黄彩度，eink 使用 Monochrome，二者仍由 MD3 生成成对 on-color，不手写页面色板。

## Sources of Truth

- `src/design-system/theme/`
- `presets/themes/`
- `src/app/config/theme.config.ts`
- `src/shared/components/Background.astro`
- `src/design-system/styles/`
- `src/features/home/styles/editorial-home.css`
- `src/app/layouts/base/EditorialPageLayout.astro`
- `src/shared/components/EditorialPageHeader.astro`
- `src/shared/components/EditorialSectionHeader.astro`
- `uno.config.ts`
- `src/shared/client/runtime/theme-sync.ts`
