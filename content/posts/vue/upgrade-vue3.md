---
title: "vue2 升级vue3报错问题整理"
date: 2024-05-21T15:15:41+08:00
tags: ["vue3"]
categories: ["vue"]
draft: false
---

# vue2 升级 vue3 报错问题整理

## vite 路径别名

```js
resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
```

## Catch all routes (“\*”) must now be defined using a param with a custom regexp.

```js
{
     // 识别不到的path 自动调转404
     // vue2使用* vue3使用:pathMatch('*') 或者 :pathMatch('*')* 或者 :catchAll(.*)
    path: "/:catchAll(.*)",
    redirect: '/404',
},

```

## Module "path" has been externalized for browser compatibility. Cannot access "path.resolve" in client code.

- 安装`npm install path-browserify`

- 使用 `path-browserify` 代替 path 模块

- 不再使用`import path from 'path'`，改为`import path from 'path-browserify'`
