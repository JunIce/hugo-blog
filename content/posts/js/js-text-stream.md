---
title: "Js Text Stream"
date: 2021-12-19T11:43:25+08:00
draft: true
---


## TextEncoder

输出`utf-8`字节流

```js
var encoder = new TextEncoder()
encoder.encode("中") //Uint8Array(3) [228, 184, 173]
```

这里可以看到 中文在`utf8`中，一个中文3个字节


## TextDecoder

实例提供decode方法，把字节流反编译成代码点

```js
var decoder = new TextDecoder()
var buffer = new Uint8Array([228, 184, 173])
decoder.decode(buffer) // 中
```