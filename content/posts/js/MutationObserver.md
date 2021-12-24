---
title: "MutationObserver 解析及使用场景"
date: 2021-12-23T16:02:06+08:00
draft: true
---

## MutationObserver

动态监听dom元素的变化

[`MutationObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver) 接口提供了监视对 DOM 树所做更改的能力。它被设计为旧的 Mutation Events 功能的替代品，该功能是 DOM3 Events 规范的一部分。

```js
const cb = (mutations) => {
  mutations.forEach((element) => {
    console.log(element);
  });
};

var observer = new MutationObserver(cb);

observer.observe(el, {
  subtree: true,
  attributes: true,
  childList: true,  
});
```

### observer

开始监听调用方法

- el， 需要监听的dom对象
- options 
    - subtree `boolean` 元素下的所有子节点的添加删除、属性变化等
    - attributes `boolean` 属性变化
    - attributeFilter `array` 需要筛选的属性值数组
    - attributeOldValue `boolean` 属性变化的旧值
    - childList `boolean` 子孙节点的添加或删除
    - characterData `boolean` 节点中值的变化监听
    - characterDataOldValue `boolean` 节点中值的变化监听

### disconnect

手动取消监听

### takeRecords

获取所有已变更列表，但是还没有被回调函数调用的记录， 并清空之前的记录
此方法最常见的使用场景是在断开观察者之前立即获取所有未处理的更改记录，以便在停止观察者时可以处理任何未处理的更改。


## 使用

- 监听Dom变化

- 使用其执行微任务

`observer` 和 `Promise.then`一样，属于`micro task`

`Vue nextTick`源码中使用方式



```js
let callbacks = []

function flushCallback() {
  let copys = callbacks.copy(); // copy arrays

  let fn = copys.shift()

  while(copys.length > 0) {
    fn()
  }
}

let runFunc = () => {}

if(hasPromise) { // 如果有Promise， 优先使用Promsie

  let p = Promise.resolve()

  runFunc = () => {
    p.then(flushCallback)
  }
}
else if(hasMutationObserver) { // 如果有MutationObserver

  let count = 1

  let el = document.createTextNode(String(count))
  let o = new MutationObserver(flushCallback)
  o.observer(el, {
    characterData: true // 监听字符变化
  })
  
  runFunc = () => {
    count = (count + 1) % 2
    el.data = String(count) // 改变字符，以触发执行微任务
  }
}

// ....

const nextTick = (fn, ctx) => {

  callbacks.push(() => {
    // 更改调用上下文
    fn.call(ctx)
  })

  runFunc()
}
```

其内部实现，其实就是微任务的执行机制


