---
title: "Js.Object"
date: 2022-04-08T21:36:37+08:00
draft: true
tags: ["js"]
categories: ["js"]
---



# Object





## Object.assign



拷贝源对象自身的并且可枚举的属性到目标对象。

该对象会调用源对象的`[[Get]]`函数和目标对象的`[[Set]]`函数。所以它会调用相关 getter 和 setter

- 如果合并源包含getter，这可能使其不适合将新属性合并到原型中。

- 原始类型会被包装，null 和 undefined 会被忽略。



## Object.create



会使用现有对象作为新创建对象的`__proto__`

> Object.create(null)  => {} 返回一个空对象，不包含__proto__









