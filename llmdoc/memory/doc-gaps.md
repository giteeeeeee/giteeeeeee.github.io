# Known Gaps and Closure Conditions

本文件记录已由源码确认、但尚未形成一致实现或可信文档合同的问题。它不是路线图承诺；修改相关代码或文档时，应关闭、拆分或更新对应条目。

本轮已关闭：`published/draft` 生产可见性不一致、缺失自定义 404、非根 `BASE` 决策、deploy 门禁差异、远程 README 未净化、宽泛且无消费者的 feature flags、项目配置消费者缺失，以及默认媒体引用缺失。对应实现现由 route/security/E2E/production checks 覆盖。

## 发布与文档

### 真实 GitHub Pages 部署尚未验收

- 现状：deploy workflow 已从派生仓库变量读取 `SITE`、固定 `BASE=/`，并运行 production check、完整 verify 和 audit；模板仓库不保存真实站点 origin，本轮也没有读取某个派生站点的真实 Pages run 和线上产物。
- 影响：无法仅凭 workflow 源码证明仓库变量已配置、Pages 环境授权正确，或线上 canonical/RSS/robots/Sitemap 与预期完全一致。
- 来源：`.github/workflows/deploy.yml`、`scripts/check-production-config.mjs`、GitHub Pages 仓库设置。
- 关闭条件：任一使用真实配置的派生站点完成一次 main/manual Pages run，并核对部署后的首页 HTML、404、RSS、robots、Sitemap 和 canonical 均使用该站点的真实 `SITE`。

本轮已关闭旧版使用文档漂移：安装、快速开始、部署、FAQ、项目配置和文档导航已按 Node 22、`SITE`、`BASE=/` 与当前 workflow 重写；重复的 GitHub Actions/部署清单和历史迁移说明已删除，`scripts/check-docs.mjs` 进入 `verify` 并拒绝缺失的本地 Markdown 链接。

## 外部内容、安全与隐私

### 评论 provider 合同仍不完整

- 现状：comments 默认关闭，启用后默认要求访客显式点击才加载；但各 provider 的完整 CSP origin、自托管责任、隐私数据流、精确版本和第三方 teardown/theme/language update 合同尚未统一。
- 影响：站点所有者启用 provider 后仍需自行判断供应链、地区访问、Cookie、隐私和销毁行为。
- 来源：`src/app/config/comments.config.ts`、`src/features/comments/client/comments-runtime.ts`、`src/features/comments/client/providers.ts`。
- 关闭条件：为每个 provider 记录公开配置、网络 origin、固定版本、隐私/CSP 和 teardown/update 能力，并完成至少一个真实 provider 与拒绝加载路径测试。

### 缺少第三方许可证、服务条款和资产来源审计

- 现状：项目自身为 Apache-2.0，但没有依赖许可证清单、复制代码/图片/字体/图标来源记录、SaaS 条款清单或完整 NOTICE 评估。
- 影响：不能据项目 LICENSE 推断所有依赖、远程服务和媒体都采用同一许可证。
- 来源：`LICENSE`、`package.json`、`public/`、`src/assets/`、外部集成代码。
- 关闭条件：完成可复核的依赖与资产 provenance/许可证盘点，补齐所需署名或 NOTICE，并为评论、GitHub 与 CDN 服务记录适用条款和隐私责任。

## 客户端生命周期与验证

### 部分第三方和增强脚本生命周期仍需专项证明

- 现状：Music、Gallery、Search、Comments、Timeline 已有 cleanup/destroy 或幂等保护；核心 ClientRouter、Gallery、留言板关闭状态和移动菜单已有 Playwright/Chrome 证据。文章与 README 增强仍依赖 DOM marker，真实评论 provider adapter 没有统一第三方 teardown。
- 影响：未覆盖的第三方 provider 或长时间多页面交换仍可能产生重复副作用或陈旧引用。
- 来源：`src/shared/client/`、`src/features/*/client/`、文章/README enhancement scripts、`reference/client-lifecycle-contract.md`。
- 关闭条件：为剩余 runtime 明确 owner、初始化幂等性和 disposer；对真实评论 provider 与文章/README 连续前进、后退、多次交换运行专项浏览器/heap 测试。

### 自动化测试仍不是全站与真实集成证明

- 现状：`verify` 已覆盖类型/内容、完整构建、关键产物、性能预算、发布可见性、恶意 README、核心浏览器流程、Pagefind 全站结果与查询 URL、索引失败后的 Blog/Plog 回退、Blog/Plog 详情返回归档筛选状态、首页错位编辑橱窗、占位身份不生成虚构项目、个人/站点信息、配置化 Blog/Plog 数量与热度表结构、九类字体角色的回退和 computed-style 传播、自托管 Nunito/寒蝉全圆体/Noto fallback 加载、十三套主题预设注册/显式背景 decoration/默认 technology 合同、paper/monochrome-ink Neutral 与 eink Monochrome variant、单对象 `defineTheme` 的 primary/source 优先级与嵌套覆盖、preset identity/default mode DOM 合同、实际背景/shape token 传播、Blog TOC 正文 0%/100% 边界与居中完整圆环、UI/代码字体边界、Hero 视口高度、内容区自然流、全部主要目录页的共享编辑式页首、Archives Blog/Plog 混合条目与 URL 筛选、MD3 tonal 筛选器、最多 4 个系列主栏预览、每种内容最多 12 个热门主题、完整主题 dialog 在桌面/移动视口的居中与搜索/排序/选择/清除/结果焦点回归、居中有界的 Tag/Series 目录、Blog 文章 `3 / 5` 结构位置/相邻章节、Plog collection/moment 与 Markdown 叙事、About 配置化叙事、Links 有界 16:9 卡片/交互后截图加载/头像兜底、Guestbook 默认关闭状态/统一联系人/双语属性/桌面移动首屏，以及代表路由的移动端溢出和五个页面的 Axe WCAG A/AA；Search 额外完成 Chrome 1440×900/390×844、生产 Pagefind、开发轻量回退、无溢出/无控制台错误与归档历史返回复测；替代预设仍只有类型/配置合同门禁，八套扩展主题均完成独立构建；monochrome-ink 额外完成 Chrome light/dark、1440×900/390×844、首页与 Blog 正文的楷体/字重/中性表面/朱砂色/无溢出复测，cosmic-abyss 额外完成 Chrome light/dark、1440×900/390×844、首页与 Blog 正文的星野/吸积盘/观测舷窗材质/无溢出复测，但 CI 尚未逐套执行完整 E2E。仍没有 HTTP 全站 link crawl、像素级 visual regression、人工无障碍、真实评论 provider 或线上部署测试。
- 影响：现有门禁不证明全部动态路由、视觉像素、真实第三方服务和线上托管行为正确。
- 来源：`package.json`、`scripts/`、`tests/e2e/core.spec.ts`、`.github/workflows/`。
- 关闭条件：按风险补充全站 link crawl、关键 viewport visual baseline、键盘/屏幕阅读器人工清单、至少一个 live provider 测试，以及真实 Pages 部署验收。
