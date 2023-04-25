---
title: "浏览器工作原理"
date: 2023-04-21T21:32:35+08:00
tags: ["工作原理"]
categories: ["浏览器"]
draft: false
---





# 浏览器工作原理



Web 性能包含了服务器请求和响应、加载、执行脚本、渲染、布局和绘制每个像素到屏幕上。





## 地址栏输入一个 URL

1. DNS服务器查询对应IP服务器，如果缓存中没有就进行缓存，缓存中存在则直接从缓存中取出





## TCP握手



与目标服务器建立连接



其中3次握手完成连接建立



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3e14b0c44934511b6ead5f63d6d75b4~tplv-k3u1fbpfcp-watermark.image?)



## TSL协商 （SSL 握手）



如果是https，还需要进行TSL协商

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d52b48f31a964f9db89f6912882ae4ae~tplv-k3u1fbpfcp-watermark.image?)





到此**浏览器**才和**服务器**建立**连接**



## 获取HTML内容



发出http get请求，获取到html内容







## 解析html内容



解析html内容，生成对应的`DOM`树和`CSSOM`树



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b538c909a025402f8b93baf7503ef1a0~tplv-k3u1fbpfcp-watermark.image?)





- 构建DOM树：DOM树是增量的
- 构建CSSOM树：CSSOM树是阻塞渲染的，因为规则可以被覆盖，所以要等到所有CSSOM完成
- 构建Render树（DOM和CSSOM结合成render树）只包括可见信息
- 确定Layout布局：确定节点宽高、对象大小和位置（节点数越多，布局就更耗时）
- Paint： 绘制到屏幕上





### JavaScript编译

`Javascript`下载后，浏览器使用抽象语法树传递到解释器中，输出到主线程上执行的字节码。





## script中`defer`和`async`



### async

- 不能保证多个async脚本的执行顺序
- 可能会中断DOM构建（如果HTML解析器还在执行，但是脚本已经下载完了，会先执行脚本，阻塞解析器继续执行，知道脚本执行完毕）



### defer

- 在html解析完全完成之后才会执行，`DOMContentLoaded`之前执行
- 可以保证顺序，不会阻塞解析器



