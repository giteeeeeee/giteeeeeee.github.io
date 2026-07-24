# Add a Blog Post

## Preconditions

- 读 `architecture/content-system.md` 和 `reference/content-schema.md`。
- 选择稳定、URL 友好的 slug。

## Steps

1. 创建 `src/content/blog/<slug>/index.md` 或 `.mdx`。
2. 至少填写 `title` 和 `publishDate`。
3. 按需填写 description、category、tags、series、seriesOrder、cover、author、featured、toc、comment、language。
4. 未准备发布时设置 `draft: true`；生产隐藏需要同时遵守 `published` 当前已知缺口。
5. 文章相关本地资源放在条目目录或 `public/`，并使用有效 alt text。
6. 开发预览后运行 `npm run check`。
7. 发布前运行完整 `npm run build`，核对详情、归档、搜索和 RSS。

## Verification

- `/blog/<slug>` 可访问，标题、日期、TOC、数学/代码块符合预期。
- tags 与 series 页面出现文章，series 顺序正确。
- Pagefind 能搜索文章，RSS 使用正确 SITE origin。
- 草稿不进入生产构建发现入口。

## Common Failures

- 在 `getStaticPaths()` 预先 encode 参数，导致 Astro 中文路由匹配失败。
- 恢复 `entry.slug`；Astro 7 应从 entry ID 派生。
- 只运行 `build:astro` 后测试搜索，缺少 Pagefind index。
- 使用 `published:false` 假设详情一定不生成；当前该行为仍是 doc gap。

## Related Docs

- `llmdoc/reference/content-schema.md`
- `llmdoc/reference/routes.md`
- `llmdoc/memory/doc-gaps.md`
