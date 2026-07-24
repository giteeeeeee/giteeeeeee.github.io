# Markdown 样式自定义完全指南

> 本文档详细介绍如何自定义博客的 Markdown 渲染样式，包括字体、颜色、间距、动画等所有视觉效果。

---

## 📚 目录

1. [快速开始](#快速开始)
2. [配置文件位置](#配置文件位置)
3. [基础配置](#基础配置)
4. [高级配置](#高级配置)
5. [预设样式](#预设样式)
6. [实战案例](#实战案例)
7. [常见问题](#常见问题)

---

## 快速开始

### 第一步：找到配置文件

打开项目中的配置文件：

```
src/app/config/markdown-style.config.ts
```

### 第二步：修改配置

找到文件末尾的 `currentMarkdownStyle`，这是当前使用的配置：

```typescript
// 当前使用的配置
export const currentMarkdownStyle = defaultMarkdownStyle;
```

### 第三步：重启开发服务器

```bash
# 停止服务器 (Ctrl+C 或 Cmd+C)
npm run dev
```

### 第四步：查看效果

访问 `http://localhost:4321/blog/test-markdown` 查看样式效果。

---

## 配置文件位置

```
src/
├── data/
│   ├── markdown-style.config.ts     ← 样式配置（主要修改这个）
│   └── markdown.config.ts           ← 插件配置（不常改）
└── utils/
    └── markdown-style-generator.ts  ← 样式生成器（无需修改）
```

---

## 基础配置

### 1. 修改字体大小

#### 方法一：直接修改（推荐）

```typescript
// src/app/config/markdown-style.config.ts

// 在文件末尾修改
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  typography: {
    ...defaultMarkdownStyle.typography,
    fontSize: '16px',     // 改这里！原来是 15px
    lineHeight: '1.8',    // 改这里！原来是 1.7
  },
};
```

#### 方法二：创建新配置

```typescript
// src/app/config/markdown-style.config.ts

// 创建自己的配置
export const myCustomStyle: MarkdownStyleConfig = {
  ...defaultMarkdownStyle,
  typography: {
    ...defaultMarkdownStyle.typography,
    fontSize: '18px',      // 大字体
    lineHeight: '2',       // 宽松行高
    letterSpacing: '0.02em', // 增加字间距
  },
};

// 使用自己的配置
export const currentMarkdownStyle = myCustomStyle;
```

### 2. 修改标题样式

```typescript
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  headings: {
    ...defaultMarkdownStyle.headings,
    h2: {
      ...defaultMarkdownStyle.headings.h2,
      fontSize: '2em',           // 改大
      color: 'var(--md-sys-color-primary)', // 改颜色
      showDecorator: false,      // 关闭装饰条
    },
    h3: {
      ...defaultMarkdownStyle.headings.h3,
      fontSize: '1.5em',
      color: 'var(--md-sys-color-secondary)',
    },
  },
};
```

### 3. 修改链接样式

```typescript
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  link: {
    ...defaultMarkdownStyle.link,
    color: 'var(--md-sys-color-secondary)',  // 链接颜色
    underlineStyle: 'solid',                 // 实线下划线（不要动画）
    underlineThickness: '3px',               // 加粗下划线
    externalIcon: true,                      // 显示外链图标
    externalIconSymbol: '↗',                 // 自定义外链图标
  },
};
```

### 4. 修改代码块样式

```typescript
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  code: {
    ...defaultMarkdownStyle.code,
    inline: {
      ...defaultMarkdownStyle.code.inline,
      fontSize: '0.9em',                    // 行内代码字号
      backgroundColor: '#f5f5f5',           // 浅灰背景
      color: '#e01e5a',                     // 红色文字
      padding: '0.2em 0.4em',
    },
    block: {
      ...defaultMarkdownStyle.code.block,
      fontSize: '0.9em',                    // 代码块字号
      padding: '1.5em',                     // 内边距
      borderRadius: '12px',                 // 圆角
      maxHeight: '800px',                   // 最大高度
      tabSize: 4,                           // Tab = 4 空格
    },
  },
};
```

### 5. 修改段落间距

```typescript
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  paragraph: {
    ...defaultMarkdownStyle.paragraph,
    marginTop: '0',
    marginBottom: '1.5em',    // 段落间距
    textIndent: '2em',        // 首行缩进 2 字符
    textAlign: 'left',        // 左对齐（或 'justify' 两端对齐）
  },
};
```

---

## 高级配置

### 1. 自定义引用块

```typescript
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  blockquote: {
    ...defaultMarkdownStyle.blockquote,
    fontSize: '0.95em',
    backgroundColor: '#f0f7ff',            // 浅蓝背景
    borderLeft: '4px solid #0066cc',      // 蓝色边框
    showQuoteMark: true,                   // 显示引号
    quoteMarkSize: '3em',                  // 引号大小
    quoteMarkColor: '#0066cc',             // 引号颜色
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // 阴影
  },
};
```

### 2. 自定义列表样式

```typescript
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  list: {
    ...defaultMarkdownStyle.list,
    ul: {
      ...defaultMarkdownStyle.list.ul,
      markerColor: 'var(--md-sys-color-tertiary)', // 标记颜色
      markerType: 'circle',                        // circle | disc | square
      paddingLeft: '2em',
    },
    ol: {
      ...defaultMarkdownStyle.list.ol,
      markerColor: 'var(--md-sys-color-primary)',
      markerFontWeight: '700',                     // 加粗数字
    },
    task: {
      ...defaultMarkdownStyle.list.task,
      checkboxSize: '1.3em',                       // 复选框大小
      checkedColor: 'var(--md-sys-color-tertiary)', // 选中颜色
    },
  },
};
```

### 3. 自定义表格样式

```typescript
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  table: {
    ...defaultMarkdownStyle.table,
    fontSize: '0.9em',
    borderRadius: '8px',
    striped: true,                           // 开启斑马纹
    stripedColor: '#f9f9f9',                 // 斑马纹颜色
    hoverColor: '#f0f0f0',                   // 悬停颜色
    th: {
      ...defaultMarkdownStyle.table.th,
      backgroundColor: '#e3f2fd',            // 表头背景
      color: '#1565c0',                      // 表头文字颜色
      fontWeight: '700',
    },
  },
};
```

### 4. 自定义图片效果

```typescript
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  image: {
    ...defaultMarkdownStyle.image,
    borderRadius: '12px',                    // 圆角
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)', // 阴影
    hoverTransform: 'scale(1.05)',           // 悬停放大 5%
    hoverShadow: '0 8px 24px rgba(0,0,0,0.2)', // 悬停阴影
    cursor: 'zoom-in',                       // 鼠标样式
  },
};
```

### 5. 自定义分隔线

```typescript
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  hr: {
    ...defaultMarkdownStyle.hr,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #333, transparent)',
    showDecorator: true,                     // 显示装饰
    decoratorSymbol: '✦',                    // 装饰符号 (◆ ✦ ❖ ※)
    decoratorColor: 'var(--md-sys-color-primary)',
    marginTop: '2.5em',
    marginBottom: '2.5em',
  },
};
```

---

## 预设样式

### 使用预设

系统提供了 4 种预设样式，可以直接使用：

```typescript
// src/app/config/markdown-style.config.ts
import { markdownStylePresets } from './markdown-style.config';

// 选择一个预设
export const currentMarkdownStyle = markdownStylePresets.default;   // 默认
// export const currentMarkdownStyle = markdownStylePresets.compact;   // 紧凑
// export const currentMarkdownStyle = markdownStylePresets.spacious;  // 宽松
// export const currentMarkdownStyle = markdownStylePresets.minimal;   // 极简
```

### 预设对比

| 预设 | 字号 | 行高 | 装饰 | 适用场景 |
|------|------|------|------|----------|
| **default** | 15px | 1.7 | ✅ 有 | 博客文章（推荐） |
| **compact** | 16px | 1.6 | ✅ 有 | 空间有限的页面 |
| **spacious** | 18px | 2.0 | ✅ 有 | 长文阅读 |
| **minimal** | 17px | 1.8 | ❌ 无 | 简约风格 |

### 基于预设修改

```typescript
// 使用紧凑预设，但修改字号
export const currentMarkdownStyle = {
  ...markdownStylePresets.compact,
  typography: {
    ...markdownStylePresets.compact.typography,
    fontSize: '17px',  // 改大一点
  },
};
```

---

## 实战案例

### 案例 1：老年人友好版（大字体）

```typescript
export const elderlyFriendlyStyle: MarkdownStyleConfig = {
  ...defaultMarkdownStyle,
  typography: {
    ...defaultMarkdownStyle.typography,
    fontSize: '20px',       // 大字体
    lineHeight: '2.2',      // 宽松行高
    letterSpacing: '0.03em', // 增加字间距
  },
  headings: {
    ...defaultMarkdownStyle.headings,
    h2: {
      ...defaultMarkdownStyle.headings.h2,
      fontSize: '2.2em',    // 更大的标题
    },
  },
  link: {
    ...defaultMarkdownStyle.link,
    underlineThickness: '3px',  // 更粗的下划线
  },
};

export const currentMarkdownStyle = elderlyFriendlyStyle;
```

### 案例 2：程序员风格（等宽字体）

```typescript
export const programmerStyle: MarkdownStyleConfig = {
  ...defaultMarkdownStyle,
  typography: {
    ...defaultMarkdownStyle.typography,
    fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    fontSize: '14px',
    letterSpacing: '0',
  },
  code: {
    ...defaultMarkdownStyle.code,
    block: {
      ...defaultMarkdownStyle.code.block,
      fontSize: '13px',
      tabSize: 4,           // 4 空格缩进
      showLineNumbers: false,
    },
  },
  headings: {
    ...defaultMarkdownStyle.headings,
    h2: {
      ...defaultMarkdownStyle.headings.h2,
      showDecorator: false,  // 极简风格
    },
  },
};

export const currentMarkdownStyle = programmerStyle;
```

### 案例 3：杂志风格（首行缩进 + 两端对齐）

```typescript
export const magazineStyle: MarkdownStyleConfig = {
  ...defaultMarkdownStyle,
  typography: {
    ...defaultMarkdownStyle.typography,
    fontSize: '17px',
    lineHeight: '1.9',
    fontFamily: 'Georgia, "Times New Roman", serif', // 衬线字体
  },
  paragraph: {
    ...defaultMarkdownStyle.paragraph,
    textIndent: '2em',      // 首行缩进
    textAlign: 'justify',   // 两端对齐
    marginBottom: '1.5em',
  },
  headings: {
    ...defaultMarkdownStyle.headings,
    h2: {
      ...defaultMarkdownStyle.headings.h2,
      textAlign: 'center',  // 标题居中
      showDecorator: false,
    },
  },
};

export const currentMarkdownStyle = magazineStyle;
```

### 案例 4：极简黑白风格

```typescript
export const minimalBWStyle: MarkdownStyleConfig = {
  ...markdownStylePresets.minimal,
  typography: {
    ...markdownStylePresets.minimal.typography,
    color: '#000000',       // 纯黑文字
  },
  link: {
    ...markdownStylePresets.minimal.link,
    color: '#000000',
    underlineStyle: 'solid',
    underlineThickness: '1px',
  },
  code: {
    ...markdownStylePresets.minimal.code,
    inline: {
      ...markdownStylePresets.minimal.code.inline,
      backgroundColor: '#f0f0f0',
      color: '#000000',
      border: '1px solid #d0d0d0',
    },
    block: {
      ...markdownStylePresets.minimal.code.block,
      backgroundColor: '#f5f5f5',
      border: '1px solid #e0e0e0',
    },
  },
  blockquote: {
    ...markdownStylePresets.minimal.blockquote,
    backgroundColor: '#fafafa',
    borderLeft: '3px solid #000000',
  },
};

export const currentMarkdownStyle = minimalBWStyle;
```

### 案例 5：夜间模式优化

```typescript
export const nightModeStyle: MarkdownStyleConfig = {
  ...defaultMarkdownStyle,
  typography: {
    ...defaultMarkdownStyle.typography,
    color: '#e0e0e0',       // 浅色文字
  },
  code: {
    ...defaultMarkdownStyle.code,
    block: {
      ...defaultMarkdownStyle.code.block,
      backgroundColor: '#1e1e1e',
      border: '1px solid #333',
    },
  },
  blockquote: {
    ...defaultMarkdownStyle.blockquote,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#b0b0b0',
  },
  table: {
    ...defaultMarkdownStyle.table,
    stripedColor: 'rgba(255, 255, 255, 0.03)',
    hoverColor: 'rgba(255, 255, 255, 0.05)',
  },
};

export const currentMarkdownStyle = nightModeStyle;
```

---

## 常见问题

### Q1: 修改配置后没有生效？

**A:** 需要重启开发服务器！

```bash
# 停止服务器 (Ctrl+C 或 Cmd+C)
npm run dev
```

### Q2: 怎么恢复默认样式？

**A:** 改回默认配置：

```typescript
export const currentMarkdownStyle = defaultMarkdownStyle;
```

### Q3: 可以同时使用多个配置吗？

**A:** 不可以，只能使用一个。但可以混合配置：

```typescript
export const currentMarkdownStyle = {
  ...markdownStylePresets.compact,      // 使用紧凑预设
  link: markdownStylePresets.minimal.link,  // 但链接用极简预设的
};
```

### Q4: Material Design 颜色变量有哪些？

**A:** 常用颜色变量：

```css
var(--md-sys-color-primary)           /* 主色 */
var(--md-sys-color-secondary)         /* 副色 */
var(--md-sys-color-tertiary)          /* 第三色 */
var(--md-sys-color-on-surface)        /* 文字色 */
var(--md-sys-color-on-surface-variant)/* 次要文字 */
var(--md-sys-color-surface-variant)   /* 背景色 */
var(--md-sys-color-outline)           /* 边框色 */
var(--md-sys-color-error)             /* 错误色 */
```

也可以使用固定颜色：

```typescript
color: '#1976d2',           // 蓝色
color: '#d32f2f',           // 红色
color: 'rgb(25, 118, 210)', // RGB
```

### Q5: 链接下划线样式有哪些？

**A:** 三种样式：

```typescript
underlineStyle: 'solid',     // 实线（简单）
underlineStyle: 'gradient',  // 渐变色
underlineStyle: 'animated',  // 动画（左→右展开）
```

### Q6: 怎么查看所有可配置项？

**A:** 查看文档：

```
docs/MARKDOWN-STYLE-FEATURES.md  ← 168 个配置项完整列表
```

### Q7: 配置太复杂，有简化方法吗？

**A:** 使用对象解构简化：

```typescript
// 复杂写法
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  typography: {
    ...defaultMarkdownStyle.typography,
    fontSize: '16px',
  },
  headings: {
    ...defaultMarkdownStyle.headings,
    h2: {
      ...defaultMarkdownStyle.headings.h2,
      fontSize: '2em',
    },
  },
};

// 简化写法（只改需要的）
const { typography, headings, ...rest } = defaultMarkdownStyle;

export const currentMarkdownStyle = {
  ...rest,
  typography: { ...typography, fontSize: '16px' },
  headings: {
    ...headings,
    h2: { ...headings.h2, fontSize: '2em' },
  },
};
```

### Q8: 怎么禁用所有装饰效果？

**A:** 使用 minimal 预设或手动关闭：

```typescript
export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  headings: {
    ...defaultMarkdownStyle.headings,
    h2: {
      ...defaultMarkdownStyle.headings.h2,
      showDecorator: false,      // 关闭 H2 装饰条
    },
  },
  blockquote: {
    ...defaultMarkdownStyle.blockquote,
    showQuoteMark: false,        // 关闭引号装饰
  },
  hr: {
    ...defaultMarkdownStyle.hr,
    showDecorator: false,        // 关闭分隔线装饰
  },
  link: {
    ...defaultMarkdownStyle.link,
    underlineStyle: 'solid',     // 使用实线（不要动画）
    externalIcon: false,         // 关闭外链图标
  },
};
```

### Q9: 如何查看样式效果？

**A:** 访问测试页面：

```
http://localhost:4321/blog/test-markdown
```

这个页面包含所有 Markdown 元素的示例。

### Q10: 配置文件太长，怎么组织？

**A:** 可以分文件管理：

```typescript
// src/app/config/styles/my-typography.ts
export const myTypography = {
  fontSize: '16px',
  lineHeight: '1.8',
  // ...
};

// src/app/config/styles/my-headings.ts
export const myHeadings = {
  h2: { fontSize: '2em', ... },
  h3: { fontSize: '1.5em', ... },
  // ...
};

// src/app/config/markdown-style.config.ts
import { myTypography } from './styles/my-typography';
import { myHeadings } from './styles/my-headings';

export const currentMarkdownStyle = {
  ...defaultMarkdownStyle,
  typography: myTypography,
  headings: myHeadings,
};
```

---

## 配置项速查表

### 快速修改清单

| 想要修改 | 配置路径 | 示例 |
|---------|---------|------|
| 字号 | `typography.fontSize` | `'16px'` |
| 行高 | `typography.lineHeight` | `'1.8'` |
| 字体 | `typography.fontFamily` | `'Georgia, serif'` |
| H2 字号 | `headings.h2.fontSize` | `'2em'` |
| H2 装饰 | `headings.h2.showDecorator` | `false` |
| 链接颜色 | `link.color` | `'#1976d2'` |
| 链接下划线 | `link.underlineStyle` | `'solid'` |
| 外链图标 | `link.externalIcon` | `true` |
| 代码字号 | `code.block.fontSize` | `'0.9em'` |
| Tab 大小 | `code.block.tabSize` | `4` |
| 段落间距 | `paragraph.marginBottom` | `'1.5em'` |
| 首行缩进 | `paragraph.textIndent` | `'2em'` |
| 引用背景 | `blockquote.backgroundColor` | `'#f0f0f0'` |
| 引号装饰 | `blockquote.showQuoteMark` | `false` |
| 列表标记 | `list.ul.markerColor` | `'#d32f2f'` |
| 表格斑马纹 | `table.striped` | `true` |
| 图片圆角 | `image.borderRadius` | `'12px'` |
| 分隔线装饰 | `hr.decoratorSymbol` | `'✦'` |

---

## 完整配置示例

以下是一个完整的自定义配置示例，包含所有主要配置项：

```typescript
// src/app/config/markdown-style.config.ts

export const myCompleteStyle: MarkdownStyleConfig = {
  // 基础排版
  typography: {
    fontSize: '16px',
    lineHeight: '1.8',
    letterSpacing: '0.01em',
    fontFamily: '-apple-system, sans-serif',
    color: 'var(--md-sys-color-on-surface)',
    maxWidth: '100%',
    textRendering: 'optimizeLegibility',
    fontSmoothing: 'antialiased',
    wordSpacing: 'normal',
  },

  // 标题
  headings: {
    h2: {
      fontSize: '1.8em',
      fontWeight: '700',
      color: 'var(--md-sys-color-primary)',
      marginTop: '2em',
      marginBottom: '1em',
      paddingBottom: '0.5em',
      borderBottom: '2px solid var(--md-sys-color-outline)',
      showDecorator: true,
      decoratorGradient: 'linear-gradient(90deg, #1976d2, #42a5f5)',
    },
    h3: { fontSize: '1.5em', fontWeight: '600', color: '#333', marginTop: '1.6em', marginBottom: '0.8em' },
    h4: { fontSize: '1.25em', fontWeight: '600', color: '#333', marginTop: '1.4em', marginBottom: '0.6em' },
    h5: { fontSize: '1.1em', fontWeight: '600', color: '#666', marginTop: '1.2em', marginBottom: '0.5em' },
    h6: { fontSize: '1em', fontWeight: '600', color: '#666', marginTop: '1em', marginBottom: '0.4em' },
  },

  // 段落
  paragraph: {
    marginTop: '0',
    marginBottom: '1.2em',
    textAlign: 'left',
    textIndent: '0',
    orphans: 3,
    widows: 3,
  },

  // 链接
  link: {
    color: 'var(--md-sys-color-primary)',
    hoverColor: 'var(--md-sys-color-secondary)',
    underline: true,
    underlineStyle: 'animated',
    underlineThickness: '2px',
    underlineOffset: '3px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    externalIcon: false,
    externalIconSymbol: '🔗',
  },

  // 代码
  code: {
    inline: {
      fontSize: '0.9em',
      fontFamily: '"Fira Code", monospace',
      backgroundColor: '#f5f5f5',
      color: '#e01e5a',
      padding: '0.2em 0.4em',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    block: {
      fontSize: '0.875em',
      fontFamily: '"Fira Code", monospace',
      backgroundColor: '#f5f5f5',
      padding: '1.5em',
      borderRadius: '8px',
      border: '1px solid #ddd',
      marginTop: '1.5em',
      marginBottom: '1.5em',
      maxHeight: '600px',
      overflow: 'auto',
      showLineNumbers: false,
      scrollbarWidth: '8px',
      scrollbarColor: '#888 #f0f0f0',
      lineHeight: '1.6',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      tabSize: 2,
    },
  },

  // 引用块
  blockquote: {
    fontSize: '0.95em',
    fontStyle: 'italic',
    fontWeight: 'normal',
    color: '#666',
    backgroundColor: '#f9f9f9',
    borderLeft: '4px solid #1976d2',
    padding: '1em 1.5em',
    marginTop: '1.5em',
    marginBottom: '1.5em',
    borderRadius: '0 8px 8px 0',
    showQuoteMark: true,
    quoteMarkSize: '3em',
    quoteMarkColor: '#1976d2',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },

  // 列表
  list: {
    ul: {
      marginTop: '1em',
      marginBottom: '1em',
      paddingLeft: '1.5em',
      markerColor: 'var(--md-sys-color-primary)',
      markerType: 'disc',
      nestedIndent: '1.5em',
    },
    ol: {
      marginTop: '1em',
      marginBottom: '1em',
      paddingLeft: '1.5em',
      markerColor: 'var(--md-sys-color-primary)',
      markerFontWeight: '600',
      nestedIndent: '1.5em',
    },
    li: {
      marginBottom: '0.5em',
      lineHeight: '1.6',
    },
    task: {
      checkboxSize: '1.2em',
      checkboxColor: '#999',
      checkedColor: 'var(--md-sys-color-primary)',
    },
  },

  // 表格
  table: {
    width: '100%',
    marginTop: '1.5em',
    marginBottom: '1.5em',
    fontSize: '0.9em',
    borderCollapse: 'separate',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    th: {
      backgroundColor: '#f5f5f5',
      color: '#333',
      fontWeight: '600',
      padding: '0.75em 1em',
      borderBottom: '2px solid #ddd',
      textAlign: 'left',
    },
    td: {
      padding: '0.75em 1em',
      borderBottom: '1px solid #eee',
    },
    striped: true,
    stripedColor: '#fafafa',
    hoverColor: '#f0f0f0',
  },

  // 图片
  image: {
    maxWidth: '100%',
    marginTop: '1.5em',
    marginBottom: '1.5em',
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    hoverTransform: 'scale(1.02)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'block',
  },

  // 分隔线
  hr: {
    marginTop: '2em',
    marginBottom: '2em',
    border: 'none',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #ddd, transparent)',
    showDecorator: true,
    decoratorSymbol: '◆',
    decoratorColor: '#999',
  },

  // 其他元素
  others: {
    mark: {
      backgroundColor: '#fff59d',
      color: '#000',
      padding: '0.1em 0.3em',
      borderRadius: '2px',
    },
    kbd: {
      backgroundColor: '#f5f5f5',
      color: '#333',
      padding: '0.2em 0.5em',
      borderRadius: '4px',
      border: '1px solid #ccc',
      boxShadow: '0 2px 0 #ccc',
      fontSize: '0.9em',
      fontFamily: 'monospace',
      fontWeight: '500',
    },
    abbr: {
      textDecoration: 'underline dotted',
      cursor: 'help',
      borderBottom: '1px dotted #999',
    },
    details: {
      marginTop: '1em',
      marginBottom: '1em',
      padding: '1em',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      border: '1px solid #ddd',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    strong: {
      fontWeight: '700',
      color: '#000',
    },
    em: {
      fontStyle: 'italic',
      color: '#666',
    },
    del: {
      textDecorationColor: '#d32f2f',
      opacity: '0.7',
    },
    sup: {
      fontSize: '0.75em',
      verticalAlign: 'super',
    },
    sub: {
      fontSize: '0.75em',
      verticalAlign: 'sub',
    },
  },
};

// 使用自定义配置
export const currentMarkdownStyle = myCompleteStyle;
```

---

## 总结

### 关键步骤

1. ✅ 打开 `src/app/config/markdown-style.config.ts`
2. ✅ 修改 `currentMarkdownStyle` 配置
3. ✅ 重启开发服务器 (`npm run dev`)
4. ✅ 访问 `/blog/test-markdown` 查看效果

### 推荐方式

- 🥇 **新手**：使用预设样式
- 🥈 **进阶**：基于默认配置修改
- 🥉 **高级**：创建完全自定义配置

### 相关文档

- `MARKDOWN-STYLE-FEATURES.md` - 168 个配置项完整列表
- `MARKDOWN-STYLE-QUICK.md` - 快速参考卡片
- `MARKDOWN-STYLE-UPDATE.md` - 更新历史

---

**最后更新**: 2025-10-17  
**作者**: Astro Theme Reay  
**版本**: 2.0

🎉 现在开始自定义你的 Markdown 样式吧！
