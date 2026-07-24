---
title: 'Python 入门教程（四）：文件操作与异常处理'
description: 'Python 入门系列第四篇，学习文件的读写操作、异常处理机制和上下文管理器的使用。'
publishDate: 2025-01-31
category: '教程'
tags: ['Python', '教程', '文件操作', '异常处理']
featured: false
series: 'Python 入门教程'
seriesOrder: 4
---

欢迎来到 Python 入门教程系列第四篇！今天我们将学习如何处理文件和异常。

## 📁 文件操作

### 1. 读取文件

```python
# 方式一：手动关闭
file = open('example.txt', 'r', encoding='utf-8')
content = file.read()
print(content)
file.close()

# 方式二：with 语句（推荐）
with open('example.txt', 'r', encoding='utf-8') as file:
    content = file.read()
    print(content)
# 文件会自动关闭

# 逐行读取
with open('example.txt', 'r', encoding='utf-8') as file:
    for line in file:
        print(line.strip())  # strip() 去除行尾的换行符

# 读取所有行到列表
with open('example.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()
    print(lines)
```

### 2. 写入文件

```python
# 写入模式（覆盖）
with open('output.txt', 'w', encoding='utf-8') as file:
    file.write("第一行\n")
    file.write("第二行\n")

# 追加模式
with open('output.txt', 'a', encoding='utf-8') as file:
    file.write("追加的内容\n")

# 写入多行
lines = ["Python\n", "JavaScript\n", "Go\n"]
with open('languages.txt', 'w', encoding='utf-8') as file:
    file.writelines(lines)
```

### 3. 文件模式

| 模式 | 说明 |
|------|------|
| `'r'` | 只读（默认） |
| `'w'` | 写入（覆盖） |
| `'a'` | 追加 |
| `'x'` | 独占创建，文件存在则失败 |
| `'b'` | 二进制模式 |
| `'+'` | 读写模式 |

```python
# 读写模式
with open('data.txt', 'r+', encoding='utf-8') as file:
    content = file.read()
    file.write("\n新增内容")

# 二进制模式（处理图片、视频等）
with open('image.jpg', 'rb') as file:
    data = file.read()

with open('copy.jpg', 'wb') as file:
    file.write(data)
```

## 🚨 异常处理

### 1. try-except 基础

```python
try:
    # 可能出错的代码
    number = int(input("请输入数字: "))
    result = 10 / number
    print(f"结果: {result}")
except ValueError:
    # 处理值错误
    print("请输入有效的数字！")
except ZeroDivisionError:
    # 处理除零错误
    print("不能除以零！")
```

### 2. 捕获多个异常

```python
try:
    file = open('nonexistent.txt', 'r')
    content = file.read()
except (FileNotFoundError, IOError) as e:
    print(f"文件操作失败: {e}")

# 捕获所有异常（不推荐）
try:
    # 代码
    pass
except Exception as e:
    print(f"发生错误: {e}")
```

### 3. else 和 finally

```python
try:
    file = open('data.txt', 'r', encoding='utf-8')
    content = file.read()
except FileNotFoundError:
    print("文件不存在")
else:
    # 没有异常时执行
    print(f"成功读取 {len(content)} 个字符")
finally:
    # 无论是否异常都执行
    print("执行完毕")
    try:
        file.close()
    except:
        pass
```

### 4. 抛出异常

```python
def divide(a, b):
    if b == 0:
        raise ValueError("除数不能为零")
    return a / b

try:
    result = divide(10, 0)
except ValueError as e:
    print(f"错误: {e}")
```

### 5. 自定义异常

```python
class InsufficientFundsError(Exception):
    """余额不足异常"""
    pass

class BankAccount:
    def __init__(self, balance):
        self.balance = balance
    
    def withdraw(self, amount):
        if amount > self.balance:
            raise InsufficientFundsError(
                f"余额不足！当前余额: {self.balance}，尝试取款: {amount}"
            )
        self.balance -= amount
        return amount

# 使用
account = BankAccount(1000)
try:
    account.withdraw(1500)
except InsufficientFundsError as e:
    print(e)
```

## 🔧 上下文管理器

### 1. with 语句

```python
# 自动管理资源
with open('file.txt', 'r') as f:
    data = f.read()
# 离开 with 块时，文件自动关闭
```

### 2. 自定义上下文管理器

```python
class Timer:
    """计时器上下文管理器"""
    
    def __enter__(self):
        import time
        self.start = time.time()
        print("开始计时...")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        self.end = time.time()
        elapsed = self.end - self.start
        print(f"用时: {elapsed:.2f} 秒")
        return False  # 不抑制异常

# 使用
with Timer():
    # 执行一些操作
    sum([i ** 2 for i in range(1000000)])
```

## 💡 实战：日志系统

```python
import os
from datetime import datetime

class Logger:
    """简单的日志系统"""
    
    def __init__(self, filename='app.log'):
        self.filename = filename
    
    def log(self, level, message):
        """记录日志"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_message = f"[{timestamp}] [{level}] {message}\n"
        
        try:
            with open(self.filename, 'a', encoding='utf-8') as f:
                f.write(log_message)
        except IOError as e:
            print(f"写入日志失败: {e}")
    
    def info(self, message):
        self.log('INFO', message)
    
    def warning(self, message):
        self.log('WARNING', message)
    
    def error(self, message):
        self.log('ERROR', message)
    
    def read_logs(self):
        """读取所有日志"""
        try:
            with open(self.filename, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return "日志文件不存在"

# 使用
logger = Logger('my_app.log')

logger.info("应用程序启动")
logger.warning("内存使用率较高")
logger.error("数据库连接失败")

print(logger.read_logs())
```

## 📊 实战：CSV 文件处理

```python
import csv

# 写入 CSV
students = [
    ['姓名', '年龄', '成绩'],
    ['张三', 20, 85],
    ['李四', 21, 92],
    ['王五', 19, 78]
]

with open('students.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerows(students)

# 读取 CSV
with open('students.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# 使用字典
with open('students.csv', 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(f"{row['姓名']}: {row['成绩']}分")
```

## 🎓 练习题

1. **文件统计**：编写程序统计文本文件的行数、单词数和字符数
2. **配置文件**：创建程序读写 JSON 配置文件
3. **错误日志**：实现一个记录所有程序错误的日志系统

## 📚 下一步

在最后一篇中，我们将：
- 整合所有知识
- 构建一个完整的命令行工具
- 学习代码调试技巧

你已经走过了大部分旅程！💪

---

> 💡 **最佳实践**：始终使用 `with` 语句处理文件，确保资源正确释放。
