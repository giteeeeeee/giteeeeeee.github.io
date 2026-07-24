# Reflection: Reduced Boundaries Must Not Reduce Information

## Signal

首页从栏目卡片重构为错位活动流后，用户再次指出字体和栏目仍偏大，同时个人信息、网站信息缺失，全站字体也没有形成足够明确的配置所有权。

## Lesson

- “减少卡片与栏目”不等于“减少有用信息”；个人主页仍需在首屏之后快速回答是谁、网站记录什么、内容规模和如何继续浏览。
- 视觉紧凑度必须用浏览器中的 computed font size、section height 和真实视口验证，不能只根据 CSS clamp 的文字描述判断。
- “配置驱动字体”必须覆盖普通界面、Markdown、代码和装饰字符；仅让 body 使用配置字体仍会留下局部漂移。

## Rule

未来调整首页时，先列出必须保留的信息清单，再压缩容器与字号；验收时同时检查 1440×900、390×844、根字号、关键标题、内容区高度和 Markdown/代码字体继承。

## Evidence

- `src/app/config/theme.config.ts`
- `src/features/home/components/ActivityStreamSection.astro`
- `src/features/home/styles/editorial-home.css`
- `tests/e2e/core.spec.ts`
