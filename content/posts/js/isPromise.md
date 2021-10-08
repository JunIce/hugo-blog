---
title: "常用判断函数"
date: 2021-09-30T15:51:54+08:00
draft: false
---


## 是否是promise
```js
export function isPromise(object: any): object is Promise<any> {
  return Promise.resolve(object) === object;
}
```