---
title: 'Python 入门教程（二）：数据结构与函数'
description: 'Python 入门系列第二篇，深入学习字典、元组等数据结构，掌握函数的定义与使用。'
publishDate: 2025-01-17
category: '教程'
tags: ['Python', '教程', '数据结构', '函数']
featured: false
series: 'Python 入门教程'
seriesOrder: 2
---

欢迎回到 Python 入门教程系列！在第一篇中，我们学习了基础语法。现在让我们深入学习更强大的数据结构和函数。

## 📦 数据结构

### 1. 字典（Dictionary）

字典是键值对的集合，非常适合存储关联数据：

```python
# 创建字典
person = {
    "name": "小明",
    "age": 25,
    "city": "北京",
    "skills": ["Python", "JavaScript"]
}

# 访问值
print(person["name"])  # 小明
print(person.get("age"))  # 25

# 添加/修改
person["email"] = "xiaoming@example.com"
person["age"] = 26

# 遍历字典
for key, value in person.items():
    print(f"{key}: {value}")

# 检查键是否存在
if "email" in person:
    print("邮箱已设置")
```

### 2. 元组（Tuple）

元组类似列表，但创建后**不可修改**：

```python
# 创建元组
coordinates = (10, 20)
rgb_color = (255, 128, 0)

# 访问元素
x, y = coordinates
print(f"X: {x}, Y: {y}")

# 元组用于返回多个值
def get_user_info():
    return "小明", 25, "北京"

name, age, city = get_user_info()
print(f"{name}, {age}岁, 来自{city}")
```

### 3. 集合（Set）

集合存储唯一元素，自动去重：

```python
# 创建集合
fruits = {"苹果", "香蕉", "橙子"}
more_fruits = {"香蕉", "葡萄", "西瓜"}

# 添加元素
fruits.add("芒果")

# 集合运算
print(fruits | more_fruits)  # 并集
print(fruits & more_fruits)  # 交集
print(fruits - more_fruits)  # 差集

# 去重
numbers = [1, 2, 2, 3, 3, 3, 4]
unique_numbers = list(set(numbers))
print(unique_numbers)  # [1, 2, 3, 4]
```

## 🔧 函数

### 1. 定义函数

```python
def greet(name):
    """向用户问好"""
    return f"你好, {name}!"

# 调用函数
message = greet("小红")
print(message)  # 你好, 小红!
```

### 2. 参数类型

```python
# 必需参数
def add(a, b):
    return a + b

# 默认参数
def power(base, exponent=2):
    return base ** exponent

print(power(5))      # 25 (5^2)
print(power(5, 3))   # 125 (5^3)

# 关键字参数
def create_user(name, age, city="北京"):
    return {
        "name": name,
        "age": age,
        "city": city
    }

user = create_user(name="小明", age=25)
print(user)

# 可变参数
def sum_all(*numbers):
    return sum(numbers)

print(sum_all(1, 2, 3, 4, 5))  # 15

# 关键字可变参数
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="小明", age=25, city="上海")
```

### 3. Lambda 函数

简短的匿名函数：

```python
# 普通函数
def square(x):
    return x ** 2

# Lambda 函数
square_lambda = lambda x: x ** 2

print(square(5))         # 25
print(square_lambda(5))  # 25

# 常用于排序
students = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 92},
    {"name": "Charlie", "score": 78}
]

# 按分数排序
sorted_students = sorted(students, key=lambda s: s["score"], reverse=True)
print(sorted_students)
```

### 4. 列表推导式

优雅地创建列表：

```python
# 传统方式
squares = []
for i in range(10):
    squares.append(i ** 2)

# 列表推导式
squares = [i ** 2 for i in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 带条件
even_squares = [i ** 2 for i in range(10) if i % 2 == 0]
print(even_squares)  # [0, 4, 16, 36, 64]

# 字典推导式
square_dict = {i: i ** 2 for i in range(5)}
print(square_dict)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

## 💡 实战示例

### 学生成绩管理系统

```python
def create_student(name, scores):
    """创建学生信息"""
    return {
        "name": name,
        "scores": scores,
        "average": sum(scores) / len(scores)
    }

def get_grade(average):
    """根据平均分获取等级"""
    if average >= 90:
        return "A"
    elif average >= 80:
        return "B"
    elif average >= 70:
        return "C"
    elif average >= 60:
        return "D"
    else:
        return "F"

# 创建学生列表
students = [
    create_student("Alice", [85, 92, 78, 95]),
    create_student("Bob", [72, 68, 75, 70]),
    create_student("Charlie", [95, 98, 92, 96])
]

# 打印成绩单
print("=" * 40)
print("成绩单".center(40))
print("=" * 40)

for student in students:
    grade = get_grade(student["average"])
    print(f"{student['name']:10} | 平均分: {student['average']:.1f} | 等级: {grade}")

# 找出最高分
top_student = max(students, key=lambda s: s["average"])
print(f"\n🏆 最高分: {top_student['name']} ({top_student['average']:.1f})")
```

输出：
```
========================================
                成绩单
========================================
Alice      | 平均分: 87.5 | 等级: B
Bob        | 平均分: 71.2 | 等级: C
Charlie    | 平均分: 95.2 | 等级: A

🏆 最高分: Charlie (95.2)
```

## 🎓 练习题

1. **字典练习**：创建一个通讯录程序，可以添加、查找和删除联系人
2. **函数练习**：写一个函数计算列表中所有偶数的和
3. **推导式练习**：给定字符串列表，创建一个新列表包含所有长度大于5的字符串

## 📚 下一步

在第三篇中，我们将学习：
- 面向对象编程（类与对象）
- 继承与多态
- 模块的使用

继续保持热情！🔥

---

> 💡 **小贴士**：多使用列表推导式，让代码更 Pythonic！
