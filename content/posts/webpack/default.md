---
title: "webpack5 基础配置"
date: 2021-10-30T15:33:17+08:00
draft: true
---

## webpack 基础配置

### Entry

打包文件依赖入口

```js
module.exports = {
  entry: './path/to/my/entry/file.js',
};
```

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







