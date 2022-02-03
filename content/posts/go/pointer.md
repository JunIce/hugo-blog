---
title: "golang 指针"
date: 2022-01-23T13:37:10+08:00
draft: true
tags: ["go"]
categories: ["GoLang"]
---


# Golang 指针

值类型，都有对应的指针类型，具体形式为`*数据类型`,

## 数据类型

- 值类型都包括，基础数据类型`int, string, float, bool, 数组、结构体struct`， 通常是`栈`中分配

- 引用类型： `指针、slice切片、map、管道channel、interface`， 通常是`堆`中分配空间


## 指针指向内存图

![pointer](/snapshots/golang-pointer-map.png)


## 指针指向案例
```go
func main() {
    var a int = 10
    var b int = 20

    var ptr *int = &a // ptr 指向a的地址

    *ptr = 100 // a = 100

    ptr = &b // ptr指向b的地址

    *ptr = 200 // b = 200

    fmt.Printf("a=%d, b = %d, *ptr = %d", a, b, *ptr) // a = 100, b = 200, *ptr = 200
}

```


