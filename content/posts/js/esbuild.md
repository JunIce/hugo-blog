---
title: "esbuild api整理"
date: 2022-09-07T05:55:54+08:00
tags: ["esbuild", "vite"]
categories: ["js"]
draft: false
---



# esbuild



## 基础api



| option      | 类型    | 默认值       | 说明                                                         |
| ----------- | ------- | ------------ | ------------------------------------------------------------ |
| bundle      | boolean | false        | 把从入口开始的文件打包成一个bundle，设为true时，会把文件引用的其他文件也打包进来，默认为false，则不会打包其他引用文件 |
| define      | object  | {}           | 提供一种替换文件内常量的行为，可以用作替换环境变量           |
| entryPoints | array   | []           | 入口文件数组，可以有多个入口一起打包                         |
| external    | array   | []           | 排除打包的一些其他类库或者资源，可以使用通配符               |
| format      | string  | iife/cjs/esm | 最终打包出来的文件输出格式                                   |
| inject      | array   | []           | 可以用来注入一些跨平台时兼容的代码                           |
| loader      | object  | {}           | 引用资源也是采用loader的形式进行解析                         |
| minify      | boolean | false        | 是否压缩代码                                                 |
| outdir      | string  | ''           | 最后打包输出的目录                                           |
| outfile     | string  | ''           | 最终打包的bundle的文件名                                     |
| platform    | string  | node/browser | 最后打包输出的平台                                           |
| serve       | string  | ''           | 开发模式下用作实时响应文件变动，即时打包                     |
| sourcemap   | boolean | false        | 最后是否生成sourcemap文件                                    |
| splitting   | boolean | false        | 打包是否进行代码分割                                         |
| target      | array   | []           | `chrome`/ `edge`/ `firefox`/ `hermes`/ `ie`/ `ios`/ `node`/ `opera`/ `rhino`/ `safari` |
| watch       | boolean | false        | 文件监听模式                                                 |
| write       | boolean | false        | 是否写入到文件系统/输出到内存中                              |

