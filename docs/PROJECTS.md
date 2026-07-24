# 项目展示

Projects 领域在构建期读取公开 GitHub 仓库，生成项目目录和 README 详情页。GitHub 身份只在 `user.config.ts` 设置；`projects.config.ts` 只负责过滤、分类、展示选项与精选仓库。

## 1. 设置 GitHub 身份

```ts
// src/app/config/user.config.ts
export const user = {
  github: {
    username: 'yourusername',
    token: '',
  },
};
```

模板占位值 `yourusername` 会主动跳过外部请求并显示空状态。替换为真实公开用户名后，目录会自动读取该账号的公开仓库。

不要把 token 写入 config：

```env
GITHUB_TOKEN=<YOUR_GITHUB_TOKEN>
```

无 token 也能构建，但 GitHub 公共 API 限额更低。无效 token 会自动重试匿名请求。

## 2. 项目配置

```ts
// src/app/config/projects.config.ts
export const projectsConfig = {
  source: {
    excludeRepos: ['private-mirror', 'yourusername/archived-demo'],
    includeForked: false,
  },
  displaySettings: {
    showLanguages: true,
    showStars: true,
    showForks: true,
    showLastUpdate: true,
    defaultSort: 'updated',
  },
  categories: [],
  featuredRepos: [],
};
```

### source

- `excludeRepos`：可写仓库名或 `owner/repo`，比较时忽略大小写。
- `includeForked`：是否展示 fork；归档仓库始终隐藏。

### displaySettings

- `defaultSort`：`stars | updated | created | name`。
- 其余字段控制卡片元数据是否显示。

### categories

```ts
{
  id: 'frontend',
  name: 'Frontend',
  description: 'Interfaces and web experiences',
  icon: 'i-carbon:code',
}
```

分类 `id` 用于筛选和精选仓库映射。保留 `all` 与 `featured` 可提供完整目录和精选入口。

## 3. 精选与外部仓库

```ts
featuredRepos: [
  {
    owner: 'yourusername',
    repo: 'your-project',
    category: 'frontend',
    featured: true,
    customDescription: 'YOUR_PROJECT_DESCRIPTION',
    tags: ['Astro', 'TypeScript'],
  },
],
```

- 同一账号仓库：覆盖 category、featured、描述与自定义 tags。
- 外部 owner：构建期额外请求该仓库，再合并进目录。
- API 返回 404 或不可用时，外部仓库不会生成虚构详情页。

首页 Project 橱窗数量由 `features.config.ts` 的 `home.showcase.projects` 控制，优先显示 `featured: true`。

## 4. 构建期缓存

缓存位于 `.cache/github/`，不提交到 Git：

- 内存 + 磁盘双层缓存。
- ETag 条件请求。
- 默认 TTL 六小时，可用 `GITHUB_CACHE_TTL_MS` 覆盖。
- 网络失败时可读取过期缓存；页面可能暂时显示旧数据。

GitHub Actions 会恢复该目录以减少 API 请求。

## 5. README 安全边界

项目详情通过 `marked` 渲染远程 README，并使用 `rehype-sanitize` 白名单净化。仍需注意：

- README 内容来自外部仓库，不等同于项目自身可信内容。
- 远程图片、链接和徽章可能连接第三方 origin。
- `npm audit` 不覆盖远程内容或 GitHub 服务策略。

## 6. 功能开关

```ts
// src/app/config/features.config.ts
integrations: {
  githubProjects: true,
}
```

关闭后 Projects/Home 不进行配置化 GitHub 目录取数，但路由与静态结构仍由源码决定。

## 7. 验证

```bash
npm run check
npm run build
npm run test:security
npm run test:e2e:dist
```

构建日志中的匿名限额、404 或 stale cache 提示应结合配置判断；不要通过提交 token 来消除提示。
