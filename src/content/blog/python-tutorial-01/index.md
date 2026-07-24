---
title: 'Python 入门教程（一）：环境搭建与基础语法'
description: 'Python 入门系列第一篇，介绍如何搭建 Python 开发环境，掌握基础语法和数据类型。'
publishDate: 2025-01-10
category: '教程'
tags: ['Python', '教程', '编程入门']
featured: true
series: 'Python 入门教程'
seriesOrder: 1
---

欢迎来到 Python 入门教程系列！这是系列的第一篇文章，我们将从零开始学习 Python。

## 🎯 系列概述

这个系列将包含以下内容：
1. **环境搭建与基础语法**（本篇）
2. 数据结构与函数
3. 面向对象编程
4. 文件操作与异常处理
5. 实战项目：构建命令行工具

## 📦 安装 Python

### Windows 安装

1. 访问 [Python 官网](https://www.python.org/)
2. 下载最新版本的 Python 3.x
3. 运行安装程序，**勾选 "Add Python to PATH"**
4. 完成安装

### macOS 安装

```bash
# 使用 Homebrew 安装
brew install python3

# 验证安装
python3 --version
```

### Linux 安装

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# 验证安装
python3 --version
```

## 🚀 第一个 Python 程序

创建一个名为 `hello.py` 的文件：

```python
# 这是注释
print("Hello, Python!")
print("欢迎来到 Python 世界！")
```

运行程序：

```bash
python3 hello.py
```

输出：
```
Hello, Python!
欢迎来到 Python 世界！
```

## 📝 基础语法

### 1. 变量与数据类型

Python 是动态类型语言，不需要声明变量类型：

```python
# 整数
age = 25
print(f"年龄: {age}")

# 浮点数
price = 19.99
print(f"价格: {price}")

# 字符串
name = "小明"
print(f"姓名: {name}")

# 布尔值
is_student = True
print(f"是学生吗: {is_student}")
```

### 2. 字符串操作

```python
# 字符串拼接
first_name = "张"
last_name = "三"
full_name = first_name + last_name
print(full_name)  # 张三

# 字符串格式化
age = 20
message = f"{full_name}今年{age}岁"
print(message)  # 张三今年20岁

# 字符串方法
text = "  Hello World  "
print(text.strip())      # 去除空格
print(text.upper())      # 转大写
print(text.lower())      # 转小写
print(text.replace("World", "Python"))  # 替换
```

### 3. 数字运算

```python
# 基本运算
a = 10
b = 3

print(a + b)   # 加法: 13
print(a - b)   # 减法: 7
print(a * b)   # 乘法: 30
print(a / b)   # 除法: 3.3333...
print(a // b)  # 整除: 3
print(a % b)   # 取余: 1
print(a ** b)  # 幂运算: 1000
```

### 4. 列表（List）

```python
# 创建列表
fruits = ["苹果", "香蕉", "橙子"]

# 访问元素
print(fruits[0])  # 苹果
print(fruits[-1]) # 橙子（最后一个）

# 添加元素
fruits.append("葡萄")
print(fruits)  # ['苹果', '香蕉', '橙子', '葡萄']

# 删除元素
fruits.remove("香蕉")
print(fruits)  # ['苹果', '橙子', '葡萄']

# 遍历列表
for fruit in fruits:
    print(f"我喜欢{fruit}")
```

### 5. 条件语句

```python
age = 18

if age < 18:
    print("未成年")
elif age == 18:
    print("刚刚成年")
else:
    print("成年人")
```

### 6. 循环

```python
# for 循环
for i in range(5):
    print(f"第 {i + 1} 次循环")

# while 循环
count = 0
while count < 3:
    print(f"计数: {count}")
    count += 1
```

## 🎓 练习题

1. **变量练习**：创建变量存储你的姓名、年龄和城市，然后打印一段自我介绍
2. **字符串练习**：输入一个句子，统计其中包含多少个字符（不含空格）
3. **列表练习**：创建一个购物清单，添加至少5个商品，然后打印总数量

## 📚 下一步

在下一篇文章中，我们将深入学习：
- 字典（Dictionary）和元组（Tuple）
- 函数的定义与使用
- 列表推导式

继续加油！🚀

---

> 💡 **提示**：Python 的缩进非常重要！使用 4 个空格进行缩进。
> 
> 🔗 **相关资源**：[Python 官方文档](https://docs.python.org/zh-cn/3/)
