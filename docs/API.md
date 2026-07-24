# API Reference

本文记录应用层稳定入口。新增页面优先使用这些 API，不要在组件中重复查询和转换数据。

## 路径别名

```ts
import { getUserProfile } from '@app/config/site.config';
import { createTheme } from '@design/theme';
import { getSortedPosts } from '@features/blog/lib/blog';
import Header from '@shared/components/Header.astro';
```

| 别名 | 路径 |
| --- | --- |
| `@app/*` | `src/app/*` |
| `@design/*` | `src/design-system/*` |
| `@features/*` | `src/features/*` |
| `@shared/*` | `src/shared/*` |
| `@/*` | `src/*`，兼容用途 |

## 配置 API

统一入口：`src/app/config/site.config.ts`。

```ts
getUserProfile()
getUserContact()
getUserContactLinks()
getUserSocialLinks()
getLocalizedUserContent(lang?)
getSiteProfile(lang?)
getAboutConfig()
getThemeConfig()
getBackgroundConfig()
getEffectsConfig()
getLinksConfig()
getMediaConfig()
getMusicConfig()
getCommentsConfig()
getProjectsConfig()
getGitHubConfig()
getFeaturesConfig()
getNavigationConfig()
```

示例：

```ts
import { getFeaturesConfig, getUserProfile } from '@app/config/site.config';

const user = getUserProfile();
const homeLayout = getFeaturesConfig().home.layout;
```

这些 getter 返回只读配置对象。用户可编辑值仍放在对应的 `*.config.ts` 文件中。

## Blog API

入口：`src/features/blog/lib/blog.ts`。

### 查询

```ts
getAllPosts()
getSortedPosts()
getFeaturedPosts()
getLatestPosts(limit?)
getPostBySlug(slug)
getRelatedPosts(currentPost, limit?)
```

所有查询函数在生产构建中排除 `draft: true` 和 `published: false` 的文章。开发模式保留草稿以便预览。

```ts
import { getLatestPosts } from '@features/blog/lib/blog';

const posts = await getLatestPosts(6);
```

### URL 与路由参数

```ts
getPostSlug(post)
getPostUrl(post)
getTagUrl(tag)
getSeriesUrl(series)
encodePathSegments(path)
decodeRouteParam(param?)
```

Astro 7 内容条目的 URL 由 `entry.id` 推导。生成链接时使用 URL helper；`getStaticPaths()` 的 `params` 保持未编码值，由 Astro 负责路径编码。

### 归档

```ts
getAllTags()
getPostsByTag(tag)
getAllSeries()
getPostsBySeries(series)
getPostsByYear()
getPostsByMonth()
getArchiveStats()
```

## Plog API

入口：`src/features/gallery/lib/plog.ts`。

```ts
getAllPlogEntries()
createPlogAlbum(entry)
getPlogAlbums()
getPlogAlbumBySlug(slug)
getPlogGallery()
```

`getPlogGallery()` 返回：

```ts
interface PlogGallery {
  albums: PlogAlbum[];
  photos: PlogPhoto[];
}
```

相册图片通过构建期 `import.meta.glob` 从条目同级 `images/` 目录聚合；不要把该 glob 改成相对于旧 `src/utils` 路径的位置。

## GitHub API

入口：`src/features/projects/lib/github.ts`。

```ts
getUserRepos(username)
getGitHubRepo(owner, repo)
getRepoReadme(owner, repo)
getGitHubContributionCalendar(username)
formatNumber(value)
getLanguageColor(language)
```

构建期调用包含内存缓存、磁盘缓存、请求去重、超时和无 token 降级。兼容实现仍会读取非空的用户配置 token，但提交代码时必须保持为空，真实 token 只使用环境变量 `GITHUB_TOKEN` 或 CI Secret。

## i18n API

服务端 Astro 模板：

```ts
import { useI18n } from '@features/i18n/lib/i18n';

const { t, currentLang } = useI18n();
```

需即时翻译的元素使用 `data-i18n`：

```astro
<span data-i18n="nav.blog">{t('nav.blog')}</span>
```

个人简介字段使用 `data-user-content="bio|tagline|greeting|description"`。全局 `I18nRuntime` 会在首屏和 Astro 页面交换时更新这些元素；组件不应自行添加 `languagechange` 全局监听。

## 评论 adapters

入口：`src/features/comments/client/providers.ts`。

`commentProviderLoaders` 按统一签名映射 provider：

```ts
type CommentProviderLoader = (
  host: HTMLElement,
  config: CommentClientConfig,
) => void | Promise<void>;
```

新增 provider 时需要同步：

1. `CommentProvider` union。
2. `comments.config.ts` 的配置段。
3. `types.ts` 的客户端配置。
4. `providers.ts` 的 loader registry。
5. `Comments.astro` 的配置完整性判断和显示名称。

## 搜索与 Feed

- Pagefind UI：`src/features/search/client/search.ts`
- RSS：`src/pages/rss.xml.ts`
- robots：`src/pages/robots.txt.ts`
- Sitemap：`astro.config.mjs` 中的 `@astrojs/sitemap`

`npm run build` 才会生成 `dist/pagefind`，因此开发服务器中的搜索页不包含完整索引。验证搜索应使用生产构建和预览。

## 主题 API

入口：`src/design-system/theme/index.ts`。

```ts
createTheme(config)
themeToCSSVars(theme)
```

布局在构建时根据 `getThemeConfig()` 生成 light/dark CSS 变量。组件样式应优先使用 `--md-sys-color-*` 和 `--reay-*` token，避免硬编码主题颜色。

## 构建验证 API

```bash
npm run check
npm run build
npm run test:routes
npm run audit
```

`scripts/check-routes.mjs` 是生产产物契约：关键 HTML 路由、RSS、robots、Sitemap 和 Pagefind 任一缺失都会失败。
