# Decision: Use an Asymmetric Activity Flow after the Hero

- Date: 2026-07-22
- Status: Superseded by `2026-07-22-home-editorial-showcase.md`

## Context

首页 Hero 已有稳定辨识度，但 Hero 后按“最近写作 / 精选项目 / 继续探索”分区仍像内容目录，栏目边界明显，也没有形成用户认可的 Shiro 式错落节奏。用户明确要求取消这些栏目，保留 Hero，并在底部加入真实热度表；主色和背景继续由配置与主题系统统一管理。

## Decision

- Hero 的内容、效果和操作保持不变，并继续作为唯一视口级首页区块。
- Hero 后只保留一个 Activity section，在非对称双栏中紧凑混排最多四条文章、仓库更新和 Plog。
- 条目不再按 Recent Writing 或 Featured Projects 分组；右栏只保留一个 Profile 主题表面，活动流后增加开放式 Site Overview，其余层级由排版、hairline、日期和留白表达。
- 使用无卡片 Wayfinder 连接主要路由，并在内容流底部展示构建期 GitHub 公开活动热度表。
- 热度表明确区分 contribution calendar、public events、repository updates、cache 和 empty，绝不虚构访问热度。
- flow 内容区按实际高度排版；snap 兼容保留，但不决定 flow 的视觉结构。
- 首页布局归 home feature；色彩和页面背景只消费配置生成的 MD3/Reay 变量和 `Background.astro`。

## Consequences

- 首页从栏目目录变为一条混合内容时间流，桌面端通过右栏错位形成节奏，移动端回归自然单列。
- 个人摘要是唯一完整主题表面；站点信息通过开放式信息带补全，重复卡片边界被移除。
- GitHub integration 关闭时不会发起热度请求，相关条目与热度表自然消失。
- 自动化验证 Hero 视口高度、Activity 自然流、结构 marker、热度格数量、标题尺度和移动端溢出。

## Sources of Truth

- `llmdoc/reference/home-editorial-design-language.md`
- `src/features/home/components/ActivityStreamSection.astro`
- `src/features/home/components/ContributionHeatmap.astro`
- `src/features/home/styles/editorial-home.css`
- `src/pages/index.astro`
- `tests/e2e/core.spec.ts`
