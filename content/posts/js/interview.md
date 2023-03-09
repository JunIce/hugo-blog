---
title: "Interview"
date: 2022-03-16T17:56:26+08:00
draft: true
---

# 面试八股文

## http2

1. 头部压缩， 使用 HPACK 算法对头部进行压缩，减少传输时间。**PACK** 中客户端和服务器都要维护一个索引表，请求头部不再发送**key-value**，直接发送索引下表
2. 引入头部帧和数据帧，使用二进制数据替代原来文本形式，将每个 http 请求都看成一个流，将 http 数据包分解成多个帧，实现多路复用

利用帧和流的方式解决 http1.1 的队头阻塞问题

![ab3b231e15184fd0bc29da0d1c4137cd.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bedd30bc5d04ddb8cab1a39ede60785~tplv-k3u1fbpfcp-watermark.image?)

## http3

在 HTTP/3 中，将弃用 TCP 协议，改为使用基于 UDP 协议的 QUIC 协议实现。

使用 TCP 协议进行数据传输会经过三次握手，在连接创建过程中，很多参数要被初始化，例如序号被初始化以保证按序传输和连接的强壮性，其目的是保证数传输和断开的可靠，确保所有数据都被完全传输。

**UDP 特点**

- 无需建立连接，因此 UDP 不会引入建立连接的时延；
- 没有 TCP 那么复杂的报头，例如重传、序列号等等；
- 速度快，但是不保证数据的完整性。

## typeof null == object

`typeof null`的结果是`object`。不同的对象在底层都表示为二进制，在 `JavaScript` 中二进制前三位都为 0 的话会被判断为 `object` 类型， `null` 的二进制表示是全 0，自然前三位也是 0，所以执行 `typeof` 时会返回 `object` 。

- **000**：对象，数据是对象的应用。
- **1**：整型，数据是 31 位带符号整数。
- **010**：双精度类型，数据是双精度数字。
- **100**：字符串，数据是字符串。
- **110**：布尔类型，数据是布尔值。

## 输入一个 URL 地址到浏览器完成渲染的整个过程

1. 浏览器输入地址，并回车
2. 浏览器查找当前 url 是否存在缓存，比对缓存是否过期
3. DNS 解析 url 对应 IP
4. 根据 ip 建立 tcp 连接
5. 发送 http 请求
6. 服务器处理请求，浏览器接收 HTTP 响应
7. 浏览器解析并渲染页面

## JavaScript 是按引用传递 pass-by-reference 还是按值传递 pass-by-value

```javascript
function changeStuff(a, b, c) {
  a = a * 10;
  b.item = "changed";
  c = { item: "changed" };
}

var num = 10;
var obj1 = { item: "unchanged" };
var obj2 = { item: "unchanged" };

changeStuff(num, obj1, obj2);

console.log(num); // 10
console.log(obj1.item); // changed
console.log(obj2.item); // unchanged
```

[https://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language?page=1&tab=scoredesc#tab-top](https://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language?page=1&tab=scoredesc#tab-top)

相反，实际情况是传入的项是按值传递的。但是按值传递的项本身就是一个引用。从技术上讲，这称为共享调用。

实际上，这意味着如果您更改参数本身(如num和obj2)，则不会影响输入参数的项。但是如果你改变了参数的内部结构，它就会向上传播(就像obj1一样)。
