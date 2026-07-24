# 快速开始

## 1. 获取项目

```bash
git clone https://github.com/yourusername/Astro-Theme-Reay.git
cd Astro-Theme-Reay
npm ci
npm run dev
```

浏览器打开 `http://localhost:4321`。

## 2. 替换模板信息

编辑 `src/app/config/user.config.ts`：

```ts
export const user = {
  name: 'YOUR_NAME',
  avatar: '/images/profile/avatar.png',
  location: 'YOUR_LOCATION',
  contact: {
    email: 'your.email@example.com',
    twitter: 'https://x.com/yourusername',
    website: 'https://yourusername.github.io',
    additionalLinks: [],
  },
  github: {
    username: 'yourusername',
    token: '',
  },
};
```

继续替换同文件的 `userContent`、`site` 和 `aboutConfig`。完成后把 `site.templateMode` 改为 `false`。邮箱、网站和 GitHub 只需在此处设置一次，其他页面会自动读取。

## 3. 选择主题

编辑 `src/app/config/theme.config.ts`：

```ts
export const themeConfig = defineTheme({
  preset: 'paper',
  primary: '#52634F',
});
```

可用预设及覆盖规则见 [主题配置](./THEME-CONFIG.md)。

## 4. 添加内容

Blog：

```text
src/content/blog/your-post/index.md
```

```yaml
---
title: 'YOUR_POST_TITLE'
description: 'YOUR_POST_DESCRIPTION'
publishDate: 2026-07-24
tags: ['Astro']
draft: false
---
```

Plog：

```text
src/content/plog/your-collection/your-album/
├── index.md
└── images/
```

详见 [Blog 系统](./BLOG-SYSTEM.md) 与 [Plog / 音乐](./MEDIA.md)。

## 5. 发布前验证

```bash
npm run verify
npm run audit
```

随后用真实 origin 替换命令中的占位值：

```bash
SITE=https://your-production-origin.invalid npm run check:production
```

`check:production` 会拒绝模板身份、示例域名、非 HTTPS 地址和非根路径部署。部署步骤见 [部署指南](./DEPLOYMENT.md)。
