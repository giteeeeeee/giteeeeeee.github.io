# Astro Theme Reay

<p align="center">
  <strong>一个内容优先、配置驱动的 Astro 个人站点模版</strong>
</p>

<p align="center">
  <a href="https://astro.build/"><img alt="Astro" src="https://img.shields.io/badge/Astro-5.x-ff5d01?style=flat-square&logo=astro&logoColor=white"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-ready-3178c6?style=flat-square&logo=typescript&logoColor=white"></a>
  <a href="https://unocss.dev/"><img alt="UnoCSS" src="https://img.shields.io/badge/UnoCSS-enabled-333333?style=flat-square"></a>
  <img alt="License" src="https://img.shields.io/badge/license-MIT-0f766e?style=flat-square">
</p>

Astro Theme Reay 是一个面向个人博客、作品集和摄影记录的静态站点模版。它把博客、相册、项目展示、友情链接、留言评论、音乐小组件和动态视觉效果组织在同一套配置系统下，适合用 GitHub Pages、Vercel 或 Netlify 部署。

## Highlights

| 能力 | 说明 |
| --- | --- |
| MD3 颜色系统 | 根据主色生成 Material Design 3 色板，支持浅色和深色主题 |
| 博客系统 | 基于 Astro Content Collections，支持标签、系列、归档和阅读时间 |
| Plog 相册 | 每个 `src/content/plog` 条目是一组照片合集，支持封面、图片信息和原图下载 |
| 项目展示 | 自动读取 GitHub 仓库信息，并统一渲染项目 README |
| 留言与评论 | 支持文章评论和留言板，可接入 utterances、giscus、Waline、Twikoo、Artalk、Disqus |
| 音乐小组件 | 全站 Header 音乐入口，支持播放、暂停、切歌和播放列表 |
| 动态效果 | 首页波浪和四季飘落效果，可在配置文件中开关和调节密度 |
| 双语界面 | 内置中英文 UI 文案，内容和界面翻译集中管理 |

## Preview

```bash
git clone https://github.com/WOOREAY/Astro-Theme-Reay.git
cd Astro-Theme-Reay
npm install
npm run dev
```

开发服务默认运行在 `http://localhost:4321`。

## Project Structure

```text
.
├── public/                 # 静态资源：头像、背景、音频、favicon
├── src/
│   ├── components/         # 页面组件和功能组件
│   ├── content/
│   │   ├── blog/           # 博客文章
│   │   └── plog/           # 相册合集
│   ├── data/               # 站点配置入口
│   ├── layouts/            # 页面布局
│   ├── pages/              # 路由页面
│   ├── styles/             # 全局样式
│   └── utils/              # 工具函数
├── docs/                   # 使用文档
└── package.json
```

## Configuration

大部分自定义内容都集中在 `src/data/`。推荐从下面几个文件开始：

| 文件 | 用途 |
| --- | --- |
| `src/data/user.config.ts` | 个人资料、社交链接、关于页面内容 |
| `src/data/theme.config.ts` | 主色、字体、背景、波浪和四季飘落效果 |
| `src/data/media.config.ts` | 音乐播放列表和曲目信息 |
| `src/data/comments.config.ts` | 文章评论和留言板接入配置 |
| `src/data/projects.config.ts` | GitHub 项目展示配置 |
| `src/data/links.config.ts` | 友情链接、站点链接和社交链接 |
| `src/data/i18n.config.ts` | UI 翻译和默认语言 |
| `src/data/markdown-style.config.ts` | Markdown 内容的统一视觉样式 |

## Content Workflow

### Blog

在 `src/content/blog/` 下创建 Markdown 或 MDX 文件：

```text
src/content/blog/my-post/index.md
```

常用 frontmatter 示例：

```yaml
---
title: "文章标题"
description: "文章摘要"
publishDate: 2026-05-22
tags: ["Astro", "TypeScript"]
series: "站点构建"
---
```

### Plog Gallery

每个 `src/content/plog` 条目对应一个相册合集，图片放在同级 `images/` 目录：

```text
src/content/plog/travel-demo/
├── index.md
└── images/
    ├── cover.jpg
    └── photo-01.jpg
```

相册元信息写在 `index.md` 的 frontmatter 中，页面会自动生成合集卡片、图片列表、图片详情和下载入口。

### Music

音频文件建议放在 `public/audio/`，然后在 `src/data/media.config.ts` 中添加曲目信息。音乐播放器会作为 Header 右上角的小组件出现在所有页面。

## Scripts

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动本地开发服务 |
| `npm run check` | 运行 Astro 类型和内容检查 |
| `npm run build` | 构建生产站点到 `dist/` |
| `npm run preview` | 本地预览生产构建 |

## Deployment

### GitHub Pages

仓库内置 `.github/workflows/deploy.yml`。

1. 在 GitHub 仓库中打开 `Settings -> Pages`。
2. 将 `Source` 设置为 `GitHub Actions`。
3. 按需配置 `SITE` 和 `BASE`。
4. 推送到主分支触发部署。

常见配置：

```env
# 用户或组织主页
SITE=https://yourname.github.io
BASE=/

# 项目页
SITE=https://yourname.github.io
BASE=/repository-name
```

### Vercel / Netlify

| 项 | 值 |
| --- | --- |
| Build Command | `npm run build` |
| Output Directory | `dist` |

## Documentation

| 文档 | 内容 |
| --- | --- |
| [Quick Start](./docs/QUICK-START.md) | 快速开始 |
| [Installation](./docs/INSTALLATION.md) | 安装和初始化 |
| [User Config](./docs/USER-CONFIG.md) | 用户信息配置 |
| [Theme Config](./docs/THEME-CONFIG.md) | 主题、背景和动效配置 |
| [Blog System](./docs/BLOG-SYSTEM.md) | 博客系统 |
| [Media](./docs/MEDIA.md) | 相册和音乐 |
| [Projects](./docs/PROJECTS.md) | GitHub 项目展示 |
| [Links](./docs/LINKS.md) | 友情链接 |
| [Deployment](./docs/DEPLOYMENT.md) | 部署指南 |
| [FAQ](./docs/FAQ.md) | 常见问题 |

## Notes

- 请把 `yourusername`、`Your Name`、示例邮箱和示例链接替换为自己的信息。
- GitHub token、评论服务密钥等敏感信息应放在 `.env` 或 GitHub Secrets 中，不要提交到仓库。
- 如果从模版派生个人站点，建议先完成 `src/data/*.config.ts`，再迁移博客和相册内容。

## License

MIT
