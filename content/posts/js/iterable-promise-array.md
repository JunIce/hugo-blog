---
title: "Iterable Promise Array"
date: 2021-11-26T09:44:54+08:00
draft: true
---

### 需求

数组中部分元素为异步函数，遍历数组的回掉函数也是异步函数，如何实现 等待所有异步完成，当然我们可以用`Promise.all`实现，有没有其他办法

### 实现

```js
/*
 @iterable 可遍历对象
 @mapper 
*/
function iterablePromiseArray(iterable, mapper) {
  return new Promise((resolve, reject) => {
    const iterator = iterable[Symbol.iterator]();
    // 当前元素索引， 对应到可遍历对象的每个next
    let currentIndex = 0;
    // 用来统计已经获取结果的计数
    let resolveCount = 0;
    //   是否有错误，错误退出
    let isReject = false;
    //   结果数组
    let result = [];

    const next = () => {
      if (isReject) return;

      const nextItem = iterator.next();

      if (nextItem.done) {
        // 已经获取所有结果，退出
        if (resolveCount == 0) {
          resolve(result);
        }
        return;
      }
      // 计数加一
      const i = currentIndex++;
      resolveCount++;

      Promise.resolve(nextItem.value)
        // 这里mapper可能是一个promise函数，所以外面用Promise.resolve包装一下
        .then((element) => mapper(element, i))
        .then(
          (value) => {
            result[i] = value;
            resolveCount--;
            //   调用自身
            next();
          },
          (err) => {
            isReject = true;
            reject(err);
          }
        );
    };
    // 遍历数组，每个都执行一遍next
    for (let i = 0; i < iterable.length; i++) {
      next();
    }
  });
}
```

### 最终 DEMO

```js
let _log = (n) => console.log(n);
let sleep = (fn, time) =>
  new Promise((resolve) => setTimeout(() => resolve(fn), time));
let a = [sleep(1, 1000), 2, sleep(3, 4000), 4, sleep(5, 3000)];

function iterablePromiseArray(iterable, mapper) {
  return new Promise((resolve, reject) => {
    const iterator = iterable[Symbol.iterator]();
    // 当前元素索引， 对应到可遍历对象的每个next
    let currentIndex = 0;
    // 用来统计已经获取结果的计数
    let resolveCount = 0;
    //   是否有错误，错误退出
    let isReject = false;
    //   结果数组
    let result = [];

    const next = () => {
      if (isReject) return;

      const nextItem = iterator.next();

      if (nextItem.done) {
        // 已经获取所有结果，退出
        if (resolveCount == 0) {
          resolve(result);
        }
        return;
      }
      // 计数加一
      const i = currentIndex++;
      resolveCount++;

      Promise.resolve(nextItem.value)
        // 这里mapper可能是一个promise函数，所以外面用Promise.resolve包装一下
        .then((element) => mapper(element, i))
        .then(
          (value) => {
            result[i] = value;
            resolveCount--;
            //   调用自身
            next();
          },
          (err) => {
            isReject = true;
            reject(err);
          }
        );
    };
    // 遍历数组，每个都执行一遍next
    for (let i = 0; i < iterable.length; i++) {
      next();
    }
  });
}
console.time("start1");

iterablePromiseArray(a, (e) => {
  _log(e);
  // 输出 2、4、1、5、3
  // 也可以return 一个Promise
  return e;
}).then((result) => {
  // [1,2,3,4,5]
  console.timeEnd("start1");
  console.log("result: ", result);
});
```
