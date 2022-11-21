---
title: "vite 代理中更改请求头问题"
date: 2022-11-21T06:13:23+08:00
tags: ["vite"]
categories: ["vite"]
draft: false
---





# vite配置代理中变更请求头



平时我们在对接接口时，我们都是配置代理解决跨域问题

```typescript
proxy: {
    '^/api': {
        target: envConfig.VITE_APP_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
    }
}
```



某天你明明配置好了代理，浏览器还是会有跨域问题报错



查看response header, 你会发现

```perl
Access-Control-Allow-Origin: *, * 
```

这里`Access-Control-Allow-Origin`不单是一个`*`



google后可以确定是这个请求头被设置了2次`*`

和后端反馈后，很久啥也没查出来，就是解决不了



那前端要怎么做呢？



### 思路1

在项目中重启一个node服务，再做一次转发，在转发的过程中重写这个response header解决跨域问题



1. 安装一个express
2. 安装cors中间件
3. 安装http-proxy-middleware进行代理转发



这里转发的时候不能说直接都转发了，你会发现还是有问题



```typescript
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  selfHandleResponse: true, 
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      res.removeHeader("Access-Control-Allow-Origin")
      res.setHeader("Access-Control-Allow-Origin", "*")
      return responseBuffer
  }),
});
```



这里一定要设置`selfHandleResponse`属性，相当于自定义返回结果



然后在监听`onProxyRes`回调函数的同时，使用`responseInterceptor`对返回进行拦截

`responseInterceptor`内部是一个异步函数，一定要使用`async`进行修改，不然你会发现修改的没有生效



但这样还是太烦了，你还要维护另一个服务，而且配置的自定义变量也不好使用了。。。



### 思路2

从vite本身的代理服务入手，你想vite这种级别的工具，这种口子应该留的呀



查询文档，没有细说，只能查到有个`configure`方法可以重写



打开vite源码找一找

源码中`server`下的`middleware`有个`proxy`, 就是代理中间件，就是我要找的



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec7dbaa374cc4305924efd30421bd6aa~tplv-k3u1fbpfcp-watermark.image?)

发现就是使用的一个社区库



[http-party/node-http-proxy: A full-featured http proxy for node.js (github.com)](https://github.com/http-party/node-http-proxy#options)



这个库最近更新3年前。。。



我们这里要覆盖response header

所以监听`proxyRes`方法，方法内进行操作`res`的headers



```typescript
server: {
  port: 3008,
  open: true,
  proxy: {
    '^/api': {
      target: envConfig.VITE_APP_BASE_URL,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
      selfHandleResponse: true,
      configure: (proxy, _options) => {
        proxy.on('proxyRes', (proxyRes, req, res) => {

          res.removeHeader("Access-Control-Allow-Origin")
          res.removeHeader("access-control-allow-origin")
          res.setHeader("Access-Control-Allow-Origin", "*")
          res.setHeader("content-type","application/json")

          proxyRes.pipe(res)
        });
      }
    },
  }
},
```



这样就可以解决返回头中多次设置`Access-Control-Allow-Origin`的问题



你学废了吗？
