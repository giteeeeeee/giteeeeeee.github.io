# Documentation Routing

从最小相关集合开始，不要每次读取全部 llmdoc。

| 任务 | 先读 |
| --- | --- |
| 了解项目与范围 | `overview/project-overview.md` |
| 页面、布局、组件或依赖边界 | `architecture/frontend-composition.md` |
| Blog/Plog、slug、归档或图片 | `architecture/content-system.md`、`reference/content-schema.md` |
| 主题、语言、交互或 Astro 导航 | `architecture/client-runtime.md`、`reference/client-lifecycle-contract.md` |
| 性能、卡顿、动画或资源预算 | `guides/performance.md`、`architecture/client-runtime.md`、`reference/design-system-contract.md` |
| GitHub、评论、搜索或外部服务 | `architecture/external-integrations.md`、`reference/environment-and-dependencies.md` |
| 构建、CI、SEO、Feed 或部署 | `architecture/build-and-release.md`、`guides/verify-and-deploy.md` |
| 配置或功能开关 | `reference/configuration.md` |
| 公共路由 | `reference/routes.md` |
| 写文章 | `guides/add-blog-post.md` |
| 写相册 | `guides/add-plog-album.md` |
| 站点个性化 | `guides/customize-site.md` |
| 开启 GitHub/评论 | `guides/configure-integrations.md` |
| 更新项目知识 | `guides/update-llmdoc.md`、`memory/doc-gaps.md` |

规则：

- `llmdoc/index.md` 是全局地图；`startup.md` 只负责启动阅读顺序。
- 稳定事实进入 overview/architecture/guides/reference。
- 已确认的设计选择进入 `memory/decisions/`。
- 可操作但未关闭的问题进入 `memory/doc-gaps.md`。
- 调查过程、当前数量和临时命令输出只进入 `.llmdoc-tmp/investigations/`。
- 过程教训只有在确有失败、纠正或重复信号时才写入 `memory/reflections/`。
