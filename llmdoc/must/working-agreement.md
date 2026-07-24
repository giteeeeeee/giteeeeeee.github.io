# Working Agreement

## 架构纪律

- 把 `src/pages/` 保持为薄路由层：读取参数、调用领域 API、组合布局和组件。
- 用户可编辑值放入 `src/app/config/`；应用优先通过 `site.config.ts` getter 读取。
- 领域专属代码进入 `src/features/<domain>/`；真正跨域的组件和浏览器基础设施才进入 `src/shared/`。
- MD3 token、主题生成和跨功能视觉基础归 `src/design-system/`。
- 使用 `@app`、`@design`、`@features`、`@shared` 语义别名。它们表达约定，但当前没有自动 import-boundary 检查。
- 当前是 feature-first 组织，不是严格单向分层；跨 feature 组合必须保持显式并避免循环依赖。

## 客户端生命周期

- 文档级单例只初始化一次；页面级行为必须能在 Astro 页面交换前清理并在 `astro:page-load` 重建。
- 新增全局监听、timer、animation frame 或 observer 时同时设计 disposer/idempotence。
- `flow` 首页必须在没有 fullpage JavaScript 时正常滚动；只有 `snap` 可捕获全局输入。
- 主题、语言、Pagefind 和评论都有各自的持久化或第三方边界，修改前先读对应架构/reference。

## 内容和 URL

- Blog/Plog slug 从 Astro entry ID 派生，不恢复已删除的 `entry.slug`。
- 内容文件属于仓库源代码；不要让 `src/content` 再次被 `.gitignore` 排除。
- 生成动态路径时把未编码值交给 `getStaticPaths()`，生成链接时使用领域 URL helper。
- 不把当前文章数量、构建页数或外部 API 结果写成稳定架构事实。

## 安全和外部数据

- 不在配置、文档、评论 JSON 或 Git 历史中保存 token/secret。
- GitHub README、评论 CDN、外链截图和远程图片是外部信任边界，不由 `npm audit` 覆盖。
- `set:html`、远程脚本、SaaS provider、缓存降级和第三方资产的变化需要单独审查。

## 完成标准

- 至少运行 `npm run lint` 与 `npm run check`；影响构建、路由或公开文档时运行 `npm run verify`。
- 依赖或发布变更额外运行 `npm run audit`。
- 结构、流程、配置合同或重要缺口变化后运行 `llmdoc-update`，并同步 `memory/doc-gaps.md`。
