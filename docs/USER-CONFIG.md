# 用户配置

`src/app/config/user.config.ts` 是个人身份、公开联系方式、GitHub 账号、双语简介、About 内容和站点事实的唯一编辑源。应用通过 `src/app/config/site.config.ts` 读取规范化后的值。

## 模板模式

仓库默认保留语义占位值：

```ts
export const site = {
  templateMode: true,
  // ...
};
```

替换完 `YOUR_*`、`yourusername`、示例邮箱/域名和中文占位文案后，将 `templateMode` 改为 `false`。`npm run check:production` 会同时检查模板模式、常见占位值和生产 `SITE`，避免未初始化站点被发布。

## 身份与联系

```ts
export const user = {
  name: 'YOUR_NAME',
  avatar: '/images/profile/avatar.png',
  location: 'YOUR_LOCATION',

  contact: {
    email: 'your.email@example.com',
    twitter: 'https://x.com/yourusername',
    website: 'https://yourusername.github.io',
    additionalLinks: [
      {
        id: 'mastodon',
        label: 'Mastodon',
        url: 'https://social.example/@yourusername',
        displayValue: '@yourusername',
        icon: 'i-simple-icons:mastodon',
      },
    ],
  },

  github: {
    username: 'yourusername',
    token: '',
  },
};
```

- 空的可选字段会在所有消费页面隐藏。
- GitHub URL 由 `github.username` 自动生成，不要再放入 `additionalLinks`。
- `additionalLinks[].id` 应稳定且唯一；`icon` 使用 UnoCSS/Iconify 类名。
- `github.token` 在提交代码中保持空字符串。真实 token 只放 `.env` 或 CI Secret。

## 单一来源传播

| 值 | 全站消费者 |
| --- | --- |
| `user.name` / `avatar` | Header、Hero、About、Links 站点卡、Footer、RSS |
| `user.location` | Home / About 个人摘要 |
| `contact.email` / `twitter` / `website` | Hero、Home、About、Links、Guestbook、Footer |
| `github.username` | Hero、Home、Projects、About、Links、Footer、评论默认仓库 |
| `userContent.<lang>.description` | Home、About、Links、RSS 与 SEO |

不要在 `links.config.ts`、`projects.config.ts`、About 数据或页面组件中复制这些值。

## 双语简介

```ts
export const userContent = {
  en: {
    role: 'YOUR_ROLE',
    tagline: 'YOUR_TAGLINE',
    bio: 'YOUR_SHORT_BIO',
    status: 'YOUR_CURRENT_STATUS',
    focus: ['YOUR_FOCUS_1', 'YOUR_FOCUS_2'],
    story: {
      title: 'YOUR_STORY_TITLE',
      lead: 'YOUR_STORY_LEAD',
      body: ['YOUR_STORY_PARAGRAPH_1'],
      principles: ['YOUR_PRINCIPLE_1'],
    },
    greeting: 'YOUR_GREETING',
    description: 'YOUR_SITE_DESCRIPTION',
  },
  zh: {
    // 填写对应中文内容，字段结构必须一致
  },
};
```

`description` 同时是本语言的站点描述，不再维护第二份 SEO/site description。

## 站点事实

```ts
export const site = {
  templateMode: true,
  builtWith: 'site.tech.description',
  since: 'YYYY',
  techStack: [
    {
      name: 'Astro',
      description: 'about.tool.astro',
      url: 'https://astro.build/',
      icon: 'i-carbon:rocket',
    },
  ],
};
```

文章、标签、字数和写作年份由内容集合在构建期计算，不在 config 中手填。`builtWith` 和技术说明可以使用 `site.*` / `about.*` i18n key，也可以写普通自定义字符串。

## About 内容

`aboutConfig` 只保存 About 专属集合：

```ts
export const aboutConfig = {
  sections: [],
  education: [],
  experience: [],
  timeline: [],
};
```

联系方式和站点身份刻意不在其中。教育、经历和时间线为空时，对应区块自动隐藏。

## 应用读取入口

业务代码从 `@app/config/site.config` 导入：

```ts
const user = getUserProfile();
const contactLinks = getUserContactLinks();
const socialLinks = getUserSocialLinks();
const content = getLocalizedUserContent(currentLang);
const siteProfile = getSiteProfile(currentLang);
const github = getGitHubConfig();
```

- `getUserContactLinks()` 规范化 email、Twitter/X、website、GitHub 和 additional links，并按 URL 去重。
- `getUserSocialLinks()` 返回社交类入口。
- `getSiteProfile()` 从 user/contact/userContent 派生站点名、头像、URL 与描述。
- `getGitHubConfig()` 将唯一 GitHub 身份与项目过滤选项组合。

## 验证

```bash
npm run test:config
npm run check
npm run verify
```

生产前再使用真实 `SITE` 运行 `npm run check:production`。
