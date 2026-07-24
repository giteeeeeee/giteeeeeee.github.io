---
title: 'Web 开发入门（一）：HTML 与 CSS 基础'
description: 'Web 开发入门系列第一篇，从零开始学习 HTML 和 CSS，构建你的第一个网页。'
publishDate: 2025-02-10
category: '教程'
tags: ['Web开发', 'HTML', 'CSS', '前端']
featured: true
series: 'Web 开发入门'
seriesOrder: 1
---

欢迎来到 Web 开发入门系列！这个系列将带你从零开始学习 Web 开发的核心技术。

## 🎯 系列概述

这个系列包含：
1. **HTML 与 CSS 基础**（本篇）
2. JavaScript 编程入门
3. 响应式设计与布局
4. 前端框架初探
5. 实战：构建个人博客

## 🌐 什么是 Web 开发？

Web 开发是创建网站和 Web 应用的过程，主要分为：
- **前端**：用户看到和交互的部分（HTML、CSS、JavaScript）
- **后端**：服务器、数据库、业务逻辑

## 📄 HTML 基础

### 1. HTML 文档结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的第一个网页</title>
</head>
<body>
    <h1>欢迎来到我的网站！</h1>
    <p>这是我的第一个网页。</p>
</body>
</html>
```

### 2. 常用标签

#### 标题与段落

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>

<p>这是一个段落。</p>
<p>HTML 使用标签来定义内容的结构。</p>
```

#### 列表

```html
<!-- 无序列表 -->
<ul>
    <li>苹果</li>
    <li>香蕉</li>
    <li>橙子</li>
</ul>

<!-- 有序列表 -->
<ol>
    <li>第一步</li>
    <li>第二步</li>
    <li>第三步</li>
</ol>
```

#### 链接与图片

```html
<!-- 链接 -->
<a href="https://www.example.com">访问示例网站</a>
<a href="about.html">关于我们</a>

<!-- 图片 -->
<img src="photo.jpg" alt="风景照片">
<img src="logo.png" alt="网站Logo" width="200">
```

#### 区块与行内元素

```html
<!-- 区块元素 -->
<div class="container">
    <h2>标题</h2>
    <p>内容...</p>
</div>

<!-- 行内元素 -->
<p>这是<span class="highlight">重要</span>的文本。</p>
<p>这是<strong>粗体</strong>和<em>斜体</em>文本。</p>
```

### 3. 表格

```html
<table>
    <thead>
        <tr>
            <th>姓名</th>
            <th>年龄</th>
            <th>城市</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>张三</td>
            <td>25</td>
            <td>北京</td>
        </tr>
        <tr>
            <td>李四</td>
            <td>30</td>
            <td>上海</td>
        </tr>
    </tbody>
</table>
```

### 4. 表单

```html
<form action="/submit" method="POST">
    <!-- 文本输入 -->
    <label for="username">用户名：</label>
    <input type="text" id="username" name="username" required>
    
    <!-- 密码输入 -->
    <label for="password">密码：</label>
    <input type="password" id="password" name="password" required>
    
    <!-- 单选按钮 -->
    <p>性别：</p>
    <input type="radio" id="male" name="gender" value="male">
    <label for="male">男</label>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">女</label>
    
    <!-- 复选框 -->
    <p>兴趣：</p>
    <input type="checkbox" id="reading" name="hobby" value="reading">
    <label for="reading">阅读</label>
    <input type="checkbox" id="sports" name="hobby" value="sports">
    <label for="sports">运动</label>
    
    <!-- 下拉选择 -->
    <label for="city">城市：</label>
    <select id="city" name="city">
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
        <option value="guangzhou">广州</option>
    </select>
    
    <!-- 文本域 -->
    <label for="message">留言：</label>
    <textarea id="message" name="message" rows="4"></textarea>
    
    <!-- 提交按钮 -->
    <button type="submit">提交</button>
</form>
```

## 🎨 CSS 基础

### 1. CSS 引入方式

```html
<!-- 1. 内联样式 -->
<p style="color: red; font-size: 18px;">红色文字</p>

<!-- 2. 内部样式表 -->
<head>
    <style>
        p {
            color: blue;
            font-size: 16px;
        }
    </style>
</head>

<!-- 3. 外部样式表（推荐） -->
<head>
    <link rel="stylesheet" href="styles.css">
</head>
```

### 2. 选择器

```css
/* 元素选择器 */
p {
    color: black;
}

/* 类选择器 */
.highlight {
    background-color: yellow;
}

/* ID 选择器 */
#header {
    background-color: #333;
    color: white;
}

/* 后代选择器 */
.container p {
    margin: 10px;
}

/* 子选择器 */
.nav > li {
    display: inline-block;
}

/* 伪类选择器 */
a:hover {
    color: red;
}

button:active {
    transform: scale(0.95);
}
```

### 3. 常用属性

#### 文本样式

```css
.text {
    /* 字体 */
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    font-style: italic;
    
    /* 颜色 */
    color: #333;
    
    /* 对齐 */
    text-align: center;
    
    /* 装饰 */
    text-decoration: underline;
    
    /* 行高 */
    line-height: 1.6;
}
```

#### 盒模型

```css
.box {
    /* 宽高 */
    width: 300px;
    height: 200px;
    
    /* 内边距 */
    padding: 20px;
    
    /* 边框 */
    border: 2px solid #ccc;
    border-radius: 8px;
    
    /* 外边距 */
    margin: 10px auto;
    
    /* 背景 */
    background-color: #f5f5f5;
}
```

#### 布局

```css
/* Flexbox 布局 */
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

/* Grid 布局 */
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}
```

## 💡 实战：个人名片

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>个人名片</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            width: 400px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        
        .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: white;
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .title {
            color: #666;
            margin-bottom: 20px;
        }
        
        .bio {
            color: #555;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        
        .social {
            display: flex;
            justify-content: center;
            gap: 15px;
        }
        
        .social a {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.3s;
        }
        
        .social a:hover {
            background: #667eea;
            color: white;
            transform: translateY(-3px);
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="avatar">👨‍💻</div>
        <h1>张小明</h1>
        <p class="title">前端工程师</p>
        <p class="bio">
            热爱编程，专注于 Web 开发。<br>
            喜欢学习新技术，分享技术经验。
        </p>
        <div class="social">
            <a href="#" title="GitHub">🐱</a>
            <a href="#" title="Twitter">🐦</a>
            <a href="#" title="Email">✉️</a>
        </div>
    </div>
</body>
</html>
```

## 🎓 练习题

1. **个人简介页**：创建包含头像、姓名、介绍的页面
2. **导航菜单**：制作水平导航栏，鼠标悬停时变色
3. **卡片布局**：使用 Flexbox 创建三列卡片布局

## 📚 下一步

在第二篇中，我们将学习：
- JavaScript 基础语法
- DOM 操作
- 事件处理

让我们继续探索 Web 开发的精彩世界！🚀

---

> 💡 **提示**：使用浏览器开发者工具（F12）查看和调试网页！
