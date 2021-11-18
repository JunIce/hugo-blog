---
title: "Proxy"
date: 2021-11-09T15:38:21+08:00
draft: true
tags: ["js"]
---

## Proxy 构造器

```js
  new Proxy(target, handler)
```
> target ：需要使用Proxy包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

> handler: 一个对象，其属性是当执行一个操作时定义代理的行为的函数(可以理解为某种触发器)。具体的handler相关函数请查阅官网

```js
handler = {
    apply: () => {}, // 函数调用劫持。
    construct: () => {}, // new 操作符劫持
    defineProperty: () => {}, // Object.defineProperty调用劫持。
    deleteProperty: () => {}, // delete 操作符劫持。
    get: () => {}, // 获取属性值劫持
    getOwnPropertyDescriptor: () => {}, // Object.getOwnPropertyDescriptor 调用劫持。
    getPrototypeOf: () => {}, // Object.getPrototypeOf调用劫持。
    has: () => {}, // in操作符劫持。
    isExtensible: () => {}, // Object.isExtensible调用劫持
    ownKeys: () => {}, // Object.getOwnPropertyNames 和Object.getOwnPropertySymbols调用劫持。
    preventExtensions: () => {}, // Object.preventExtensions调用劫持。
    set: () => {}, //设置属性值劫持。
    setPrototypeOf: () => {}, // Object.setPrototypeOf调用劫持。
}
```

### get & set

```js
let a = {
    name: 'jack'
}

let b = new Proxy(a, {
    get: function(target, key) {
        console.log('get method :', target, key)
        return target[key]
    },
    set: function(target, prop, value, receiver) {
        console.log('set method: success');
        target[prop] = value
        return true
    }
})

console.log(b.name)
```
返回对被劫持的对象返回的新对象

### apply

#### apply 参数

> target 目标对象（函数）。

> thisArg 被调用时的上下文对象。

> argumentsList 被调用时的参数数组。

```js
function sum(a, b) {
    return a + b
}   

let c = new Proxy(sum, {
    apply: function(target, context, argsList) {
        console.log('apply: ', argsList) 
        return target.apply(this, argsList) + 10
    }
})

c(1, 4) // 15
```




