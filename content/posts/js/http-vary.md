---
title: "HTTP Response Header vary 解读"
date: 2022-02-11T14:52:14+08:00
draft: true
---

# HTTP Vary

在调试一个接口时，看到`Response Header` 中有这么一段

```sh
vary: Origin;
vary: Access - Control - Request - Method;
vary: Access - Control - Request - Headers;
```

## vary

`content negotiation` 内容协商

在客户端向服务端发送请求的时候，我们在`Request Headers` 中可以找到

```sh
accept: application/json, text/plain, */*
accept-encoding: gzip, deflate, br
accept-language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6
```

其中`Accept`分别代表的含义

| 请求头字段     | 说明                       | 响应头字段      |
| -------------- | -------------------------- | --------------- |
| Accept         | 告知服务器发送何种媒体类型 | ContentType     |
| AcceptLanguage | 告知服务器发送何种语言     | ContentLanguage |
| AcceptCharset  | 告知服务器发送何种字符集   | ContentType     |
| AcceptEncoding | 告知服务器采用何种压缩方式 | ContentEncoding |

`Accept`其实就是告诉服务端，客户端可以接受的格式、类型、压缩方式

所以如果服务端提供的内容是取决于请求头中的`Origin`字段，那么在`Response Header`中就会出现

> Vary: Origin（为什么要包含这个头部，因为请求头中的 Origin 头部代表了该请求来源的具体域名信息，那么对于不同域名网站所发起的请求，会使用仅属于它本身的缓存。）

如果有多个字段，例如

> vary: User-Agent,Cookie

则表示服务端返回的内容是基于`User-Agent`和`Cookie`请求头来生成的

## 原理

根据vary标头指示值提供给客户端不同的缓存版本。

## 使用场景

### 动态服务

举例web中 不同的浏览器对于webp的支持程度不同， 则可以在请求中`Accept`中可以读取到客户端是否支持`webp`格式，
如果支持则返回`webp`，如果不支持则返回正常图片


# Client Hints

HTTP Client Hints 之后，浏览器在页面发起子资源请求时，会通过新增的一系列头部字段带上分辨率、设备像素比、图片宽度等信息。

## 开启方式

`Response Header` 中返回


- DPR 页面分辨率比例

Device pixel ratio, the pixel density of the screen (might vary if the user has multiple screens)

- Save-Data  on/off 

Save-Data请求头字段是一个布尔值，在请求中，表示客户端对减少数据使用量的偏好。 这可能是传输成本高，连接速度慢等原因。

值为on时，明确表示用户选择使用客户端简化数据使用模式，并且当与源进行通信时允许他们提供替代内容以减少下载的数据，例如较小的图像和视频资源，不同的标记和样式，禁用轮询和自动更新等。
Whether the user has enabled data-saving mode

- Viewport-Width 

Pixel width of the current viewport

- Width  物理像素

Desired resource width in physical pixels


> Accept-CH: Width, Downlink, Sec-CH-UA

或

```html
<meta http-equiv="Accept-CH" content="Width, Downlink, Sec-CH-UA">
```


```http
BASHAccept: image/webp,image/*,*/*;q=0.8
Accept-Encoding: gzip, deflate, sdch
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,en-US;q=0.4,ja;q=0.2,de;q=0.2,zh-TW;q=0.2,cs;q=0.2,pt;q=0.2,ko;q=0.2
Connection: keep-alive
DPR: 2 // 分辨率比例
Host: qgy18.imququ.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.13 Safari/537.36
Viewport-Width: 1280  // 页面宽度
Width: 128 // 物理宽度
```













