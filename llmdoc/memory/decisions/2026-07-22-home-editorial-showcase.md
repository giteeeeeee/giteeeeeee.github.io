# Decision: Use an Editorial Profile and Content Showcase after the Hero

- Date: 2026-07-22
- Status: Accepted

## Context

旧版错位活动流消除了规则栏目卡片，却把 Blog、项目与 Plog 混为同一种条目，并在首页重复个人、站点与导航文案。用户明确要求 Hero 不变，只参考 Shiro 的排版节奏；首页需要更丰富地展示真实个人信息、Blog、Plog 和项目，同时不能复制 About 的完整功能。

## Decision

- Hero 内容、效果与操作保持不变，并继续作为唯一视口级首页区块。
- Hero 后先展示短 Profile Snapshot，只消费 role、bio、status、focus 和可选公开联系字段；教育、经历、完整技能与详细自述留在 About。
- 内容橱窗采用 Shiro 式错位双栏，但让 Blog、项目和 Plog 使用不同表达：开放写作列表、单一项目 tonal shelf、错位影像卡。
- 展示数量由 `features.config.ts` 控制；featured 内容优先，再按日期或更新时间回退。
- Site Pulse 合并站点统计、建站信息与真实 GitHub 热度表；删除重复 Header/Footer 的 Wayfinder。
- 首页布局归 home feature；配色、字体与页面背景继续消费配置生成的 MD3/Reay 变量和 `Background.astro`。

## Consequences

- 首页从混合活动流变为“快速认识人物 + 发现代表内容 + 查看站点积累”的编辑式主页。
- 首页与 About 的边界稳定：Home 是摘要与入口，About 是完整档案。
- Blog、项目和 Plog 的展示数量可调，但首页不替代对应目录页。
- `data-user-content` 支持数组点路径，新增公开资料字段为空时不制造占位内容。
- 自动化验证 Hero 保持、Showcase 三类内容数量、语言切换、内容自然流、移动端溢出、热度格数量和关键字号。

## Sources of Truth

- `llmdoc/reference/home-editorial-design-language.md`
- `src/app/config/user.config.ts`
- `src/app/config/features.config.ts`
- `src/features/i18n/client/i18n-runtime.ts`
- `src/features/home/components/ActivityStreamSection.astro`
- `src/features/home/styles/editorial-home.css`
- `tests/e2e/core.spec.ts`
