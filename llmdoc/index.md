# llmdoc Index

## Purpose

本目录是 Astro Theme Reay 的高密度项目知识入口。它描述当前源码的架构、合同和可复用工作流；源码与文档冲突时，以当前源码和可复现验证为准，并通过 `llmdoc-update` 修正文档。

- 每次进入项目先转到 `llmdoc/startup.md`。
- `.llmdoc-tmp/` 是忽略提交的临时调查缓存，不属于本索引或项目事实来源。

## Categories

- `must/`：每次会话都要读取的最小共同上下文。
- `overview/`：项目身份、边界和主要能力。
- `architecture/`：所有权边界、运行流程和关键不变量。
- `guides/`：一次只解决一个维护工作流。
- `reference/`：配置、路由、schema、生命周期和依赖等稳定查阅合同。
- `memory/`：已接受决策、待关闭缺口和确有必要时的过程反思。

## Startup and MUST

- `llmdoc/startup.md`：会话启动阅读顺序和按任务升级入口。
- `llmdoc/must/project-basics.md`：项目身份、技术基线、目录职责和模板状态。
- `llmdoc/must/working-agreement.md`：架构、生命周期、内容、安全和完成标准。
- `llmdoc/must/operations-basics.md`：Node、构建、生产 URL、凭据、CI 与部署基线。
- `llmdoc/must/doc-routing.md`：按任务选择最小文档集合的路由表。

## Overview

- `llmdoc/overview/project-overview.md`：产品目标、用户、能力边界和主要子系统。

## Architecture

- `llmdoc/architecture/frontend-composition.md`：薄路由、共享 DocumentShell、feature/shared/design-system 的组合边界，以及 Archive/Blog 系列阅读组合。
- `llmdoc/architecture/content-system.md`：Blog、Plog、slug、可见性、归档、搜索回退文档和构建期图片处理。
- `llmdoc/architecture/client-runtime.md`：Astro 页面交换、主题、增强 i18n、搜索、历史返回、首页/图库/归档交互和清理模型。
- `llmdoc/architecture/external-integrations.md`：Pagefind、GitHub、评论 provider 与外部信任边界。
- `llmdoc/architecture/build-and-release.md`：静态构建、Pagefind、lint/文档/安全/E2E 门禁、CI、Pages 部署和生产 URL 流程。

## Guides

- `llmdoc/guides/customize-site.md`：从模板占位值到个性化站点的配置顺序。
- `llmdoc/guides/add-blog-post.md`：新增和验证 Blog 内容。
- `llmdoc/guides/add-plog-album.md`：新增 Plog 相册与本地图片。
- `llmdoc/guides/configure-integrations.md`：配置 GitHub、搜索、评论和外部网络边界。
- `llmdoc/guides/verify-and-deploy.md`：安装、全量验证、生产 URL 检查和部署验收。
- `llmdoc/guides/performance.md`：性能预算、客户端清理、动画/玻璃边界和浏览器复测合同。
- `llmdoc/guides/update-llmdoc.md`：按 fast/analysis/full 模式维护项目知识。

## Reference

- `llmdoc/reference/configuration.md`：用户、站点、主题预设与覆盖、功能、导航、媒体、评论和项目配置面。
- `llmdoc/reference/routes.md`：公共静态路由、canonical 尾斜杠、404、动态路由、Feed 和 robots。
- `llmdoc/reference/content-schema.md`：Blog/Plog frontmatter、默认值和 slug 规则。
- `llmdoc/reference/client-lifecycle-contract.md`：文档级单例、页面级 disposer 和 Astro 事件合同。
- `llmdoc/reference/design-system-contract.md`：MD3 token、CSS 变量、模式与主题生成合同。
- `llmdoc/reference/home-editorial-design-language.md`：首页个人摘要、错位内容橱窗、Home/About 边界、GitHub 热度表、主题所有权与响应式合同。
- `llmdoc/reference/site-editorial-page-language.md`：Hero 之外的共享编辑式页首、克制文案语气、开放列表、归档检索、系列详情路径、功能表面、密度与响应式合同。
- `llmdoc/reference/environment-and-dependencies.md`：环境变量、Node/npm、依赖角色与外部安全边界。

## Memory

- `llmdoc/memory/decisions/2026-07-21-feature-first-architecture.md`：采用 feature-first，同时保留 app/shared/design-system/薄路由边界的决定。
- `llmdoc/memory/decisions/2026-07-22-home-asymmetric-activity-flow.md`：已被编辑式内容橱窗取代的旧错位活动流决定。
- `llmdoc/memory/decisions/2026-07-22-home-editorial-showcase.md`：保留沉浸 Hero，并用个人摘要、错位 Blog/项目/Plog 橱窗与 Site Pulse 重构其余首页的决定。
- `llmdoc/memory/lessons-learned.md`：从已归档反思中提炼的跨任务规则，包括信息保留、参考层次和领域功能优先。
- `llmdoc/memory/archive/`：已提炼的原始反思记录，供追溯信号与证据。
- `llmdoc/memory/doc-gaps.md`：已确认但尚未统一的实现、运维、安全和文档合同，以及各自关闭条件。
- `llmdoc/memory/reflections/2026-07-23-theme-config-usability.md`：预设能力不应隐藏用户原有直接配置入口的可用性教训。
- `llmdoc/memory/reflections/2026-07-23-preview-style-cache.md`：逐套重建视觉预览时同时核对场景 computed style，避免旧组件 CSS 造成误判。
- `llmdoc/memory/reflections/`：执行相似配置或模板工作前主动读取相关条目。

## Routing Rules

- 只想开始工作：读 `startup.md`，不要把本索引当作启动文档的重复版本。
- 修改已知工作流：先读对应 `guides/`，再读相关 architecture/reference。
- 触及未决能力或安全边界：先读 `memory/doc-gaps.md`，不要把待办描述成现有保证。
- 调整结构或所有权：读 feature-first 决策和 `architecture/frontend-composition.md`。
- 更新稳定知识：按 `guides/update-llmdoc.md` 操作，并同步本索引与 doc gaps。
