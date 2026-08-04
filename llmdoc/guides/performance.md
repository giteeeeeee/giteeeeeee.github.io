# Performance Maintenance

## Performance Model

本项目优先控制四类成本：持续绘制/合成、Astro 换页后的监听器与 DOM 引用、每页重复内联内容，以及长文章生成的 DOM。构建速度或 gzip 体积正常，不代表滚动和站内导航没有卡顿。

## Default Budget

`scripts/check-performance-budget.mjs` 在完整构建后检查：

- 首页 HTML 不超过 160 KB。
- Blog 列表 HTML 不超过 180 KB。
- 首页内联脚本不超过 12 KB。
- 首页内联样式不超过 16 KB。
- 页面不含 `data-astro-rerun`。
- `theme.css` 与 `markdown.css` 存在且包含核心合同。

预算是回归门禁，不等价于 Web Vitals 或浏览器性能结论。

## Runtime Rules

1. 页面级 listener、observer、timer、animation frame 必须返回 cleanup，并由 `client-runtime.ts` 管理。
2. 大型 feature runtime 只在对应 DOM 存在时动态导入。
3. 站内预取只使用 Astro `data-astro-prefetch`：Blog/Archives 高频入口在页面加载后预取，其余入口在 hover/focus 时预取，不维护第二套 fetch/prefetch runtime。
4. flow 首页通过 IntersectionObserver 暂停离屏 section 动画，并使用 `content-visibility`。
5. 默认不启用季节粒子、MusicDock 和首页波浪；重新开启时必须完成移动端与 reduced-motion 验证。
6. 页面切换只动画 opacity/transform，不对整页应用 blur/filter。
7. 重复卡片不使用 backdrop-filter 或常驻 `translateZ(0)`；模糊只留给少量焦点组件。
8. 目录型站内链接必须直接使用带尾斜杠的 canonical URL；构建产物检查会拒绝导致静态托管 301 的无尾斜杠 href。

## Cacheable Shared Assets

- `/theme.css`: MD3/Reay 主题变量，由 `src/pages/theme.css.ts` 构建。
- `/markdown.css`: Markdown 视觉规则，由 `src/pages/markdown.css.ts` 构建。
- i18n 字典与逻辑进入可缓存 client module；head 只保留首绘语言属性 bootstrap。
- MusicDock 与 Gallery lightbox 逻辑进入按需 client chunk，页面只保留小型 JSON 配置。

## Verification

```bash
npm run verify
npm run audit
```

浏览器可用时还要检查：

- 首页滚动时的长任务、paint、layer 和空闲 CPU。
- 主题/语言切换及前进、后退。
- 连续站内导航后 listener 数量与 heap 不持续增长。
- Search、Comments、Music 和 Gallery 离开路由后的 cleanup。
- 移动设备和 `prefers-reduced-motion`。

## Related Docs

- `llmdoc/architecture/client-runtime.md`
- `llmdoc/reference/client-lifecycle-contract.md`
- `llmdoc/reference/design-system-contract.md`
- `llmdoc/memory/doc-gaps.md`
