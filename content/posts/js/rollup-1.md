---
title: "Rollup -- javascript模块打包器整理"
date: 2022-07-23T08:35:32+08:00
tags:
categories: ["rollup"]
draft: false
---



# rollup



Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码



```javascript
npm install --global rollup
```



## Tree-shaking

在项目中使用es modules时，rollup会静态分析代码中引入代码，其中实际没有使用的代码在打包过程中被tree-shaking掉



## 打包能力

- 引入commonJs: 使用插件https://github.com/rollup/plugins/tree/master/packages/commonjs
- 引入esm文件

