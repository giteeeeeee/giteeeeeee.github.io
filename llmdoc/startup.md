# Startup

每次进入项目时按顺序阅读：

1. `llmdoc/must/project-basics.md`
2. `llmdoc/must/working-agreement.md`
3. `llmdoc/must/operations-basics.md`
4. `llmdoc/must/doc-routing.md`

然后按任务升级：

- 页面、组件或依赖边界：读 `architecture/frontend-composition.md`。
- 内容、路由或 frontmatter：读 `architecture/content-system.md` 和对应内容 guide。
- 浏览器交互、主题或语言：读 `architecture/client-runtime.md` 与生命周期 reference。
- 性能、卡顿或资源体积：读 `guides/performance.md`、`architecture/client-runtime.md` 与设计系统 reference。
- GitHub、评论、搜索或 SEO：读 `architecture/external-integrations.md`。
- 构建、CI 或部署：读 `architecture/build-and-release.md` 和部署 guide。
- 重复处理曾出错的流程：先读相关 `memory/reflections/`；当前目录可能为空。
- 修改稳定知识：先读 `guides/update-llmdoc.md` 和 `memory/doc-gaps.md`。

遇到文档与源码冲突时，以当前源码和可复现验证为准，并通过 `llmdoc-update` 修正文档。
