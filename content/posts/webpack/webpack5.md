---
title: "webpack5学习笔记"
date: 2022-08-18T05:59:58+08:00
tags: ["webpack5"]
categories: ["webpack"]
draft: false

---

# webpack5学习笔记



## 配置

webpack.config.js

- 返回单个对象：最简单的配置
- 返回数组：每个数组项都会是一个完整的配置对象，都会触发一个单独的构建
- 返回函数：可以动态根据环境变量进行调整



### entry

入口文件，构建项目的必要条件

https://webpack.docschina.org/configuration/entry-context/

### output

构建结果输出配置

https://webpack.docschina.org/configuration/output/



### targets

构建环境配置





## 构建过程

webpack5 整个构建过程

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c945712eada54b6aae2f88e131729c7b~tplv-k3u1fbpfcp-watermark.image?)



## 缓存

`webpack5`中有一项重要的更新就是缓存，对于大型依赖构建的提速明显

### 开启缓存

配置`config`中的`cache`字段

```javascript
// webpack.config.js

module.exports = {
  // ...
  cache: {
    
  }
}

```



#### type

- memory 缓存到内存中
- filesystem 缓存到文件目录中

#### maxAge

缓存到系统中的有效时间，默认一个月



### 原理



webpack在构建打包的过程中，会有许多需要分析代码AST的工作，比如`babel-loder`、`ts-loader`、`eslint-loader`等操作， webpack5中会将上次构建的结果进行缓存，下次再需要构建结果时，会比对上次的结果，如果可以使用就会直接使用上次的结果，减少重复计算





## SplitChunksPlugin



SplitChunksPlugin是webpack提供的分包插件，可以配置**分包策略**决定最终的bundle产物



### splitChunks.chunks



- async表示只从异步加载得模块（动态加载import()）里面进行拆分
- initial表示只从入口模块进行拆分
- all表示以上两者都包括，优化效果最好



### splitChunks.minChunks



最小引用次数，将频繁引用的文件打包





