# Reflection: A Layout Reference Is Not a Content Model

## Signal

首页方案讨论中，先把 Shiro 的活动流内容结构与双栏排版一起带入实现方向；用户随后澄清只希望参考其错落布局，首页仍应丰富展示个人信息、Blog、Plog、项目与站点信息，并与 About 保持清晰边界。

## Lesson

- 参考站必须拆成布局、信息架构、视觉资产和交互四个层次，用户接受其中一个层次不等于接受其余层次。
- 首页与 About 不应通过“信息多少”区分，而应通过任务区分：Home 负责快速认识与发现入口，About 负责完整背景与长期档案。
- “丰富内容”不要求恢复规则卡片墙；同一双栏骨架内可让文字、项目状态和影像采用不同表达。

## Rule

未来参考外部设计时，先明确借鉴层次；首页改版先列 Home/About/领域目录的职责边界，再决定展示数量与版式。

## Evidence

- `llmdoc/memory/decisions/2026-07-22-home-editorial-showcase.md`
- `llmdoc/reference/home-editorial-design-language.md`
- `src/features/home/components/ActivityStreamSection.astro`
