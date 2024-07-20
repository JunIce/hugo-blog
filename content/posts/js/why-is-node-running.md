---
title: "why-is-node-running"
date: 2024-07-20T09:35:32+08:00
tags: ["node"]
categories: ["js"]
draft: false
---



# why-is-node-running 为什么一个Node.js进程没有退出



[why-is-node-running (Github) ](https://github.com/mafintosh/why-is-node-running/tree/master) 用于诊断为什么一个Node.js进程没有退出。当你运行一个Node.js应用并且没有及时退出时，这个工具可以找出原因。



`demo.js`

```js
function startServer () {
  const server = createServer()
  setInterval(() => {}, 1000)
  server.listen(0)
}

startServer()
startServer()

// logs out active handles that are keeping node running
setImmediate(() => whyIsNodeRunning())
```

结果输出

```bash
$ node example.js 
TCPSERVERWRAP created
TCPSERVERWRAP created
There are 6 handle(s) keeping the process running.

# Timeout
example.js:6  - setInterval(() => {}, 1000)
example.js:10 - startServer()

# TTYWRAP
index.js:20 - console.info(`TCPSERVERWRAP created`);

# TTYWRAP
(unknown stack trace)

# TCPSERVERWRAP
example.js:7  - server.listen(0)
example.js:10 - startServer()

# Timeout
example.js:6  - setInterval(() => {}, 1000)
example.js:11 - startServer()

# TCPSERVERWRAP
example.js:7  - server.listen(0)
example.js:11 - startServer()
```



## 安装

```js
npm i -D why-is-node-running
```



## 使用



### 命令行使用

```
why-is-node-running jsfile.js
```

或者使用node的`--import`属性提前预加载

```bash
node --import why-is-node-running/include /path/to/some/file.js
```



## 源码



### createHook



`async_hooks`是Node.js提供的一种机制，用于监控异步资源的生命周期，在异步操作开始和结束时执行回调，这在调试、性能分析和资源管理等方面非常有用。


`async_hooks`通过统一的接口，使开发者能够注册回调函数，这些回调函数会在异步操作的不同阶段被调用，如初始化（init）、前向（before）、后向（after）、承诺解析（promiseResolve）和销毁（destroy）。

```js
const async_hooks = require('async_hooks');

const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    console.log(`Async operation started: ${type}`);
  },
  before(asyncId) {
    console.log(`Before async operation with id: ${asyncId}`);
  },
  after(asyncId) {
    console.log(`After async operation with id: ${asyncId}`);
  },
  destroy(asyncId) {
    console.log(`Async operation destroyed: ${asyncId}`);
  }
});

// 启用hook
hook.enable();
```


当异步操作发生时，回调会被调用，提供有关操作的信息，如类型、触发它的异步ID以及资源本身


```js
init (asyncId, type, triggerAsyncId, resource) {
    if (IGNORED_TYPES.includes(type)) {
      return
    }
  
    const stacks = captureStackTraces().slice(1)
    asyncResources.set(asyncId, {
      type,
      resource,
      stacks
    })
},
destroy (asyncId) {
    asyncResources.delete(asyncId)
}
```

源码中忽略了以下类型，通过一个Map搜集堆栈信息

```js
const IGNORED_TYPES = [
  'TIMERWRAP',
  'PROMISE',
  'PerformanceObserver',
  'RANDOMBYTESREQUEST'
]
```

这里重写了获取堆栈信息的方法，通过v8内置方法代理把堆栈对象输出
用于捕获当前JavaScript执行环境的调用栈轨迹。它通过暂时替换`Error.prepareStackTrace`方法，使用`Error.captureStackTrace`方法为目标对象`target`生成调用栈轨迹，最后恢复原先的`Error.prepareStackTrace`方法。返回值是捕获到的调用栈轨迹。

```js
// See: https://v8.dev/docs/stack-trace-api
function captureStackTraces () {
  const target = {}
  const original = Error.prepareStackTrace

  Error.prepareStackTrace = (error, stackTraces) => stackTraces
  Error.captureStackTrace(target, captureStackTraces)

  const capturedTraces = target.stack
  Error.prepareStackTrace = original
  return capturedTraces
}
```

- 运行之前先关闭
- 打印堆栈信息

```js
function whyIsNodeRunning (logger = console) {
  hook.disable()

  const activeAsyncResources = Array.from(asyncResources.values())
    .filter(({ resource }) => resource.hasRef?.() ?? true)

  logger.error(`There are ${activeAsyncResources.length} handle(s) keeping the process running.`)

  for (const asyncResource of activeAsyncResources) {
    printStacks(asyncResource, logger)
  }
}
```