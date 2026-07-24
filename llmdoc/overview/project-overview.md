# Project Overview

## Identity

Astro Theme Reay 是一个静态优先的个人网站主题，把个人简介、技术博客、内容归档、GitHub 作品集、Plog 摄影记录、友情链接、留言、主题、双语界面、全文搜索和 Feed 组织在同一配置体系中。

## Product Model

站点所有者在仓库中维护配置、内容和静态资产，通过构建生成可直接托管的 HTML/CSS/JavaScript。访客无需账户即可浏览，互动能力由可选评论 provider 提供。

## Boundaries

属于本仓库：

- Astro 路由、布局、组件、主题、客户端交互和生成端点。
- Blog/Plog 内容 schema 与仓库跟踪的示例内容。
- Pagefind 索引构建、RSS、Sitemap、robots 和 GitHub Pages workflow。
- GitHub 与评论 provider 的适配代码。

不属于本仓库：

- CMS、数据库、后台管理、账户系统或服务端数据持久化。
- GitHub、评论 SaaS、自托管 Waline/Twikoo/Artalk 服务的可用性和数据政策。
- 用户提供的文章、照片、音频、远程 README 和第三方资产的权利保证。

## Major Areas

- 应用外壳：`src/app/layouts`、`src/shared/components`。
- 用户配置：`src/app/config`，由 `site.config.ts` 聚合。
- 内容：`src/content.config.ts`、`src/content`、blog/gallery 领域逻辑。
- 视觉：`src/design-system`、UnoCSS、领域样式。
- 浏览器运行时：`src/shared/client` 与 feature-local client modules。
- 外部集成：GitHub build-time API、可选评论 provider、可选 Microlink、KaTeX CDN。
- 发布：Astro static build、Pagefind、Sitemap、RSS、robots、GitHub Actions。

## Primary Visitor Flows

- 首页：Hero -> 最新文章 -> 项目 -> 关于 -> 站点信息/Footer。
- 内容发现：博客列表、时间线、标签、系列、Pagefind、RSS。
- 作品发现：GitHub 项目列表、贡献活动、README 详情。
- 生活内容：Plog 合集、图片详情与下载。
- 互动：文章评论和独立 Guestbook thread。

## Current Positioning

仓库是隐私安全的可派生主题，默认身份、GitHub、生产 URL 与个人叙事均为语义占位值，不代表维护者或任何真实用户。评论、音乐和季节效果默认关闭；Microlink 预览默认按交互懒加载并可关闭。派生使用者必须替换占位信息、关闭 `site.templateMode`、设置真实 `SITE`，并自行决定外部服务、内容许可和隐私边界。
