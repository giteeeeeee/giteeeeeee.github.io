# Reflection: Preserve Domain Function Before Visual Unity

## Signal

全站编辑式重构后，用户指出 Hero 的 Twitter 与邮箱入口被移除、Links 卡片失去原有视觉辨识度、Archives 没有充分承载原本的浏览任务，Plog 仍把共享相簿身份的内容当作多个独立 album，About 也缺少完整叙事与真实站点信息。

## Lesson

- 全站一致性应统一字号、间距、主题所有权和交互质量，不应把所有领域强行压成同一种开放列表。
- 页面重构前要盘点用户可见功能并明确不可丢失项；可选联系人为空时可以隐藏，但标准字段、统一读取链和对应消费面不能静默删除。
- Archives 的内容模型是最近写作、年度节奏、主题和系列等多种浏览任务；Plog 的内容模型必须区分 collection 与单条 photographic moment。
- 视觉验收必须同时覆盖真实数据、无图片 fallback、1440×900、390×844 和语言切换，不能只看静态组件结构。

## Rule

未来全站改版先建立“领域功能与层级清单”，把它与视觉合同一起写入验收条件；只有确认功能保留后，才统一页面表面和布局语言。

## Evidence

- `src/features/home/components/HeroSection.astro`
- `src/features/links/components/LinkCard.astro`
- `src/features/archives/components/ArchiveChronicle.astro`
- `src/features/gallery/lib/plog.ts`
- `src/pages/about/index.astro`
- `tests/e2e/core.spec.ts`
