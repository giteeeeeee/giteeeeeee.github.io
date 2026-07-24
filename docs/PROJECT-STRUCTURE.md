# 项目结构

项目采用 feature-first 组织，同时保留 Astro 路由、应用配置、设计系统和真正共享能力的清晰边界。它不是严格单向分层架构；跨 feature 组合可以存在，但必须显式、可追踪且不得形成循环依赖。

## 顶层目录

```text
Astro-Theme-Reay/
├── .github/workflows/       # CI 与 GitHub Pages
├── docs/                    # 面向主题使用者的公开文档
├── llmdoc/                  # 维护者与编码代理的架构知识
├── presets/themes/          # 可直接选择的视觉预设
├── public/                  # 原样复制的静态资产
├── scripts/                 # 构建与质量门禁
├── src/                     # 应用源码与内容
├── tests/e2e/               # Playwright / Axe 核心流程
├── astro.config.mjs
├── eslint.config.mjs
├── tsconfig.json
├── uno.config.ts
└── package.json
```

生成目录 `dist/`、`.astro/`、`.cache/`、`test-results/` 和本地 `.env` 均被 Git 忽略。

## `src/` 所有权

```text
src/
├── app/
│   ├── config/              # 用户编辑源、类型与统一读取门面
│   └── layouts/             # 文档外壳和领域布局
├── content/
│   ├── blog/                # Blog Markdown/MDX
│   └── plog/                # Plog Markdown/MDX 与图片
├── design-system/
│   ├── styles/              # 稳定的跨功能视觉语义
│   └── theme/               # MD3 颜色、token、CSS 变量
├── features/<domain>/
│   ├── components/          # 领域 Astro 组件
│   ├── lib/                 # 构建期/同构领域逻辑
│   ├── client/              # 浏览器行为与 disposer
│   └── styles/              # 领域样式（按需）
├── pages/                   # 薄路由与生成端点
├── shared/
│   ├── components/          # 跨领域 UI 与布局原语
│   └── client/              # 全局客户端运行时
└── types/                   # 第三方声明补充
```

## 边界规则

### pages

- 读取路由参数和 `Astro.props`。
- 调用领域查询与 URL helper。
- 组合 layout、feature 与 shared 组件。
- 不承载可复用业务逻辑或大型客户端脚本。

### app

- `config/` 是用户可编辑值的唯一来源；应用优先通过 `site.config.ts` getter 读取。
- `layouts/base/DocumentShell.astro` 是全文档根，负责 Head、主题、i18n、ClientRouter、Header 与全局运行时。
- 领域 layout 只处理页面框架，不复制数据访问层。

### features

- 一个业务能力的组件、数据转换、浏览器交互和样式放在同一领域。
- 当前领域包括 about、archives、blog、comments、effects、gallery、home、i18n、links、media、projects、search。
- 跨 feature 引用只用于显式组合，不能把内部实现当作通用 API。

### shared

- 只有至少两个领域实际复用的 UI 或基础设施才能进入 shared。
- 全局 listener、timer、observer 和 animation frame 必须有幂等初始化与清理路径。
- 页面级行为在 `astro:page-load` 重建，在交换前释放。

### design-system

- 保存 MD3 token、主题生成、CSS 变量和稳定的全站视觉语义。
- 单页或单 feature 的布局样式不得为了“复用可能性”提前上移。

## 配置流

```text
user.config.ts / theme.config.ts / other *.config.ts
  → site.config.ts getters
  → layouts / features / shared / generated endpoints
```

姓名、头像、邮箱、网站、GitHub 与站点描述不能在页面或其他配置中复制。主题预设只拥有视觉参数，不携带个人内容、凭据或导航数据。

## 内容与路由

`src/content.config.ts` 使用显式 glob loader：

- `src/content/blog/**/*.{md,mdx}` → `blog`
- `src/content/plog/**/*.{md,mdx}` → `plog`

slug 从 Astro entry ID 派生。生成链接时使用领域 URL helper，动态路由的 `getStaticPaths()` 保持未编码参数交给 Astro 处理。

主要路由：

| 路由 | 领域 |
| --- | --- |
| `/` | home |
| `/blog/*` | blog |
| `/archives/*` | archives + blog + gallery |
| `/gallery/*` | gallery |
| `/projects/*` | projects |
| `/links` | links |
| `/guestbook` | comments |
| `/search` | search |
| `/rss.xml`、`/robots.txt` | generated endpoints |

## 路径别名

| 别名 | 目标 |
| --- | --- |
| `@app/*` | `src/app/*` |
| `@design/*` | `src/design-system/*` |
| `@features/*` | `src/features/*` |
| `@shared/*` | `src/shared/*` |
| `@/*` | `src/*`，仅用于兼容；新增代码使用语义别名 |

## 新增功能检查表

1. 明确领域 owner，并在 `features/<domain>` 内聚实现。
2. 用户可调值进入 `app/config`，通过 `site.config.ts` 暴露。
3. 保持 route 薄，设计客户端清理路径。
4. 只把已证明跨域的能力提升到 shared/design-system。
5. 同步中英文 key、公开文档和必要的 llmdoc。
6. 执行 `npm run verify && npm run audit`。
