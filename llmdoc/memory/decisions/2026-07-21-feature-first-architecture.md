# Decision: Adopt a Feature-First Architecture

- Date: 2026-07-21
- Status: Accepted

## Context

项目同时承载博客、归档、项目、相册、评论、搜索、媒体和首页等独立业务域。旧的按技术类型集中组织方式会让一个功能的组件、数据读取、客户端行为和样式分散在多个顶层目录，增加定位与改造成本。

Astro 路由仍必须位于 `src/pages/`，主题 token 需要跨功能共享，页面布局和通用浏览器基础设施也不适合归属某个单一业务域。因此不能把所有代码都机械移动到 feature 目录，也不能宣称仓库已经成为严格单向、自动受检的分层架构。

## Decision

采用 feature-first 作为主要组织原则，并保留五类明确边界：

- `src/pages/`：薄路由入口，只处理参数、静态路径、领域 API 调用和页面组合。
- `src/app/`：站点配置门面与页面级 layout；用户可编辑配置集中在 `src/app/config/`。
- `src/features/<domain>/`：一个业务域专属的组件、领域逻辑、客户端代码和样式共同归档。
- `src/shared/`：确实被多个业务域复用的 UI 和客户端基础设施。
- `src/design-system/`：MD3 token、主题生成和跨业务视觉基础。

应用代码优先从 `src/app/config/site.config.ts` 的 getter 读取配置；语义 import aliases 用于表达所有权。跨 feature 引用可以存在，但必须是显式组合，不得形成循环依赖或把领域内部实现伪装成 shared API。

## Consequences

- 阅读或修改一个业务能力时，首先从对应 `src/features/<domain>/` 和薄路由入口进入。
- 只有出现真实的跨域复用后才把实现提升到 `src/shared/`；设计 token 与全站视觉规则进入 `src/design-system/`。
- `DefaultLayout` 与 `FullscreenLayout` 共享 `DocumentShell` 文档根；全局能力在 shell 统一维护，包装层只保留 default/home 内容流差异。
- 当前 aliases 只表达约定，尚无 lint/import-boundary 自动验证；边界审查仍依赖 code review 和项目文档。
- 该决定允许渐进迁移，不要求为了目录纯度制造无价值抽象。

## Alternatives Considered

- 按 `components/`、`utils/`、`styles/` 等技术类型组织：简单，但会继续分散完整功能上下文。
- 严格单向层级或 Clean Architecture：边界更强，但对当前静态主题的规模和 Astro 文件路由约束而言成本过高。
- 所有内容都放入 feature：会错误吸收路由、全站配置、设计系统和真正共享的运行时基础设施。

## Sources of Truth

- `src/pages/`: Astro 公共路由入口。
- `src/app/config/site.config.ts` (`siteConfig`): 应用配置门面。
- `src/features/`: 业务域实现。
- `src/shared/`: 跨域组件与客户端基础设施。
- `src/design-system/`: 主题和视觉合同。
- `tsconfig.json`: 语义 import aliases。
