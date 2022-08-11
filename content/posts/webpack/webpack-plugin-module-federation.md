---
title: "webpack -- Module Federation 联邦模块"
date: 2022-04-23T20:17:44+08:00
draft: true
tags: ["webpack", "webpack plugin"]
categories: ["webpack"]
---



# Module Federation



[Module Federation官方文档](https://webpack.docschina.org/concepts/module-federation/#motivation)



webpack5中最重要的特性就是这个module federation, 即联邦模块



即一个javascript应用可以从另一个JavaScript应用中动态的加载模块， 同时共享依赖



![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cbc6f2233094483a6b90b2d42b63b9a~tplv-k3u1fbpfcp-watermark.image?)

## 使用



```javascript
const { ModuleFederationPlugin } = require("webpack").container;


//...

plugins: [
  new ModuleFederationPlugin({
    name: "app1", // 模块名字
    filename: "remoteEntry.js", // 入口文件名字
    
    exposes: { // 对外暴露组建的map
        "./NewsList": "./src/NewsList",
    },
    
    remotes: { // 远程依赖
      app2: "app2@http://localhost:3002/remoteEntry.js"
    },
    
    shared: { // 公共依赖
        "react": { singleton: true },
        "react-dom": { singleton: true }
    }
  })
]

```







### remotes



依赖的其他联邦模块组件，是一个对象

表示当前应用是一个 `Host`，可以引用 `remote` 中 `expose` 的模块。



### expose



可以把当前应用中的组件暴露出去



表示当前应用是一个 `Remote`，`exposes` 内的模块可以被其他的 `Host` 引用，引用方式为 `import(${name}/${expose})`。





### shared



表示依赖的公共模块，可以防止依赖冗余

- 要求两个应用使用 **版本号完全相同** 的依赖才能被复用



```javascript
1. 数组

shared: ["react", "react-dom"]


2. 对象

shared: {
  lodash: '^4.17.0',
}


3. 
const deps = require('./package.json').dependencies;

shared: {
    requiredVersion: deps.react,
    singleton: true,
}
```



#### singleton

Boolean. 仅允许共享范围内的单个版本的共享模块（默认禁用）



#### version

依赖的版本



#### eager

允许 webpack 直接打包该依赖库 —— 而不是通过异步请求获取库；



#### packageName

依赖library名字



#### requireVersion

依赖的需要的版本号



#### strictVersion

严格指定的依赖版本号





## 引用





[Webpack 5 Module Federation: JavaScript 架构的变革者](https://zhuanlan.zhihu.com/p/120462530)

[webpack 5 联邦模块介绍](https://zhuanlan.zhihu.com/p/148869581)

[[Webpack5 跨应用代码共享 - Module Federation](https://segmentfault.com/a/1190000024449390)](https://zhuanlan.zhihu.com/p/120462530)
