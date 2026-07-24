# 博客文章 Frontmatter 规范

## 📝 必需字段

所有博客文章必须包含以下字段：

```yaml
---
title: '文章标题'                # 必需，最多100字符
description: '文章描述'          # 必需，最多200字符
publishDate: 2025-10-17         # 必需，发布日期（YYYY-MM-DD）
---
```

---

## 🎨 完整示例

### 最小配置

```yaml
---
title: '我的第一篇文章'
description: '这是一篇测试文章'
publishDate: 2025-10-17
---
```

### 完整配置

```yaml
---
# === 基础信息 ===
title: '深入理解 Astro Content Collections'
description: 'Astro 7 Content Collections 完全指南，包含最佳实践和常见问题'

# === 时间信息 ===
publishDate: 2025-10-17          # 发布日期
updatedDate: 2025-10-18          # 更新日期（可选）

# === 分类与标签 ===
category: '技术'                  # 可选值：技术/生活/思考/教程/其他
tags: ['Astro', 'TypeScript']    # 标签数组

# === 系列 ===
series: 'Astro 系列教程'         # 系列名称（可选）
seriesOrder: 1                    # 系列中的顺序（可选）

# === 封面图片 ===
cover: '/images/astro-cover.jpg' # 封面图路径
coverAlt: 'Astro 徽标'           # 封面图描述

# === 作者信息 ===
author: '张三'                    # 作者名称

# === 内容控制 ===
draft: false                      # 是否为草稿
featured: true                    # 是否精选

# === 显示控制 ===
toc: true                         # 是否显示目录
comment: true                     # 是否允许评论

# === 其他 ===
language: 'zh-CN'                 # 语言（zh-CN 或 en-US）
---
```

---

## 📋 字段说明

### 必需字段

| 字段 | 类型 | 说明 | 限制 |
|------|------|------|------|
| `title` | string | 文章标题 | 最多100字符 |
| `description` | string | 文章描述（SEO） | 最多200字符 |
| `publishDate` | date | 发布日期 | YYYY-MM-DD 格式 |

### 可选字段

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `updatedDate` | date | - | 更新日期 |
| `category` | enum | '其他' | 分类（见下） |
| `tags` | string[] | [] | 标签数组 |
| `series` | string | - | 系列名称 |
| `seriesOrder` | number | - | 系列中的顺序 |
| `cover` | string | - | 封面图路径 |
| `coverAlt` | string | - | 封面图描述 |
| `author` | string | - | 作者名称 |
| `draft` | boolean | false | 草稿状态 |
| `featured` | boolean | false | 是否精选 |
| `toc` | boolean | true | 显示目录 |
| `comment` | boolean | true | 允许评论 |
| `language` | enum | 'zh-CN' | 语言 |

---

## 🏷️ 分类枚举

`category` 字段只能使用以下值：

- `技术` - 技术文章、教程、代码分享
- `生活` - 生活感悟、日常记录
- `思考` - 观点、思考、评论
- `教程` - 步骤详细的教学文章
- `其他` - 其他类型

**示例**:
```yaml
category: '技术'  # ✅ 正确
category: '科技'  # ❌ 错误，不在枚举中
```

---

## 🔖 标签规则

- 标签会**自动转为小写**
- **自动去重**
- 支持中英文
- 建议 2-5 个标签

**示例**:
```yaml
tags: ['Astro', 'TypeScript', 'Web']  # ✅ 正确
tags: ['astro', 'ASTRO', 'Astro']     # → 自动去重为 ['astro']
```

---

## 📅 日期格式

### 支持的格式

```yaml
publishDate: 2025-10-17           # ✅ 推荐：ISO 格式
publishDate: '2025-10-17'         # ✅ 带引号也可以
publishDate: 2025-10-17T08:00:00  # ✅ 带时间
```

### 错误示例

```yaml
publishDate: '10/17/2025'         # ❌ 美式格式不支持
publishDate: '17-10-2025'         # ❌ 日期顺序错误
date: 2025-10-17                  # ❌ 字段名错误（应为 publishDate）
```

---

## 📂 文件结构

### 推荐结构（文件夹）

```
src/content/blog/
└── my-post/
    ├── index.md          ← 文章内容
    └── images/           ← 文章图片（可选）
        └── cover.jpg
```

**Frontmatter**:
```yaml
---
title: '我的文章'
description: '文章描述'
publishDate: 2025-10-17
cover: './images/cover.jpg'  # 相对路径
---
```

### 简单结构（单文件）

```
src/content/blog/
└── my-post.md
```

---

## ⚠️ 常见错误

### 1. 日期字段名错误

```yaml
# ❌ 错误
date: 2025-10-17

# ✅ 正确
publishDate: 2025-10-17
```

### 2. 分类不在枚举中

```yaml
# ❌ 错误
category: '科技'

# ✅ 正确
category: '技术'
```

### 3. 标题或描述过长

```yaml
# ❌ 错误（超过100字符）
title: '这是一个非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的标题'

# ✅ 正确
title: '简洁的标题'
```

### 4. 布尔值使用字符串

```yaml
# ❌ 错误
draft: 'true'

# ✅ 正确
draft: true
```

---

## 🚨 验证错误处理

### 错误信息示例

```
[ERROR] blog → my-post/index.md data does not match collection schema.
  publishDate: Invalid date
```

### 解决步骤

1. **检查字段名**: `date` → `publishDate`
2. **检查日期格式**: `2025-10-17`（ISO 格式）
3. **检查分类**: 必须是枚举值之一
4. **检查必需字段**: title, description, publishDate

---

## 📚 快速参考

### 最小可用模板

```yaml
---
title: ''
description: ''
publishDate: 2025-10-17
---
```

### 推荐模板

```yaml
---
title: ''
description: ''
publishDate: 2025-10-17
category: '技术'
tags: []
---
```

### 完整模板

```yaml
---
title: ''
description: ''
publishDate: 2025-10-17
updatedDate: 2025-10-17
category: '技术'
tags: []
cover: ''
coverAlt: ''
author: ''
draft: false
featured: false
toc: true
comment: true
language: 'zh-CN'
---
```

---

## 🔍 Schema 定义位置

查看完整的 schema 定义：

```
src/content.config.ts
```

---

**更新**: 2025-10-17
