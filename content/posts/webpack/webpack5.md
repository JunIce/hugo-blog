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



## context

webpack解析的基础目录



## entry

> { [key]: string }

webpack解析的入口文件



### entry[key].import

引入文件

### entry[key].filename

指定最终输出的bundle的文件名

### entry[key].dependOn

依赖的chunk模块名称，可以是一个字符串或者字符串数组

### entry[key].chunkLoading



### entry[key].asyncChunks

创建一个异步加载模块

### entry[key].layer



### 动态入口

动态入口，可以传入一个函数，或者返回一个Promise





## mode

webpack的打包模式`development | production | none`



## output

最终bundle输出配置

### output.assetModuleFilename

`string = '[hash][ext][query]'`

静态文件名的输出规则



### output.asyncChunks

异步加载的chunk，默认true



### output.auxiliaryComment

导出时插入对应的注释，配合`output.library`和`output.libraryTarget`一起使用



### output.charset

兼融非现代浏览器，`script`上加上`utf-8`表示



### output.chunkFilename

非入口的chunk文件命名规则，默认`[id].js`



### output.chunkFormat

chunk的输出格式, 默认false

`string: 'array-push' | 'commonjs' | 'module' | <any string>`



### output.chunkLoadTimeout

chunk 请求到期之前的毫秒数，默认为 120000



### output.chunkLoadingGlobal

加载 chunk 的全局变量, 默认`string = 'webpackChunkwebpack'`



### output.chunkLoading

加载chunk的方法

`string: 'jsonp' | 'import-scripts' | 'require' | 'async-node' | 'import' | <any string>`



### output.clean

配置webpack打包生成文件之前的操作，是否清除output目录

`boolean` `{ dry?: boolean, keep?: RegExp | string | ((filename: string) => boolean) }`



### output.compareBeforeEmit

检查输入目录中是否有相同的文件，有就不再重新生成，默认true，



### output.crossOriginLoading

是否启用跨域加载chunk，通过`jsonp`的形式添加脚本，默认false



### output.devtoolFallbackModuleFilenameTemplate

//



### output.devtoolModuleFilenameTemplate

//



### output.devtoolNamespace

//



### output.enabledChunkLoadingTypes

允许入口点使用的 chunk 加载类型列表。



### output.enabledLibraryTypes



### output.filename

输出 bundle 的名称



| 模板       | 描述                                                         |
| :--------- | :----------------------------------------------------------- |
| [file]     | filename 和路径，不含 query 或 fragment                      |
| [query]    | 带前缀 `?` 的 query                                          |
| [fragment] | 带前缀 `#` 的 fragment                                       |
| [base]     | 只有 filename（包含扩展名），不含 path                       |
| [filebase] | 同上，但已弃用                                               |
| [path]     | 只有 path，不含 filename                                     |
| [name]     | 只有 filename，不含扩展名或 path                             |
| [ext]      | 带前缀 `.` 的扩展名（对 [output.filename](https://webpack.docschina.org/configuration/output/#outputfilename) 不可用） |



### output.globalObject

输出library时，注册到全局对象的this， 默认self



### output.hashDigest

生成 hash 时使用的编码方式



### output.hashDigestLength

散列摘要的前缀长度。默认20



### output.hashFunction

散列算法，默认'md4'



### output.hashSalt

默认加盐值



### output.hotUpdateChunkFilename

自定义热更新 chunk 的文件名。默认`[id].[fullhash].hot-update.js`



### output.hotUpdateGlobal

只在 [`target`](https://webpack.docschina.org/configuration/target/) 设置为 `'web'` 时使用，用于加载热更新(hot update)的 JSONP 函数。



### output.hotUpdateMainFilename

自定义热更新的主文件名(main filename)。`[fullhash]` 和 `[runtime]` 均可作为占位符。

默认`[runtime].[fullhash].hot-update.json`



### output.iife

是否输出自执行代码



### output.importFunctionName

内部`import`的名称



### output.library

输出一个库

#### output.library.name

库名字

#### output.library.type

库类型，类型默认包括 `'var'`、`'module'`、`'assign'`、`'assign-properties'`、`'this'`、`'window'`、`'self'`、`'global'`、`'commonjs'`、`'commonjs2'`、`'commonjs-module'`、`'commonjs-static'`、`'amd'`、`'amd-require'`、`'umd'`、`'umd2'`、`'jsonp'` 以及 `'system'`，除此之外也可以通过插件添加。

#### output.library.export

指定哪一个导出应该被暴露为一个库。

#### output.library.auxiliaryComment

库添加的注释

#### output.library.umdNamedDefine

当使用 `output.library.type: "umd"` 时，将 `output.library.umdNamedDefine` 设置为 `true` 将会把 AMD 模块命名为 UMD 构建。否则使用匿名 `define`。



### output.libraryTarget

- var: 暴露为一个变量
- assign: 产生一个隐含的全局变量，可能会潜在地重新分配到全局中已存在的值
- assign-properities: 如果目标对象存在，则复制到目标对象上，否则会创建目标
- this: 最终赋值到this上
- window: 分配到window上
- global: 分配到global上
- commonjs: 分配给exports对象
- module: 输出es模块
- commonjs2: 输出给module.exports对象
- amd： 输出为amd模块
- umd：暴露为所有模块都可以使用的形式
- system： 这将暴露你的 library 作为一个由 [`System.register`](https://github.com/systemjs/systemjs/blob/master/docs/system-register.md) 的模块
- jsonp: 将入口文件最终包裹到一个jsonp容器中



### output.module

以模块类型输出 JavaScript 文件，默认false



### output.path

输出目录，默认`path.join(process.cwd(), 'dist')`



### output.pathinfo

是否打印模块信息，默认true



### output.publicPath

以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 为前缀



### output.scriptType

这个配置项允许使用自定义 script 类型加载异步 chunk，默认false









