---
title: 'Web 开发入门（三）：响应式设计与现代布局'
description: 'Web 开发入门系列第三篇，掌握响应式设计、Flexbox 和 Grid 布局，让网页在所有设备上完美显示。'
publishDate: 2025-02-24
category: '教程'
tags: ['Web开发', 'CSS', '响应式设计', 'Flexbox', 'Grid']
featured: false
series: 'Web 开发入门'
seriesOrder: 3
---

欢迎来到 Web 开发入门系列第三篇！今天我们将学习如何让网页在不同设备上都能完美显示。

## 🎯 什么是响应式设计？

响应式设计让网页能够自动适应不同的屏幕尺寸：
- 📱 手机（320px - 480px）
- 📱 平板（768px - 1024px）
- 💻 桌面（1200px+）

## 📐 视口和媒体查询

### 1. 视口设置

在 HTML 头部添加视口标签：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 2. 媒体查询

```css
/* 基础样式（移动优先） */
.container {
    width: 100%;
    padding: 10px;
}

/* 平板 */
@media (min-width: 768px) {
    .container {
        width: 750px;
        margin: 0 auto;
    }
}

/* 桌面 */
@media (min-width: 1200px) {
    .container {
        width: 1140px;
    }
}

/* 常用断点 */
@media (max-width: 576px) { /* 手机 */ }
@media (min-width: 768px) { /* 平板 */ }
@media (min-width: 992px) { /* 小桌面 */ }
@media (min-width: 1200px) { /* 大桌面 */ }
```

## 🎨 Flexbox 布局

Flexbox 是一维布局系统，非常适合创建灵活的布局。

### 1. 基础概念

```css
.container {
    display: flex;
    
    /* 主轴方向 */
    flex-direction: row; /* row | column | row-reverse | column-reverse */
    
    /* 换行 */
    flex-wrap: wrap; /* nowrap | wrap | wrap-reverse */
    
    /* 主轴对齐 */
    justify-content: space-between; 
    /* flex-start | flex-end | center | space-between | space-around */
    
    /* 交叉轴对齐 */
    align-items: center;
    /* flex-start | flex-end | center | stretch | baseline */
    
    /* 间距 */
    gap: 20px;
}

.item {
    /* 弹性增长 */
    flex-grow: 1;
    
    /* 弹性收缩 */
    flex-shrink: 1;
    
    /* 基础大小 */
    flex-basis: 200px;
    
    /* 简写 */
    flex: 1 1 200px; /* grow shrink basis */
}
```

### 2. 实战示例

#### 导航栏

```html
<nav class="navbar">
    <div class="logo">MyLogo</div>
    <ul class="nav-links">
        <li><a href="#home">首页</a></li>
        <li><a href="#about">关于</a></li>
        <li><a href="#contact">联系</a></li>
    </ul>
</nav>
```

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #333;
    color: white;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
}

/* 响应式 */
@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-links {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
}
```

#### 卡片布局

```html
<div class="card-container">
    <div class="card">卡片 1</div>
    <div class="card">卡片 2</div>
    <div class="card">卡片 3</div>
</div>
```

```css
.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
}

.card {
    flex: 1 1 300px; /* 最小 300px */
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

## 📊 Grid 布局

Grid 是二维布局系统，适合创建复杂的网格布局。

### 1. 基础概念

```css
.grid-container {
    display: grid;
    
    /* 列定义 */
    grid-template-columns: 200px 1fr 1fr;
    /* repeat(3, 1fr) - 3 列等宽 */
    /* repeat(auto-fit, minmax(200px, 1fr)) - 自适应 */
    
    /* 行定义 */
    grid-template-rows: 100px auto 50px;
    
    /* 间距 */
    gap: 20px;
    /* grid-row-gap: 20px; */
    /* grid-column-gap: 20px; */
}

.grid-item {
    /* 跨列 */
    grid-column: 1 / 3; /* 从第 1 列到第 3 列 */
    grid-column: span 2; /* 跨 2 列 */
    
    /* 跨行 */
    grid-row: 1 / 3;
    grid-row: span 2;
}
```

### 2. 实战示例

#### 经典布局

```html
<div class="page">
    <header>头部</header>
    <aside>侧边栏</aside>
    <main>主内容</main>
    <footer>底部</footer>
</div>
```

```css
.page {
    display: grid;
    grid-template-areas:
        "header header"
        "aside main"
        "footer footer";
    grid-template-columns: 200px 1fr;
    grid-template-rows: 80px 1fr 60px;
    min-height: 100vh;
    gap: 10px;
}

header {
    grid-area: header;
    background: #333;
    color: white;
}

aside {
    grid-area: aside;
    background: #f4f4f4;
}

main {
    grid-area: main;
    background: white;
}

footer {
    grid-area: footer;
    background: #333;
    color: white;
}

/* 响应式 */
@media (max-width: 768px) {
    .page {
        grid-template-areas:
            "header"
            "main"
            "aside"
            "footer";
        grid-template-columns: 1fr;
        grid-template-rows: 60px auto auto 60px;
    }
}
```

#### 图片画廊

```html
<div class="gallery">
    <div class="gallery-item">图片 1</div>
    <div class="gallery-item featured">图片 2</div>
    <div class="gallery-item">图片 3</div>
    <div class="gallery-item">图片 4</div>
    <div class="gallery-item">图片 5</div>
</div>
```

```css
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    padding: 20px;
}

.gallery-item {
    aspect-ratio: 1;
    background: #ddd;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.gallery-item.featured {
    grid-column: span 2;
    grid-row: span 2;
}
```

## 📱 响应式实战

### 1. 流式图片

```css
img {
    max-width: 100%;
    height: auto;
    display: block;
}
```

### 2. 响应式排版

```css
html {
    /* 基础字体大小 */
    font-size: 16px;
}

body {
    /* 使用 rem 单位 */
    font-size: 1rem; /* 16px */
    line-height: 1.6;
}

h1 {
    font-size: clamp(1.5rem, 5vw, 3rem);
    /* 最小 1.5rem，理想 5vw，最大 3rem */
}

@media (max-width: 768px) {
    html {
        font-size: 14px; /* 移动端缩小 */
    }
}
```

### 3. 容器查询（新特性）

```css
.container {
    container-type: inline-size;
}

.card {
    padding: 1rem;
}

@container (min-width: 400px) {
    .card {
        display: flex;
        gap: 1rem;
    }
}
```

## 💡 完整实战：响应式作品集

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的作品集</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, sans-serif;
            line-height: 1.6;
        }
        
        /* 导航栏 */
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 5%;
            background: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: #667eea;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
        }
        
        /* 英雄区 */
        .hero {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 2rem;
        }
        
        .hero h1 {
            font-size: clamp(2rem, 6vw, 4rem);
            margin-bottom: 1rem;
        }
        
        /* 作品网格 */
        .projects {
            padding: 4rem 5%;
            background: #f9f9f9;
        }
        
        .projects h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
        }
        
        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .project-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .project-card:hover {
            transform: translateY(-10px);
        }
        
        .project-img {
            width: 100%;
            aspect-ratio: 16/9;
            background: #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }
        
        .project-content {
            padding: 1.5rem;
        }
        
        .project-content h3 {
            margin-bottom: 0.5rem;
        }
        
        /* 响应式 */
        @media (max-width: 768px) {
            .nav-links {
                display: none; /* 实际项目中使用汉堡菜单 */
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .projects {
                padding: 2rem 1rem;
            }
            
            .project-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo">Portfolio</div>
        <ul class="nav-links">
            <li><a href="#home">首页</a></li>
            <li><a href="#projects">作品</a></li>
            <li><a href="#contact">联系</a></li>
        </ul>
    </nav>
    
    <section class="hero">
        <div>
            <h1>👋 你好，我是前端开发者</h1>
            <p>热爱创造美好的 Web 体验</p>
        </div>
    </section>
    
    <section class="projects" id="projects">
        <h2>我的作品</h2>
        <div class="project-grid">
            <div class="project-card">
                <div class="project-img">🎨</div>
                <div class="project-content">
                    <h3>项目一</h3>
                    <p>响应式设计的电商网站</p>
                </div>
            </div>
            <div class="project-card">
                <div class="project-img">📱</div>
                <div class="project-content">
                    <h3>项目二</h3>
                    <p>移动端优先的社交应用</p>
                </div>
            </div>
            <div class="project-card">
                <div class="project-img">💼</div>
                <div class="project-content">
                    <h3>项目三</h3>
                    <p>企业级管理系统</p>
                </div>
            </div>
        </div>
    </section>
</body>
</html>
```

## 🎓 练习题

1. **响应式导航**：创建一个在移动端变成汉堡菜单的导航栏
2. **瀑布流布局**：使用 Grid 创建 Pinterest 风格的布局
3. **仪表盘**：设计一个响应式的数据仪表盘

## 📚 下一步

在下一篇中，我们将学习：
- 前端框架入门（React/Vue）
- 组件化开发
- 状态管理

你已经掌握了现代 CSS 布局！🎉

---

> 💡 **移动优先**：先为小屏幕设计，然后使用媒体查询扩展到大屏幕。
