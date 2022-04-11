---
title: "js -- Object.defineProperty"
date: 2022-04-08T13:17:09+08:00
draft: true
tags: ["js"]
categories: ["js"]
---



# Object.defineProperty



> ```typescript
> Object.defineProperty(obj, prop, descriptor)
> ```



- obj: 需要定义的目标对象
- prop： 需要定义的对象的属性
- descriptor: 对象的属性描述符号



## 描述符descriptor



- 数据描述符
  - `configurable`: 默认false。表示对象的对应属性是否可以被改变。当且仅当该属性的 `configurable` 键值为 `true` 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除
  - enumerable:  默认false。 表示是否可以被枚举， `for....in` 和 `Object.keys`
  - value： 属性对应的值，默认`undefined`
  - writable:  默认false， 表示`value`是否可以被**赋值运算符**改变
- 存取描述符： get和set，  表示`getter`和`setter`函数



**数据描述符不是每个都可以和存取描述符同时存在**



1. 如果一个描述符不具有 `value`、`writable`、`get` 和 `set` 中的任意一个键，那么它将被认为是一个数据描述符。

   

2. 如果一个描述符同时拥有 `value` 或 `writable` 和 `get` 或 `set` 键，则会产生一个异常。





