---
title: 'Python 入门教程（三）：面向对象编程'
description: 'Python 入门系列第三篇，学习类与对象、继承、多态等面向对象编程核心概念。'
publishDate: 2025-01-24
category: '教程'
tags: ['Python', '教程', 'OOP', '面向对象']
featured: false
series: 'Python 入门教程'
seriesOrder: 3
---

欢迎来到 Python 入门教程系列第三篇！今天我们将探索面向对象编程（OOP）的世界。

## 🎯 什么是面向对象编程？

面向对象编程是一种编程范式，将数据和操作数据的方法封装在一起，形成"对象"。

### 核心概念

- **类（Class）**：对象的蓝图或模板
- **对象（Object）**：类的实例
- **属性（Attribute）**：对象的特征
- **方法（Method）**：对象的行为

## 📦 定义类

### 基础类定义

```python
class Dog:
    """狗的类"""
    
    # 构造函数
    def __init__(self, name, age):
        self.name = name  # 实例属性
        self.age = age
    
    # 实例方法
    def bark(self):
        return f"{self.name} 说: 汪汪!"
    
    def get_info(self):
        return f"{self.name} 是 {self.age} 岁的狗狗"

# 创建对象
my_dog = Dog("旺财", 3)
your_dog = Dog("小黑", 5)

# 使用对象
print(my_dog.bark())      # 旺财 说: 汪汪!
print(your_dog.get_info()) # 小黑 是 5 岁的狗狗
```

### 类属性 vs 实例属性

```python
class Circle:
    # 类属性（所有实例共享）
    pi = 3.14159
    
    def __init__(self, radius):
        # 实例属性（每个实例独有）
        self.radius = radius
    
    def area(self):
        return Circle.pi * self.radius ** 2
    
    def circumference(self):
        return 2 * Circle.pi * self.radius

# 使用
circle1 = Circle(5)
circle2 = Circle(10)

print(f"圆1面积: {circle1.area():.2f}")
print(f"圆2面积: {circle2.area():.2f}")
print(f"π的值: {Circle.pi}")
```

## 🏗️ 封装

隐藏内部实现细节，只暴露必要的接口：

```python
class BankAccount:
    """银行账户类"""
    
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.__balance = balance  # 私有属性（双下划线开头）
    
    def deposit(self, amount):
        """存款"""
        if amount > 0:
            self.__balance += amount
            return f"存款 {amount} 元成功"
        return "金额必须大于0"
    
    def withdraw(self, amount):
        """取款"""
        if amount > self.__balance:
            return "余额不足"
        if amount > 0:
            self.__balance -= amount
            return f"取款 {amount} 元成功"
        return "金额必须大于0"
    
    def get_balance(self):
        """获取余额"""
        return self.__balance

# 使用
account = BankAccount("张三", 1000)
print(account.deposit(500))      # 存款 500 元成功
print(account.withdraw(200))     # 取款 200 元成功
print(f"当前余额: {account.get_balance()} 元")  # 当前余额: 1300 元

# 无法直接访问私有属性
# print(account.__balance)  # ❌ 会报错
```

## 👨‍👩‍👧 继承

子类继承父类的属性和方法：

```python
class Animal:
    """动物基类"""
    
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        return "动物发出声音"
    
    def sleep(self):
        return f"{self.name} 正在睡觉..."

class Dog(Animal):
    """狗类（继承 Animal）"""
    
    def speak(self):
        return f"{self.name} 说: 汪汪!"
    
    def fetch(self):
        return f"{self.name} 去捡球了!"

class Cat(Animal):
    """猫类（继承 Animal）"""
    
    def speak(self):
        return f"{self.name} 说: 喵喵!"
    
    def climb_tree(self):
        return f"{self.name} 爬树中..."

# 使用
dog = Dog("旺财")
cat = Cat("咪咪")

print(dog.speak())       # 旺财 说: 汪汪!
print(cat.speak())       # 咪咪 说: 喵喵!
print(dog.sleep())       # 旺财 正在睡觉...
print(dog.fetch())       # 旺财 去捡球了!
print(cat.climb_tree())  # 咪咪 爬树中...
```

### super() 函数

调用父类方法：

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"我叫 {self.name}，今年 {self.age} 岁"

class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)  # 调用父类构造函数
        self.student_id = student_id
    
    def introduce(self):
        base_intro = super().introduce()  # 调用父类方法
        return f"{base_intro}，学号: {self.student_id}"

# 使用
student = Student("小明", 20, "2024001")
print(student.introduce())
# 输出: 我叫 小明，今年 20 岁，学号: 2024001
```

## 🎭 多态

不同类的对象可以使用相同的接口：

```python
class Shape:
    """形状基类"""
    
    def area(self):
        raise NotImplementedError("子类必须实现此方法")

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14159 * self.radius ** 2

class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height
    
    def area(self):
        return 0.5 * self.base * self.height

# 多态的体现
shapes = [
    Rectangle(5, 10),
    Circle(7),
    Triangle(6, 8)
]

# 统一的接口调用
for shape in shapes:
    print(f"{shape.__class__.__name__} 面积: {shape.area():.2f}")
```

输出：
```
Rectangle 面积: 50.00
Circle 面积: 153.94
Triangle 面积: 24.00
```

## 🔧 特殊方法

Python 类可以定义特殊方法（魔术方法）：

```python
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages
    
    def __str__(self):
        """字符串表示（用户友好）"""
        return f"《{self.title}》 - {self.author}"
    
    def __repr__(self):
        """对象表示（开发者友好）"""
        return f"Book('{self.title}', '{self.author}', {self.pages})"
    
    def __len__(self):
        """支持 len() 函数"""
        return self.pages
    
    def __eq__(self, other):
        """支持 == 比较"""
        return self.title == other.title and self.author == other.author

# 使用
book1 = Book("Python编程", "张三", 500)
book2 = Book("Python编程", "张三", 500)

print(book1)              # 《Python编程》 - 张三
print(repr(book1))        # Book('Python编程', '张三', 500)
print(len(book1))         # 500
print(book1 == book2)     # True
```

## 💡 实战：学生管理系统

```python
class Course:
    """课程类"""
    
    def __init__(self, name, credit):
        self.name = name
        self.credit = credit

class Student:
    """学生类"""
    
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.courses = []  # 选修的课程
        self.grades = {}   # 成绩字典
    
    def enroll(self, course):
        """选课"""
        self.courses.append(course)
        print(f"{self.name} 选修了《{course.name}》")
    
    def set_grade(self, course_name, grade):
        """设置成绩"""
        self.grades[course_name] = grade
    
    def get_gpa(self):
        """计算 GPA"""
        if not self.grades:
            return 0.0
        total = sum(self.grades.values())
        return total / len(self.grades)
    
    def __str__(self):
        return f"学生: {self.name} (学号: {self.student_id})"

# 使用
student = Student("李华", "2024001")
print(student)

# 选课
python_course = Course("Python 编程", 3)
math_course = Course("高等数学", 4)

student.enroll(python_course)
student.enroll(math_course)

# 录入成绩
student.set_grade("Python 编程", 95)
student.set_grade("高等数学", 88)

# 查看 GPA
print(f"{student.name} 的 GPA: {student.get_gpa():.2f}")
```

## 🎓 练习题

1. **图书管理**：创建 `Library` 类和 `Book` 类，实现借书、还书功能
2. **游戏角色**：创建 `Character` 基类和 `Warrior`、`Mage` 子类，实现攻击方法
3. **购物车**：创建 `ShoppingCart` 类和 `Product` 类，实现添加商品、计算总价

## 📚 下一步

在第四篇中，我们将学习：
- 文件读写操作
- 异常处理
- 上下文管理器

坚持学习，你已经掌握了 OOP 的核心！🎉

---

> 💡 **设计原则**：优先使用组合而不是继承，保持类的单一职责。
