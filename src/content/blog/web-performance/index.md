---
title: 'Web 性能优化：从原理到实践'
description: '全面解析 Web 性能优化的各个方面，包括资源加载、渲染优化、JavaScript 执行优化等。结合实际案例，教你如何将页面加载时间从 3 秒优化到 1 秒以内。'
publishDate: 2023-11-10
category: '技术'
tags: ['性能优化', 'Web开发', '前端工程', 'Core Web Vitals']
featured: true
---

性能优化是提升用户体验的关键。本文将系统地介绍 Web 性能优化的方方面面。

## 性能指标

首先了解核心指标：

### Core Web Vitals

- **LCP (Largest Contentful Paint)** - 最大内容绘制
- **FID (First Input Delay)** - 首次输入延迟
- **CLS (Cumulative Layout Shift)** - 累积布局偏移

### 其他重要指标

- TTFB (Time to First Byte)
- FCP (First Contentful Paint)
- TTI (Time to Interactive)

## 资源加载优化

### 1. 图片优化

```html
<!-- 使用现代图片格式 -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="描述" loading="lazy">
</picture>
```

### 2. 代码分割

```javascript
// 动态导入
const module = await import('./heavy-module.js');
```

### 3. 预加载关键资源

```html
<link rel="preload" href="critical.css" as="style">
<link rel="preconnect" href="https://api.example.com">
```

## 渲染优化

### CSS 优化

- 避免复杂选择器
- 减少重排重绘
- 使用 CSS containment

### JavaScript 优化

```javascript
// 使用 requestIdleCallback 延迟非关键任务
requestIdleCallback(() => {
  // 非紧急任务
  analyticsSend();
});
```

## 实战案例

我们的项目通过以下优化：

- LCP: 4.2s → 1.8s
- FID: 280ms → 45ms
- CLS: 0.25 → 0.05

### 优化措施

1. 实施代码分割
2. 优化图片格式和尺寸
3. 使用 CDN
4. 启用 HTTP/2
5. 实施服务端渲染

## 监控与分析

使用工具持续监控：

- **Lighthouse** - 综合评分
- **WebPageTest** - 详细分析
- **Chrome DevTools** - 实时调试
- **Real User Monitoring** - 真实用户数据

## 最佳实践清单

- [ ] 压缩文本资源（gzip/brotli）
- [ ] 优化图片（格式、尺寸、懒加载）
- [ ] 实施代码分割
- [ ] 使用 CDN
- [ ] 启用浏览器缓存
- [ ] 减少 HTTP 请求
- [ ] 优化关键渲染路径
- [ ] 使用 Service Worker

## 总结

性能优化是一个持续的过程，需要：

1. 建立性能预算
2. 持续监控
3. 定期优化
4. 团队重视

记住：快 1 秒，用户体验和转化率都会显著提升！
