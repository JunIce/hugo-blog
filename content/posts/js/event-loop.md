---
title: "js Event Loop 事件循环执行机制"
date: 2022-05-04T09:24:26+08:00
tags:
categories:
draft: false

---



## Javascript engine list



[v8引擎高效原因](https://blog.sessionstack.com/how-javascript-works-inside-the-v8-engine-5-tips-on-how-to-write-optimized-code-ac089e62b12e)



- [**V8**](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)) — open source, developed by Google, written in C++
- [**Rhino**](https://en.wikipedia.org/wiki/Rhino_(JavaScript_engine)) — managed by the Mozilla Foundation, open source, developed entirely in Java
- [**SpiderMonkey**](https://en.wikipedia.org/wiki/SpiderMonkey_(JavaScript_engine)) — the first JavaScript engine, which back in the days powered Netscape Navigator, and today powers Firefox
- [**JavaScriptCore**](https://en.wikipedia.org/wiki/JavaScriptCore) — open source, marketed as Nitro and developed by Apple for Safari
- [**KJS**](https://en.wikipedia.org/wiki/KJS_(KDE)) — KDE’s engine originally developed by Harri Porten for the KDE project’s Konqueror web browser
- [**Chakra** (JScript9)](https://en.wikipedia.org/wiki/Chakra_(JScript_engine)) — Internet Explorer
- [**Chakra** (JavaScript)](https://en.wikipedia.org/wiki/Chakra_(JavaScript_engine)) — Microsoft Edge
- [**Nashorn**](https://en.wikipedia.org/wiki/Nashorn_(JavaScript_engine)), open source as part of OpenJDK, written by Oracle Java Languages and Tool Group
- [**JerryScript**](https://en.wikipedia.org/wiki/JerryScript) — is a lightweight engine for the Internet of Things.





V8把JavaScript代码编译成机器码，而不是使用解释器. 

它通过像许多现代 JavaScript 引擎（例如 SpiderMonkey 或 Rhino (Mozilla)）一样实现 JIT（即时）编译器，在执行时将 JavaScript 代码编译成机器代码

v8不生成任何字节码或者其他中间代码



## 异步（asynchronous     [eɪˈsɪŋkrənəs]）执行运行机制



- 所有同步任务都在主线程上执行，形成一个执行栈
- 主线程之外还存在一个任务队列，异步任务有了结果，就会在任务队列中放置一个事件
- 同步任务执行完毕后，系统就会读取任务队列中的任务



### 宏任务

- I/O
- setTimeout
- setInterval
- setImmediate(node.js)
- requestAnimationFrame



### 微任务

- Promise.then

- process.nextTick(node.js)
- MutationObserver



### Node.js中的Event Loop



`Node.js`采用v8作为js的解析引擎，I/O处理方面采用`libuv`

运行机制：

1. v8解析javascript脚本文件
2. 调用Node API
3. libuv负责Node API的执行。把任务分配给不同的线程，形成EventLoop, 把结果以异步的方式返回给v8引擎
4. v8把结果返回给用户



#### nodejs的event loop分为6个阶段

1. timers：执行setTimeout() 和 setInterval()中到期的callback。
2. I/O callbacks：上一轮循环中有少数的 I/O callback 会被延迟到这一轮的这一阶段执行
3. idle, prepare：队列的移动，仅内部使用
4. poll：最为重要的阶段，执行I/O callback，在适当的条件下会阻塞在这个阶段
5. check：执行setImmediate的callback
6. close callbacks：执行close事件的callback，例如socket.on("close",func)



#### 注意点

- **每个阶段完成后，都会执行清空微任务队列**
- **timers阶段执行创建的setImmediate事件，会在本轮循环的check阶段执行完毕，而timers阶段创建的setTimeout事件，会进入下轮循环执行**
- **Node中同个MicroTask队列下， process.nextTick比Promise更加优先**



![690666428-5ab0a22b5cbca_fix732.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ff9224bce9d45288c493e78782b46ba~tplv-k3u1fbpfcp-watermark.image?)







## 事件循环执行代码解析



```typescript

let count = 0;

(function(count) {
    console.log('count1:', count);
    a(++count)
    console.log('count1-1:',count);
})(count)

async function a(count) {
    console.log('count2:', count);
    await b(count++)
    console.log('count3:', count);
}


async function b(count) {
    console.log('count4:', count);
}


new Promise((resolve) => {
    console.log('count6:', count);
    resolve(count++)
}).then(count => {
    console.log('count7:', count);
})


setTimeout(() => {
    console.log('count8:', count);
    Promise.resolve().then(() => {
        console.log('count8-1', count);
    })
})


console.log('count9:', count);
```





1. 开头是一个自执行函数， 执行到`count1`
2. a函数调用 `count2`
3. a里面调用b，b是一个异步函数，这里b会执行 `count4`
4. 回到a函数， `count3`推送微任务队列
5. 回到一开始的自执行函数，往下执行 `count1-1`
6. 自执行函数同步任务执行完毕，主任务同步任务执行
7. 执行到new Promise
8. `count6`打印， then方法推到微任务队列
9. 往下执行，一个setTimeout推入宏任务队列
10. `count9`打印
11. 微任务队列执行，先入先出原则
12. 执行`count3`
13. 执行`count7`
14. 宏任务队列执行
15. 执行`count8`,宏任务重产生微任务
16. 清空微任务，打印`count8-1`





### 引用



https://blog.sessionstack.com/how-javascript-works-inside-the-v8-engine-5-tips-on-how-to-write-optimized-code-ac089e62b12e