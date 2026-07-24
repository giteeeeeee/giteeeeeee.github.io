# Rebuilt Preview Can Retain Stale Component CSS

## Signal

逐套构建主题后，Chrome 中的背景 class 与主题色已更新，但场景层 computed style 仍为 `position: static` 和 `background-image: none`。Astro preview 与已有 ClientRouter 标签复用了旧组件 CSS，而新的 `/theme.css` 和 HTML 掩盖了这一差异。

## Lesson

视觉验收不能只检查预设 class、主题变量或截图色调。重建静态产物后，应同时确认代表性场景层的 computed style 已更新；当组件 CSS 仍旧时，使用全新 origin/标签或重启 preview，再继续比较视觉结果。

## Applied Rule

- 每套背景先核对 decoration class 和至少一个 scene layer 的 computed `position`/`backgroundImage`。
- 主题色更新但场景样式未更新时，先排除 preview/ClientRouter 缓存，不立即修改场景源码。
- 最终验证重新构建默认 technology，避免把临时预览 preset 留在用户配置中。
