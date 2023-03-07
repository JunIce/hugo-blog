---
title: "webpack 使用中常见问题"
date: 2022-02-21T21:32:05+08:00
draft: true
categories: ["webpack"]
---


### Type Error: this.getOptions is not a function For style-loader

`style-loader` 版本和`webpack`版本不匹配

可以通过`npm ls webpack`查看，如果显示`invalid`, 可以通过升级webpack

其次就是通过安装低版本`style-loader`


### Cannot add property htmlWebpackPluginAlterChunks, object is not extensible

`webpack`升级 v4 -> v5
升级`html-webpack-plugin` 到 v5版本


### this.getOptions is not a function

webpack中使用`source-map-loader`会报以下错误

```js
this.getOptions is not a function
```

https://webpack.js.org/migrate/5/#getoptions-method-for-loaders

webpack5中内置了utils

`source-map-loader`版本2.0以后就要升级到webpack5， webpack只能是`1.x.x`版本

```js
config.module.rules.push({
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    use: ['source-map-loader'],
    enforce: 'pre',
});
```