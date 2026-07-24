# Update llmdoc

当项目结构、架构、配置合同、工作流、不变量或可复用缺口变化时，使用 `llmdoc-update`。

## Fast Mode

刚完成实现且上下文仍新鲜时默认使用：

1. 读取 `llmdoc/index.md`、`startup.md` 和 MUST docs。
2. 根据 diff 和任务摘要列出受影响文档。
3. 用源码和验证结果确认事实。
4. 更新最小稳定文档集合。
5. 关闭、修改或新增 `memory/doc-gaps.md` 条目。
6. 同步 `llmdoc/index.md`。

## Analysis Mode

上下文陈旧、影响不清或事实冲突时，先在 `.llmdoc-tmp/investigations/` 做一个聚焦调查，再更新稳定 docs。

## Full Mode

高风险、争议事实、重大架构变化或确有过程教训时，分离 investigation、reflection 和 recorder 维护。

## Reflection Rule

只有出现失败、错误假设、用户纠正、重复 rework 或缺失信号时才写 `memory/reflections/`。普通成功更新不需要制造反思。

## Memory Rule

- decisions: 已确认的耐久选择。
- doc-gaps: 有关闭条件的缺失或冲突。
- reflections: 过程教训。
- `.llmdoc-tmp`: revision-bound 临时证据，不进入 index。
- active memory 文件超过 5 时，按 llmdoc skill 运行 lessons-learned/archive pass。

## Verification

- 所有 index 路径真实存在。
- startup 不复制 index，只列阅读顺序。
- docs 不记录易变数量或无证据能力。
- 文档与源码冲突时优先修正文档并保留 gap，而不是掩盖冲突。
