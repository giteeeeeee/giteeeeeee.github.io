---
title: 'Python 入门教程（五）：实战项目与总结'
description: 'Python 入门系列最后一篇，通过实战项目整合所有知识，构建一个完整的命令行工具。'
publishDate: 2025-02-07
category: '教程'
tags: ['Python', '教程', '实战项目']
featured: true
series: 'Python 入门教程'
seriesOrder: 5
---

欢迎来到 Python 入门教程系列的最后一篇！让我们通过实战项目来巩固所学的知识。

## 🎯 项目：任务管理命令行工具

我们将构建一个完整的 TODO 任务管理工具，功能包括：
- ✅ 添加任务
- 📋 查看任务列表
- ✔️ 完成任务
- 🗑️ 删除任务
- 💾 数据持久化（JSON 文件）

## 📁 项目结构

```
todo_app/
├── todo.py          # 主程序
├── task.py          # 任务类
├── storage.py       # 数据存储
└── tasks.json       # 数据文件
```

## 💻 完整代码

### task.py - 任务类

```python
from datetime import datetime

class Task:
    """任务类"""
    
    def __init__(self, title, description="", task_id=None, completed=False, created_at=None):
        self.id = task_id or self._generate_id()
        self.title = title
        self.description = description
        self.completed = completed
        self.created_at = created_at or datetime.now().isoformat()
    
    @staticmethod
    def _generate_id():
        """生成唯一 ID"""
        import uuid
        return str(uuid.uuid4())[:8]
    
    def mark_complete(self):
        """标记为完成"""
        self.completed = True
    
    def to_dict(self):
        """转换为字典"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at
        }
    
    @classmethod
    def from_dict(cls, data):
        """从字典创建任务"""
        return cls(
            title=data['title'],
            description=data.get('description', ''),
            task_id=data['id'],
            completed=data.get('completed', False),
            created_at=data.get('created_at')
        )
    
    def __str__(self):
        status = "✓" if self.completed else "○"
        return f"[{status}] {self.title}"
```

### storage.py - 数据存储

```python
import json
import os
from task import Task

class TaskStorage:
    """任务存储管理"""
    
    def __init__(self, filename='tasks.json'):
        self.filename = filename
        self.tasks = self._load_tasks()
    
    def _load_tasks(self):
        """从文件加载任务"""
        if not os.path.exists(self.filename):
            return []
        
        try:
            with open(self.filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return [Task.from_dict(task_data) for task_data in data]
        except (json.JSONDecodeError, IOError) as e:
            print(f"加载任务失败: {e}")
            return []
    
    def _save_tasks(self):
        """保存任务到文件"""
        try:
            with open(self.filename, 'w', encoding='utf-8') as f:
                data = [task.to_dict() for task in self.tasks]
                json.dump(data, f, ensure_ascii=False, indent=2)
        except IOError as e:
            print(f"保存任务失败: {e}")
    
    def add_task(self, task):
        """添加任务"""
        self.tasks.append(task)
        self._save_tasks()
    
    def get_all_tasks(self):
        """获取所有任务"""
        return self.tasks
    
    def get_task_by_id(self, task_id):
        """根据 ID 获取任务"""
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None
    
    def delete_task(self, task_id):
        """删除任务"""
        self.tasks = [task for task in self.tasks if task.id != task_id]
        self._save_tasks()
    
    def update_task(self, task):
        """更新任务"""
        self._save_tasks()
```

### todo.py - 主程序

```python
#!/usr/bin/env python3
"""
TODO 任务管理工具
"""
import sys
from task import Task
from storage import TaskStorage

class TodoApp:
    """TODO 应用主类"""
    
    def __init__(self):
        self.storage = TaskStorage()
    
    def run(self):
        """运行应用"""
        if len(sys.argv) < 2:
            self.show_help()
            return
        
        command = sys.argv[1]
        
        commands = {
            'add': self.add_task,
            'list': self.list_tasks,
            'complete': self.complete_task,
            'delete': self.delete_task,
            'help': self.show_help
        }
        
        if command in commands:
            commands[command]()
        else:
            print(f"未知命令: {command}")
            self.show_help()
    
    def add_task(self):
        """添加新任务"""
        if len(sys.argv) < 3:
            print("用法: todo add <任务标题> [描述]")
            return
        
        title = sys.argv[2]
        description = sys.argv[3] if len(sys.argv) > 3 else ""
        
        task = Task(title, description)
        self.storage.add_task(task)
        print(f"✓ 已添加任务: {title} (ID: {task.id})")
    
    def list_tasks(self):
        """列出所有任务"""
        tasks = self.storage.get_all_tasks()
        
        if not tasks:
            print("暂无任务")
            return
        
        print("\n" + "=" * 60)
        print("📋 任务列表".center(60))
        print("=" * 60)
        
        # 分组显示
        pending = [t for t in tasks if not t.completed]
        completed = [t for t in tasks if t.completed]
        
        if pending:
            print("\n⏳ 待完成:")
            for task in pending:
                print(f"  {task} (ID: {task.id})")
                if task.description:
                    print(f"     {task.description}")
        
        if completed:
            print("\n✅ 已完成:")
            for task in completed:
                print(f"  {task} (ID: {task.id})")
        
        print(f"\n统计: {len(pending)} 个待完成，{len(completed)} 个已完成")
        print("=" * 60 + "\n")
    
    def complete_task(self):
        """完成任务"""
        if len(sys.argv) < 3:
            print("用法: todo complete <任务ID>")
            return
        
        task_id = sys.argv[2]
        task = self.storage.get_task_by_id(task_id)
        
        if not task:
            print(f"找不到 ID 为 {task_id} 的任务")
            return
        
        if task.completed:
            print(f"任务已完成: {task.title}")
            return
        
        task.mark_complete()
        self.storage.update_task(task)
        print(f"✓ 已完成: {task.title}")
    
    def delete_task(self):
        """删除任务"""
        if len(sys.argv) < 3:
            print("用法: todo delete <任务ID>")
            return
        
        task_id = sys.argv[2]
        task = self.storage.get_task_by_id(task_id)
        
        if not task:
            print(f"找不到 ID 为 {task_id} 的任务")
            return
        
        self.storage.delete_task(task_id)
        print(f"✓ 已删除: {task.title}")
    
    def show_help(self):
        """显示帮助信息"""
        help_text = """
📝 TODO 任务管理工具

用法:
  todo add <标题> [描述]    添加新任务
  todo list                 查看所有任务
  todo complete <ID>        完成任务
  todo delete <ID>          删除任务
  todo help                 显示帮助

示例:
  todo add "学习Python" "完成教程第5章"
  todo list
  todo complete abc123
  todo delete abc123
        """
        print(help_text)

def main():
    """主入口"""
    app = TodoApp()
    try:
        app.run()
    except KeyboardInterrupt:
        print("\n\n程序已退出")
    except Exception as e:
        print(f"发生错误: {e}")

if __name__ == '__main__':
    main()
```

## 🚀 使用示例

```bash
# 添加任务
python todo.py add "学习Python" "完成入门教程"
python todo.py add "写代码"

# 查看任务列表
python todo.py list

# 完成任务
python todo.py complete abc123

# 删除任务
python todo.py delete xyz789
```

## 📊 运行效果

```
$ python todo.py list

============================================================
                        📋 任务列表
============================================================

⏳ 待完成:
  [○] 学习Python (ID: a1b2c3d4)
     完成入门教程
  [○] 写代码 (ID: e5f6g7h8)

✅ 已完成:
  [✓] 读文档 (ID: i9j0k1l2)

统计: 2 个待完成，1 个已完成
============================================================
```

## 🎓 知识点回顾

这个项目用到了：

1. **面向对象编程**：`Task`、`TaskStorage`、`TodoApp` 类
2. **文件操作**：JSON 数据持久化
3. **异常处理**：处理文件和 JSON 错误
4. **数据结构**：列表、字典的操作
5. **函数与方法**：类方法、静态方法
6. **模块化**：代码分离到多个文件

## 🚀 扩展练习

1. **添加截止日期**：为任务添加 deadline 字段
2. **优先级排序**：添加优先级（高/中/低）
3. **搜索功能**：根据关键词搜索任务
4. **统计功能**：显示完成率、最活跃时间等
5. **彩色输出**：使用 `colorama` 库美化输出

## 📚 学习资源

### 推荐阅读

- 📖 [Python 官方文档](https://docs.python.org/zh-cn/3/)
- 📖 《Python Cookbook》
- 📖 《Fluent Python》

### 下一步方向

1. **Web 开发**：学习 Flask/Django
2. **数据科学**：NumPy、Pandas、Matplotlib
3. **自动化**：Selenium、Beautiful Soup
4. **API 开发**：FastAPI、RESTful API

## 🎉 系列总结

恭喜你完成了 Python 入门教程系列！

我们学习了：
- ✅ **基础语法**：变量、数据类型、控制流
- ✅ **数据结构**：列表、字典、集合、元组
- ✅ **函数**：定义、参数、Lambda、推导式
- ✅ **面向对象**：类、继承、多态、封装
- ✅ **文件操作**：读写文件、CSV、JSON
- ✅ **异常处理**：try-except、自定义异常
- ✅ **实战项目**：完整的命令行工具

## 💪 继续前进

编程是一个不断学习和实践的过程。记住：

> **"编程最好的学习方式就是写代码！"**

保持好奇心，持续实践，你会越来越强！🚀

---

**系列完结** | 感谢你的陪伴！❤️
