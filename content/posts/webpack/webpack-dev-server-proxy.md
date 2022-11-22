---
title: "webpack-dev-server proxy代理模块"
date: 2022-11-22T05:59:58+08:00
tags: ["webpack", "proxy"]
categories: ["webpack"]
draft: false

---



# webpack-dev-server proxy代理模块



接上篇研究vite的代理模块，我发现vite proxy部分使用的模块和平时webpack中代理使用的很多语法是一致的，那我就验证一下，究竟是不是使用的同一个东西



### webpack-dev-server

webpack在进行开发时，我们会进行配置

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b52176f4c54412fb9262fc5f2988f59~tplv-k3u1fbpfcp-watermark.image?)



`webpack`本身是没有`dev`服务的，`dev`服务是另一个库进行提供

也就是我们在初始化时安装的`webpack-dev-server`



> [webpack-dev-server/Server.js at master · webpack/webpack-dev-server (github.com)](https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js)



在仓库的Server.js的2181行开始进行配置代理服务，其中使用的也就是`http-proxy-middleware`这个库



以下是伪代码

```javascript
if (this.options.proxy) {
  const { createProxyMiddleware } = require("http-proxy-middleware");

  // 创建proxy上下文
  const getProxyMiddleware = (proxyConfig) => {
    if (proxyConfig.target) {
      const context = proxyConfig.context || proxyConfig.path;

      return createProxyMiddleware(
        /** @type {string} */ (context),
        proxyConfig
      );
    }

    if (proxyConfig.router) {
      return createProxyMiddleware(proxyConfig);
    }
  };
  
  // 这里proxy挂载在options上，是一个数组
  this.options.proxy.forEach((proxyConfigOrCallback) => {
    const handler = async (req, res, next) => {
      next();
    };

    middlewares.push({
      name: "http-proxy-middleware",
      middleware: handler,
    });

    middlewares.push({
      name: "http-proxy-middleware-error-handler",
      middleware: (error, req, res, next) => handler(req, res, next),
    });
  });

  middlewares.push({
    name: "webpack-dev-middleware",
    middleware: this.middleware,
  });
}

```



在初始化阶段，会把proxy下的所有配置都转换成数组形式

数组遍历创建代理上下文，通过`http-proxy-middleware`中暴露的方法`createProxyMiddleware`创建代理实例

最后所有的代理实例都会`push`到`middlewares`中统一注册



### http-proxy-middleware



回到`http-proxy-middleware`中

`createProxyMiddleware`中创建`HttpProxyMiddleware`实例

返回的是其中的`middleware`



```javascript
export function createProxyMiddleware(options: Options): RequestHandler {
  const { middleware } = new HttpProxyMiddleware(options);
  return middleware;
}
```



#### HttpProxyMiddleware



`HttpProxyMiddleware`在构造函数中创建了代理实例

```javascript
class HttpProxyMiddleware {
  constructor(options: Options) {
	// ...

    this.proxy = httpProxy.createProxyServer({});
	// ....
  }
}
```



我们再看这个`httpProxy`



其实就是社区库https://github.com/http-party/node-http-proxy



这里就发现和vite最终使用的是同一个，不过webpack中有个`http-proxy-middleware`包裹了一层，有些许不一样
