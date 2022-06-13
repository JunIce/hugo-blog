---
title: "js -- async await基本知识"
date: 2022-06-11T20:04:53+08:00
tags: ["js", "asynchronous"]
categories: ["js"]
draft: false
---





# async await



## 错误捕获



`async` 函数永远返回一个promise



- 如果没有指定返回值，则默认返回一个resolve promise, 相当于return Promise.resolve()
- 如果返回一个值，相当于return Promise.resolve("你的值")
- 如果函数中抛出错误, throw new Error, 则相当于return Promise.reject("error")



### 案例

```js

async function thisThrows() {
    throw new Error("Thrown from thisThrows()");
}

try {
    thisThrows();
} catch (e) {
    console.error(e);
} finally {
    console.log('We do cleanup here');
}
```



这里try-catch就不能捕获到错误，因为thisThrows是一个async, 所以在执行的时候，主任务已经结束了，但是子任务还没执行完毕



所以有两种解决方案

- 把调用thisThrow函数也改造成一个async函数
- 调用thisThrow的同时，使用.catch函数去捕获错误



