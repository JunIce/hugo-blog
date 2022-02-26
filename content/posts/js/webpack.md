---
title: "webpack 使用中常见问题"
date: 2022-02-21T21:32:05+08:00
draft: true
---


### Type Error: this.getOptions is not a function For style-loader

`style-loader` 版本和`webpack`版本不匹配

可以通过`npm ls webpack`查看，如果显示`invalid`, 可以通过升级webpack

其次就是通过安装低版本`style-loader`


### Cannot add property htmlWebpackPluginAlterChunks, object is not extensible

`webpack`升级 v4 -> v5
升级`html-webpack-plugin` 到 v5版本


