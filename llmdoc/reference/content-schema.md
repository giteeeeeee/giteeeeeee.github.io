# Content Schema Reference

## Blog

Loader: `src/content/blog/**/*.{md,mdx}`。

| Field | Type | Default/Required |
| --- | --- | --- |
| `title` | string | required |
| `publishDate` | date | required |
| `description` | string | optional |
| `updatedDate` | date | optional |
| `category` | string | optional |
| `tags` | string[] | `[]` |
| `series` | string | optional |
| `seriesOrder` | positive integer | optional |
| `cover`, `image` | string | optional public/remote path |
| `coverAlt`, `imageAlt` | string | optional |
| `author` | string | optional |
| `draft` | boolean | `false` |
| `published` | boolean | `true` |
| `featured` | boolean | `false` |
| `toc` | boolean | `true` |
| `comment` | boolean | `true` |
| `language` | `zh-CN` or `en-US` | `zh-CN` |

Slug: entry ID 去扩展名和结尾 `/index`。

标签与系列归档 URL 默认使用原始名称的 URL 编码；名称包含 `/` 时，路由段使用可逆的 `~2F~` 标记，因此 `C/C++` 可稳定生成单段静态路径而无需改写 frontmatter。

## Plog

Loader: `src/content/plog/**/*.{md,mdx}`。

基础字段：

- required: `title`, `publishDate`, `album.id`, `album.title`
- default: description/location/camera `''`, tags/photos `[]`
- album defaults: icon `i-carbon:camera`, accent `#5b8def`
- status: featured/draft `false`, published `true`, language `zh-CN`
- visual: image asset、imageAlt、gradient、accent

每个 Plog entry 是独立详情页；`album.id` 相同的 entries 在目录页归入同一 collection，`album.title/description/icon/accent` 应在同一合集内保持一致。

`photos[]`：

| Field | Type |
| --- | --- |
| `file` | required string, matches sibling image |
| `title`, `caption`, `description`, `signature`, `alt` | optional string |
| `date` | optional date |
| `location`, `camera`, `accent`, `downloadName` | optional string |
| `tags` | optional string[] |
| `featured` | optional boolean |

## Image Discovery

- 自动发现相册条目同级 `images/` 下的 jpg/jpeg/png/webp/avif/gif。
- 路径匹配标准化 slash、去掉 `images/`、忽略大小写。
- 元数据匹配不到时仍使用文件和条目级 fallback。

## Filtering

- `getAllPosts()` / `getAllPlogEntries()`：DEV 显示全部，PROD 排除 draft/unpublished。
- Blog detail getStaticPaths 当前仅排除 draft；这是明确 doc gap。

## Sources of Truth

- `src/content.config.ts`
- `src/features/blog/lib/blog.ts`
- `src/features/gallery/lib/plog.ts`
