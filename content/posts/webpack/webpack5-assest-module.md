---
title: "Webpack5 -- Assest Module"
date: 2022-08-11T19:54:23+08:00
tags:
categories: ["webpack"]
draft: false
---



# Webpack5 -- Assest Module



Assest Module是webpack中加载静态资源的模块，webpack实现一个打包器就是可以把在js中引用的任何资源进行打包，其中就包括很多静态资源，比如引用的图片、字体等





在webpack5之前的版本使用以下loader加载资源

- `raw-loader` 把资源读取成字符串
- `url-loader`  把文件编码成base64的形式插入到代码中
- `file-loader` 把资源读取成url链接并且复制到输出目录中



### 语法



webpack5中对assest module进行了优化，增加了以下几种类型

- `asset/resource`  加载资源，和`file-loader`类似
- `asset/inline` 行内插入，和`url-loader`类似
- `asset/source` 资源读取，和`raw-loader`类似
- `asset` 自动读取资源，会根据资源的大小自动判断，类似`url-loader`



当你在webpack5中使用旧的loader时，需要设置`javascript/auto`以防止重复加载资源



```javascript
module.exports = {
  module: {
   rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            }
          },
        ],
       type: 'javascript/auto'
      },
   ]
  },
}
```



当需要排除来自资源加载器的新url请求时，需要加上`{not: ['url']}`



```javascript
{
    test: /\.(png|jpg|gif)$/i,
    dependency: { not: ['url'] },
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
}
```



### 自定义输出文件名



默认以` [hash][ext][query]`的形式进行输出

可以通过修改`output.assetModuleFilename`



```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.png/,
        type: 'asset/resource'
     }
     },
     {
       test: /\.html/,
       type: 'asset/resource',
       generator: {
         filename: 'static/[hash][ext][query]'
       }
     }
    ]
  },
};
```



通过设置`rules.generator.filename`可以单独配置某一个类型的资源的输出目录



其中`generator`也可以是一个函数

```javascript
generator: {
 dataUrl: content => {
   content = content.toString();
   return svgToMiniDataURI(content);
 }
}
```





控制引入资源大小的临界值,

默认资源小于**8kb**时，以`inline`形式引入， 否则以`url`的形式引入

```javascript
{
        test: /\.txt/,
        type: 'asset',
        parser: {
           dataUrlCondition: {
             maxSize: 4 * 1024 // 4kb
           }
        }
}
```



### 替换行内加载语法



为了兼容旧的loaders，可以使用新的行内加载语法

```javascript
import myModule from 'my-module?raw';

module: {
    rules: [
    // ...
     {
       resourceQuery: /raw/,
       type: 'asset/source',
     }
    ]
  },
```



