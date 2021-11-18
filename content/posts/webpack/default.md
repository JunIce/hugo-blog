---
title: "webpack5 基础配置"
date: 2021-10-30T15:33:17+08:00
draft: true
tags: ["webpack"]
---

## webpack 基础配置

### Entry

打包文件依赖入口

```js
module.exports = {
  entry: './path/to/my/entry/file.js',
};
```

当entry是个对象的时候

- `dependOn`: 当前入口文件的依赖，它会在当前文件之前加载完成
- `filename`: 指定当前输入文件的文件名
- `import`: 启动时需要加载的模块
- `library`: 当前入口打包成library
- `runtime`: 运行时chunk的名称
- `publicPath`: 指定生成的文件的浏览器路径

### Output

打包结果

```js
module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // path: 结果路径
    filename: 'my-first-webpack.bundle.js', // filename: 文件名
  },
};
```
- `filename`: '[name].js'
- `path`: __dirname + '/dist',


### Loaders

loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。


> test // 识别哪些文件可以被转换
> use // 使用哪些loader

```js
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js',
  },
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
};
```

### Plugins

执行更广泛的打包任务，类似打包优化、文件管理、环境变量注入

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```

### Mode

webpack运行模式`production`,`development`,`none`

### Browser Compatibility







