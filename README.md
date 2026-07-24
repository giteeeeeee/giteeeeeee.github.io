# Astro Theme Reay

<p align="center">
  <strong>内容优先、配置驱动的 Astro 个人博客与作品集主题</strong>
</p>

<p align="center">
  <a href="https://astro.build/"><img alt="Astro 7" src="https://img.shields.io/badge/Astro-7-ff5d01?style=flat-square&logo=astro&logoColor=white"></a>
  <a href="https://nodejs.org/"><img alt="Node.js 22" src="https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=nodedotjs&logoColor=white"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-ready-3178c6?style=flat-square&logo=typescript&logoColor=white"></a>
  <img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-0f766e?style=flat-square">
</p>

<p align="center">
  <a href="./docs/THEME-GALLERY.md"><img src="./docs/assets/screenshots/technology.webp" alt="Astro Theme Reay 科技流光主题首页" width="100%"></a>
</p>

<p align="center">
  <sub>真实 Chrome 首页截图 · 点击查看完整主题画廊</sub>
</p>

Astro Theme Reay 面向个人博客、摄影记录、开源项目与长期知识归档。站点以静态 HTML 为核心，个人身份、主题、导航和可选集成集中配置，Blog 与 Plog 使用 Markdown/MDX 维护；不依赖 CMS、数据库或账户系统。

仓库默认只包含语义占位值。`YOUR_NAME`、`yourusername`、`your.email@example.com` 等内容用于标明字段用途，生产检查会阻止它们被直接发布。

## 主题预览

<table>
  <tr>
    <td width="50%" align="center">
      <a href="./docs/THEME-GALLERY.md#基础阅读"><img src="./docs/assets/screenshots/technology.webp" alt="Technology 科技流光主题" width="100%"></a><br>
      <sub><strong>Technology</strong> · 科技流光</sub>
    </td>
    <td width="50%" align="center">
      <a href="./docs/THEME-GALLERY.md#基础阅读"><img src="./docs/assets/screenshots/paper.webp" alt="Paper 米纸手记主题" width="100%"></a><br>
      <sub><strong>Paper</strong> · 米纸手记</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <a href="./docs/THEME-GALLERY.md#东方表达"><img src="./docs/assets/screenshots/monochrome-ink.webp" alt="Monochrome Ink 墨白丹朱主题" width="100%"></a><br>
      <sub><strong>Monochrome Ink</strong> · 墨白丹朱</sub>
    </td>
    <td width="50%" align="center">
      <a href="./docs/THEME-GALLERY.md#场景主题"><img src="./docs/assets/screenshots/anime-night.webp" alt="Anime Night 动画夜城主题" width="100%"></a><br>
      <sub><strong>Anime Night</strong> · 动画夜城</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <a href="./docs/THEME-GALLERY.md#场景主题"><img src="./docs/assets/screenshots/cosmic-abyss.webp" alt="Cosmic Abyss 星渊银河主题" width="100%"></a><br>
      <sub><strong>Cosmic Abyss</strong> · 星渊银河</sub>
    </td>
    <td width="50%" align="center">
      <a href="./docs/THEME-GALLERY.md#场景主题"><img src="./docs/assets/screenshots/retro-terminal.webp" alt="Retro Terminal 复古终端主题" width="100%"></a><br>
      <sub><strong>Retro Terminal</strong> · 复古终端</sub>
    </td>
  </tr>
</table>

<p align="center"><a href="./docs/THEME-GALLERY.md"><strong>浏览全部 13 套主题 →</strong></a></p>

## 主要能力

| 领域 | 能力 |
| --- | --- |
| 内容 | Astro Content Collections、Markdown/MDX、草稿、标签、系列、归档、阅读时间 |
| 首页 | 沉浸式 Hero、个人摘要、Blog/Project/Plog 内容橱窗、GitHub 活动热度表 |
| 发现 | Blog、Plog、标签云、系列目录、统一归档、Pagefind 全文搜索、RSS、Sitemap |
| 视觉 | Material Design 3 动态色板、13 套主题预设、浅色/深色模式、角色化字体与背景系统 |
| 项目 | GitHub 仓库目录、构建期缓存、安全净化的 README 详情页与无凭据降级 |
| 媒体 | Plog 合集、响应式图片、灯箱、原图下载与可选全站音乐播放器 |
| 互动 | Giscus、Utterances、Waline、Twikoo、Artalk、Disqus 的按需加载适配器 |
| 质量 | ESLint、Astro Check、产物/性能/安全合同、Playwright 与 Axe 自动检查 |

## 快速开始

环境要求：Node.js `>=22.12.0`、npm `>=9.6.5`。

```bash
git clone https://github.com/yourusername/Astro-Theme-Reay.git
cd Astro-Theme-Reay
npm ci
npm run dev
```

开发服务默认位于 `http://localhost:4321`。完整搜索索引只在生产构建后生成。

### 首次配置

1. 编辑 `src/app/config/user.config.ts`，替换身份、联系方式、双语简介与 About 内容；全部完成后将 `site.templateMode` 改为 `false`。
2. 编辑 `src/app/config/theme.config.ts`，选择预设，并按需覆盖主色、字体、背景、圆角或动效。
3. 按需编辑 `features.config.ts`、`navigation.config.ts`、`projects.config.ts`、`links.config.ts`、`comments.config.ts` 与 `media.config.ts`。
4. 替换 `public/images/profile/avatar.png`、favicon 和其他示例资产。
5. 用自己的生产 origin 设置 `SITE`，保持 `BASE=/`。

个人资料只在 `user.config.ts` 设置一次。Home、About、Links、Guestbook、Footer、Projects 与 RSS 都从 `site.config.ts` 的统一 getter 派生，避免维护多份邮箱、用户名或站点地址。

## 主题系统

`theme.config.ts` 只有一个用户编辑对象：

```ts
export const themeConfig = defineTheme({
  preset: 'technology',
  // primary: '#5B8CFF',
  // typography: { baseSize: 16 },
  // background: { type: 'gradient', decoration: 'aurora' },
});
```

内置预设：

- 基础阅读：`technology`、`paper`、`eink`、`forest`、`editorial`
- 东方表达：`inkwash`、`monochrome-ink`、`ukiyo`
- 场景主题：`anime-spring`、`anime-night`、`cosmic-abyss`、`ocean`、`retro-terminal`

只设置 `primary` 时，MD3 会从新主色生成完整 light/dark 配色；使用 `source` 可进一步指定辅助关键色。字体、shape、背景和 effects 在预设之上深度合并。详见 [完整主题画廊](./docs/THEME-GALLERY.md)、[主题配置](./docs/THEME-CONFIG.md) 与 [预设目录](./presets/themes/README.md)。

## 内容结构

```text
src/content/
├── blog/<slug>/index.md
└── plog/<collection>/<slug>/
    ├── index.md
    └── images/
```

Blog 示例：

```yaml
---
title: 'YOUR_POST_TITLE'
description: 'YOUR_POST_DESCRIPTION'
publishDate: 2026-07-24
tags: ['Astro', 'TypeScript']
series: 'YOUR_SERIES_NAME'
draft: false
---
```

Plog 使用同级 `images/` 自动聚合图片，并可在 frontmatter 中补充合集、地点、相机与逐图说明。字段详情见 [Blog Frontmatter](./docs/BLOG-FRONTMATTER.md) 与 [Gallery / Music](./docs/MEDIA.md)。

## 项目架构

```text
src/
├── app/                 # 用户配置门面与页面布局
├── content/             # Blog/Plog 源内容
├── design-system/       # MD3 token、主题生成与视觉基础
├── features/            # 按业务域组织的组件、lib、client、styles
├── pages/               # 薄路由与生成端点
├── shared/              # 真正跨域的 UI 与客户端基础设施
└── types/               # 第三方类型补充
```

关键约束：

- `src/pages` 只处理路由参数、静态路径、领域查询与页面组合。
- 领域代码进入 `src/features/<domain>`；只有跨多个领域复用的能力进入 `src/shared`。
- 用户可编辑值进入 `src/app/config`，应用优先通过 `site.config.ts` getter 读取。
- 主题 token 与跨域视觉基础由 `src/design-system` 负责。
- 页面级浏览器行为必须支持 Astro 页面交换时的初始化与清理。

详见 [项目结构](./docs/PROJECT-STRUCTURE.md)。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run lint` | 检查 TypeScript、Astro、Node 与浏览器模块 |
| `npm run check` | 执行 Astro、TypeScript 与内容诊断 |
| `npm run build` | 构建静态站点并生成 Pagefind 索引 |
| `npm run preview` | 预览已有的 `dist/` |
| `npm run check:production` | 校验 `SITE`、根路径部署和模板占位值 |
| `npm run test:config` | 校验配置单一来源与主题合同 |
| `npm run test:routes` | 校验关键产物与路由 |
| `npm run test:performance` | 校验静态性能预算 |
| `npm run test:security` | 校验发布可见性与 README 净化 |
| `npm run test:e2e` | 构建并执行 Playwright/Axe 核心流程 |
| `npm run verify` | 执行 lint、检查、构建及全部自动化门禁 |
| `npm run audit` | 检查 high 级别 npm advisory |

## 环境变量与部署

复制 `.env.example` 为 `.env`，然后填入自己的值：

```env
SITE=https://your-domain.example
BASE=/
GITHUB_TOKEN=
```

- `SITE` 必须是无路径、query 或 hash 的 HTTPS origin。示例域名必须替换。
- 当前只支持根路径部署；`BASE` 必须是 `/`，不支持 GitHub Pages 项目子路径。
- `GITHUB_TOKEN` 仅用于提高构建期 GitHub API 限额，必须保存在本地环境或 CI Secret 中。

发布前运行：

```bash
SITE=https://your-production-origin.invalid npm run check:production
SITE=https://your-production-origin.invalid npm run verify
npm run audit
```

上面的 origin 是占位格式，执行前必须替换为真实域名。GitHub Pages 工作流从 Actions variable `SITE` 读取生产地址。完整步骤见 [部署指南](./docs/DEPLOYMENT.md)。

## 文档

- [文档导航](./docs/README.md)
- [快速开始](./docs/QUICK-START.md)
- [安装与环境](./docs/INSTALLATION.md)
- [用户配置](./docs/USER-CONFIG.md)
- [主题画廊](./docs/THEME-GALLERY.md)
- [主题配置](./docs/THEME-CONFIG.md)
- [内容系统](./docs/BLOG-SYSTEM.md)
- [项目展示](./docs/PROJECTS.md)
- [部署](./docs/DEPLOYMENT.md)
- [贡献指南](./CONTRIBUTING.md)

## 安全与隐私

- 不要把 token、Cookie、私有 endpoint 或未脱敏个人资料提交到仓库。
- 评论配置会进入浏览器产物，只能填写可公开的 provider 参数。
- GitHub README、评论服务、Microlink、CDN 与远程图片属于外部信任边界；启用前应核对隐私、CSP、许可与可用性。
- `npm audit` 只覆盖 npm advisory，不等价于完整供应链或第三方服务审计。

## 贡献与许可

提交变更前请运行 `npm run verify && npm run audit`，并使用 Conventional Commits。具体约定见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

本项目依据 [Apache License 2.0](./LICENSE) 开源。
