---
title: "import-html-entry js沙箱实现源码"
date: 2023-03-15T10:18:32+08:00
tags:
categories: ["import-html-entry"]
draft: false
---



# import-html-entry js沙箱实现



## getExecutableScript函数



- scriptText: 读取js文件的内容
- sourceUrl：用作sourcemap的指引



```js
;(function(window, self, globalThis){
	// scriptText
	 // sourceUrl
	})
.bind(window.proxy)(window.proxy, window.proxy, window.proxy);
```



内部实现其实就是拼接了一个自执行函数，最后使用eval执行该字符串达到函数执行的目的



仔细分析这个沙箱函数

- 第一步，声明一个函数，并且把代码放入函数内部执行，这里通过函数内部的作用域进行隔离
- 第二步： 通过bind函数改变上下文作用域`window.proxy`
- 第三步：执行该函数，传入三个参数`window.proxy`



这样函数体内部的window，其实是外部参数传入的window





为防止嵌套应用内部拿到的window执行错误问题



```js
// 通过这种方式获取全局 window，因为 script 也是在全局作用域下运行的，所以我们通过 window.proxy 绑定时也必须确保绑定到全局 window 上
	// 否则在嵌套场景下， window.proxy 设置的是内层应用的 window，而代码其实是在全局作用域运行的，会导致闭包里的 window.proxy 取的是最外层的微应用的 proxy
const globalWindow = (0, eval)('window');
globalWindow.proxy = proxy;
```



代码注释写的很明白



通过`eval('window')`拿到全局`window`





## Reference



[https://juejin.cn/post/7184419253087535165](https://juejin.cn/post/7184419253087535165)

[https://juejin.cn/post/7148075486403362846](https://juejin.cn/post/7148075486403362846)
