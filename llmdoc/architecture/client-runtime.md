# Client Runtime Architecture

## Purpose

说明 Astro ClientRouter 下的浏览器生命周期、主题、语言、首页导航和 feature-local runtime 合同。

## Core Bootstrap

`src/shared/client/runtime/client-runtime.ts` (`initReayClientRuntime`) 只启动一次，并区分两类行为。

文档级单例：

- route transition
- internal navigation provenance
- theme sync
- i18n runtime

站内预取由 Astro ClientRouter 的 `data-astro-prefetch` 负责，不再安装第二套全局预取 runtime。Blog 与 Archives 使用 load 级预取，其余主导航保持 hover 级预取；所有目录型 href 直接指向带尾斜杠的 canonical URL。

页面级实例：

- mobile menu
- theme toggle
- floating header
- fullpage scroll
- generic page interactions
- seasonal effects
- flow section visibility
- music dock
- gallery lightbox
- archives explorer
- search workspace
- history-aware detail back links
- typewriter
- language toggle DOM binding

`astro:before-swap` 清理页面级实例；`astro:page-load` 先清理再重建。新增页面级全局行为必须提供 `destroy()` 或 cleanup function。

## Theme Flow

```text
theme.config.ts
  -> createTheme()
  -> generateMaterialPalettes()
  -> themeToCSSVars()
  -> static /theme.css
```

DocumentShell 同时输出 `data-theme-preset` 和 `data-theme-default`。首屏 inline script 在绘制前优先解析 `localStorage.theme`，缺失时采用配置默认 mode，再把 `data-theme` 设置为 resolved `light`/`dark`。持久化值可为 `light | dark | system`；页面初始化只应用默认值而不写入 storage，只有访客实际使用 ThemeToggle 才持久化，因此更换预设后新默认 mode 可以生效，显式选择仍优先。`theme-sync.ts` 在系统变化和 Astro swap 前后保持 resolved attribute。

## i18n Flow

构建输出始终使用默认语言。`I18nRuntime.astro` 只在 head 中设置首绘语言属性；翻译字典和逻辑由可缓存 client module 维护：

- `localStorage.language`
- `html.lang` 与 `html[data-lang]`
- `data-i18n`、`data-i18n-attr`、`data-i18n-attrs`
- `data-i18n-date` 与 locale-aware 日期格式
- `data-page-title-key` 声明式页面标题
- `data-user-content`、`data-text`；个人内容支持 `focus.0` 形式的对象/数组点路径
- `languagechange` custom event
- incoming document translation on Astro swap

Incoming document 在 swap 前翻译一次；after-swap 只同步 document lang/title，不再重复扫描整棵 DOM，也不安装全局 MutationObserver。

当前实现是硬编码中英切换的客户端策略。`featuresConfig.i18n.strategy` 没有运行时消费者；添加字典本身不会自动增加语言或 SEO 路由。

## Flow and Snap

- flow 不构造 FullPageScroll，section 保持普通文档流。
- flow 用 IntersectionObserver 标记视口附近 section；离屏 section 暂停动画并使用 `content-visibility`。首页只有 Hero 保持视口最小高度，内容 section 使用自然高度。
- snap 依赖 `#fullpage-container[data-home-layout="snap"]`、`.fullpage-section` 和可选 `.section-dot`。
- snap 捕获全局 wheel/touch/navigation keys，但必须让内部可滚动 active element 优先。
- 实例销毁时必须移除 listener、timer 和 animation frame。

## Route Transitions

当前自定义 transition runtime 保存原生 `document.startViewTransition`，再安装 resolved shim；实际进入动画以 140ms 的轻量 opacity/3px transform 为上限，不对整页使用 filter，也不启用跨文档 `@view-transition navigation: auto`。Chrome 的站内导航复测无 transition console error；恢复原生 View Transitions 仍需要独立浏览器测试。

## Feature-local Runtimes

MusicDock、Gallery lightbox、Archives explorer、Search、seasonal、fullpage 与通用交互由中心 runtime 按 DOM 动态导入，并在 before-swap cleanup。Archives explorer 同步内容类型、主题、年份可见性、系列/合集辅助面与空状态，把 `type` / `topic` 写入 URL 并响应 `popstate`；系列主栏预览在全部/Blog 可见、Plog 隐藏，完整主题 dialog 支持搜索/排序，选择或清除主题后关闭弹层、聚焦结果锚点并滚回内容。Search 自行管理 debounce、`q` URL、Pagefind 动态模块、轻量 Blog/Plog 回退、语言重绘、分页与 listener/worker cleanup；开发模式不会请求不存在的 `/pagefind`。文档级 navigation provenance 在站内链接触发时记录当前 URL，并把来源写入目标 history state；Blog/Plog 的 `data-history-back` 页面实例优先调用真实 history back，缺少站内来源时保留静态 href 兜底，文章 hash history 继续保留来源 state。Links 预览只在 fine pointer 悬停或键盘聚焦后加载，并同时监听 load/error、cached complete 与 decode；离开卡片后恢复头像背景，失败也保持头像 fallback。Gallery 在缺少图片时显示显式渐变 fallback，打开时聚焦关闭按钮，关闭后把焦点交还触发按钮。Comments 会清理 observer、button listener 和 host，并用 i18n key + 当前语言 API 更新加载、失败和重试反馈。TOC 有独立 cleanup；文章与 README 增强依靠 DOM marker 保证幂等，剩余边界见 lifecycle reference 和 doc gaps。

## Related Docs

- `llmdoc/reference/client-lifecycle-contract.md`
- `llmdoc/reference/design-system-contract.md`
- `llmdoc/architecture/external-integrations.md`
