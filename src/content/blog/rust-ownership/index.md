---
title: '从零开始学习 Rust：所有权系统详解'
description: 'Rust 的所有权系统是其最独特也是最重要的特性。本教程将通过清晰的例子和详细的解释，帮助你彻底理解 Rust 的所有权、借用和生命周期概念。'
publishDate: 2024-12-20
category: '教程'
tags: ['Rust', '系统编程', '所有权', '内存安全', '编程语言']
featured: true
---
Rust 的所有权系统是其区别于其他编程语言的核心特性。

## 什么是所有权？

在 Rust 中，每个值都有一个所有者（owner）：

```rust
let s = String::from("hello"); // s 是所有者
```

### 所有权规则

1. 每个值都有一个所有者
2. 同一时间只能有一个所有者
3. 当所有者离开作用域，值被丢弃

## 移动语义

```rust
let s1 = String::from("hello");
let s2 = s1; // s1 的值移动到 s2

// println!("{}", s1); // 错误！s1 已失效
println!("{}", s2); // 正确
```

## 借用（Borrowing）

通过引用来借用值，而不获取所有权：

```rust
fn calculate_length(s: &String) -> usize {
    s.len()
} // s 离开作用域，但不会释放内存

let s1 = String::from("hello");
let len = calculate_length(&s1);
```

### 可变引用

```rust
fn change(s: &mut String) {
    s.push_str(", world");
}

let mut s = String::from("hello");
change(&mut s);
```

### 引用规则

- 同一时间只能有一个可变引用
- 或者多个不可变引用
- 引用必须始终有效

## 生命周期

生命周期确保引用始终有效：

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

## 实践建议

1. 优先使用不可变引用
2. 理解何时发生移动
3. 善用生命周期省略规则
4. 使用 `clone()` 时要谨慎

## 常见错误

### 悬垂引用

```rust
fn dangle() -> &String { // 错误！
    let s = String::from("hello");
    &s
} // s 被释放，返回了悬垂引用
```

正确做法：

```rust
fn no_dangle() -> String {
    let s = String::from("hello");
    s // 所有权移动到调用者
}
```

## 总结

所有权系统让 Rust 在没有垃圾回收的情况下实现了内存安全。虽然学习曲线陡峭，但掌握后会让你成为更好的程序员。

继续学习：

- 智能指针（Box, Rc, RefCell）
- 并发编程
- 异步 Rust
