---
title: 'Web 开发入门（二）：JavaScript 编程基础'
description: 'Web 开发入门系列第二篇，学习 JavaScript 核心语法、DOM 操作和事件处理。'
publishDate: 2025-02-17
category: '教程'
tags: ['Web开发', 'JavaScript', '前端', 'DOM']
featured: false
series: 'Web 开发入门'
seriesOrder: 2
---

欢迎回到 Web 开发入门系列！在上一篇中我们学习了 HTML 和 CSS，现在让我们通过 JavaScript 让网页动起来。

## 🎯 JavaScript 是什么？

JavaScript 是一门编程语言，可以让网页具有交互性：
- ✨ 响应用户操作
- 🔄 动态更新内容
- ✅ 验证表单数据
- 🎨 创建动画效果

## 📝 JavaScript 基础语法

### 1. 变量声明

```javascript
// let - 可以重新赋值
let age = 25;
age = 26;  // ✅ 可以修改

// const - 常量，不能重新赋值
const name = "张三";
// name = "李四";  // ❌ 报错

// 旧式声明（不推荐）
var score = 100;
```

### 2. 数据类型

```javascript
// 数字
let count = 42;
let price = 19.99;

// 字符串
let message = "Hello";
let greeting = `你好，${name}`; // 模板字符串

// 布尔值
let isActive = true;
let hasPermission = false;

// 数组
let fruits = ["苹果", "香蕉", "橙子"];
console.log(fruits[0]);  // 苹果

// 对象
let person = {
    name: "小明",
    age: 20,
    city: "北京"
};
console.log(person.name);  // 小明
```

### 3. 函数

```javascript
// 函数声明
function greet(name) {
    return `你好，${name}！`;
}

// 函数表达式
const add = function(a, b) {
    return a + b;
};

// 箭头函数
const multiply = (a, b) => a * b;

// 调用函数
console.log(greet("小红"));
console.log(add(5, 3));
console.log(multiply(4, 6));
```

### 4. 条件语句

```javascript
let score = 85;

if (score >= 90) {
    console.log("优秀");
} else if (score >= 60) {
    console.log("及格");
} else {
    console.log("不及格");
}

// 三元运算符
let result = score >= 60 ? "通过" : "未通过";
```

### 5. 循环

```javascript
// for 循环
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// 遍历数组
let colors = ["红", "绿", "蓝"];
for (let color of colors) {
    console.log(color);
}

// forEach
colors.forEach(color => {
    console.log(color);
});

// map（创建新数组）
let numbers = [1, 2, 3, 4];
let doubled = numbers.map(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8]
```

## 🌐 DOM 操作

DOM（Document Object Model）是网页的编程接口，让我们可以用 JavaScript 操作网页元素。

### 1. 选择元素

```javascript
// 通过 ID 选择
let header = document.getElementById('header');

// 通过类名选择
let buttons = document.getElementsByClassName('btn');

// 通过标签名选择
let paragraphs = document.getElementsByTagName('p');

// 使用选择器（推荐）
let element = document.querySelector('.container');
let elements = document.querySelectorAll('.item');
```

### 2. 修改内容

```javascript
// 修改文本内容
let title = document.querySelector('h1');
title.textContent = "新标题";

// 修改 HTML
let container = document.querySelector('.container');
container.innerHTML = '<p>新内容</p>';
```

### 3. 修改样式

```javascript
let box = document.querySelector('.box');

// 修改单个样式
box.style.color = 'red';
box.style.fontSize = '20px';
box.style.backgroundColor = '#f0f0f0';

// 添加/删除类
box.classList.add('active');
box.classList.remove('hidden');
box.classList.toggle('highlight');
```

### 4. 创建和删除元素

```javascript
// 创建元素
let newDiv = document.createElement('div');
newDiv.textContent = '新元素';
newDiv.className = 'item';

// 添加到页面
let container = document.querySelector('.container');
container.appendChild(newDiv);

// 删除元素
let oldDiv = document.querySelector('.old');
oldDiv.remove();
```

## 🖱️ 事件处理

### 1. 点击事件

```javascript
let button = document.querySelector('#myButton');

button.addEventListener('click', function() {
    alert('按钮被点击了！');
});

// 使用箭头函数
button.addEventListener('click', () => {
    console.log('点击了按钮');
});
```

### 2. 表单事件

```javascript
let form = document.querySelector('#myForm');
let input = document.querySelector('#username');

// 提交事件
form.addEventListener('submit', (e) => {
    e.preventDefault();  // 阻止默认提交
    console.log('表单提交');
});

// 输入事件
input.addEventListener('input', (e) => {
    console.log('当前输入:', e.target.value);
});
```

### 3. 鼠标事件

```javascript
let box = document.querySelector('.box');

box.addEventListener('mouseenter', () => {
    box.style.backgroundColor = 'lightblue';
});

box.addEventListener('mouseleave', () => {
    box.style.backgroundColor = 'white';
});
```

## 💡 实战：待办事项列表

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>待办事项</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, sans-serif;
            background: #f5f5f5;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        
        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        input {
            flex: 1;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        
        button {
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        
        button:hover {
            background: #5568d3;
        }
        
        .todo-list {
            list-style: none;
        }
        
        .todo-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        
        .todo-item.completed {
            opacity: 0.6;
            text-decoration: line-through;
        }
        
        .todo-item span {
            flex: 1;
            margin-left: 10px;
        }
        
        .delete-btn {
            padding: 5px 10px;
            background: #ff4757;
            font-size: 14px;
        }
        
        .delete-btn:hover {
            background: #e84347;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📝 待办事项</h1>
        
        <div class="input-group">
            <input type="text" id="todoInput" placeholder="输入新任务...">
            <button id="addBtn">添加</button>
        </div>
        
        <ul class="todo-list" id="todoList"></ul>
    </div>

    <script>
        // 获取元素
        const input = document.getElementById('todoInput');
        const addBtn = document.getElementById('addBtn');
        const todoList = document.getElementById('todoList');
        
        // 添加任务
        function addTodo() {
            const text = input.value.trim();
            
            if (text === '') {
                alert('请输入任务内容！');
                return;
            }
            
            // 创建任务项
            const li = document.createElement('li');
            li.className = 'todo-item';
            
            // 创建复选框
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', () => {
                li.classList.toggle('completed');
            });
            
            // 创建文本
            const span = document.createElement('span');
            span.textContent = text;
            
            // 创建删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => {
                li.remove();
            });
            
            // 组装元素
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
            
            // 清空输入框
            input.value = '';
            input.focus();
        }
        
        // 点击按钮添加
        addBtn.addEventListener('click', addTodo);
        
        // 按回车添加
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
    </script>
</body>
</html>
```

## 🎓 练习题

1. **计数器**：创建一个带加减按钮的计数器
2. **颜色切换**：点击按钮随机改变背景颜色
3. **表单验证**：验证用户名和密码格式

## 📚 下一步

在第三篇中，我们将学习：
- 响应式设计
- CSS Grid 和 Flexbox 高级用法
- 移动端适配

继续加油！💪

---

> 💡 **调试技巧**：使用 `console.log()` 查看变量值，使用浏览器开发者工具设置断点。
