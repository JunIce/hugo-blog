---
title: "c++笔记"
date: 2022-07-30T10:18:32+08:00
tags:
categories:
draft: false
---



using和namespace都是C++中的关键字。std是标准库所驻之命名空间（namespace）的名称。



### 指针

`*`: 定义指针变量

`&`：取值对象内存地址

```c++
int size = 18;

int *p = &size;


0x7ffee30a3f28------
18
```



如果要访问一个由指针所指的对象，我们必须对该指针进行提领（dereference）操作——也就是取得“位于该指针所指内存地址上”的对象.

在指针之前使用＊号，便可以达到这个目的

```c++
    cout << p
    << "\n------\n"
    << *p;

# ...
0x7ffeec767f28
------
18
```



**指针可能并不指向任何对象。**

- 一个未指向任何对象的指针，其地址值为0。有时候我们称之为null指针。

- 任何指针都可以被初始化，或是令其值为0。

