# Add a Plog Moment or Collection

## Preconditions

- 读 `architecture/content-system.md` 和 `reference/content-schema.md`。
- 准备经过授权并完成尺寸/隐私检查的图片。

## Steps

1. 创建 `src/content/plog/<category>/<slug>/index.md`。
2. 填写 moment 的 title、publishDate 和必填 `album.id`/`album.title`；同一 collection 的多个 entries 复用相同 `album.id` 与合集元数据。
3. 填写 description、location、camera、tags、gradient、accent 等相册元数据。
4. 把照片放入同级 `images/`；支持 jpg/jpeg/png/webp/avif/gif 及大写扩展名。
5. 需要单图覆盖时，在 `photos` 数组中用 `file` 匹配图片，并填写 caption、date、location、camera、tags、alt、featured 等。
6. 运行 `npm run check` 和完整 `npm run build`。

## Verification

- `/gallery` 按 `album.id` 显示合集并在合集内展示 moments，详情 slug 保留嵌套 category。
- 图片按自然文件名顺序出现，缩略图/预览图构建成功。
- 灯箱、下载名、alt、caption 和元数据正确。
- 缺失图片时 empty/fallback 仍可用且不会误导访客。

## Common Failures

- 把 `photos` 当作发现清单却没有同级图片文件。
- `photos[].file` 大小写或路径与实际文件不匹配。
- 移动 `plog.ts` 后忘记修正相对 `import.meta.glob` 路径。
- 把原始超大图片全部提交而未评估仓库和构建成本。

## Related Docs

- `llmdoc/reference/content-schema.md`
- `llmdoc/reference/environment-and-dependencies.md`
