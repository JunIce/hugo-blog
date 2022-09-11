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




| option            | 类型    | 默认值 | 说明                                                         |
| ----------------- | ------- | ------ | ------------------------------------------------------------ |
| analyze           |         |        | bundle分析功能                                               |
| assetNames        |         |        | 引用的静态资源的重新命名                                     |
| banner            |         |        | 不同资源添加不同的**顶部**注释代码                           |
| charset           | string  | ascII  | 输出文件的字符编码                                           |
| chunkNames        | string  |        | 输出bundle的文件名, 于此同时需要打开splitting, 设置format为esm |
| color             | string  |        | 控制台输出是否带颜色标识                                     |
| drop              | []      |        | 是否丢弃debugger和console                                    |
| footer            | string  |        | 不同资源添加不同的**底部**注释代码                           |
| globalName        | string  |        | iife模式下挂载全局变量的名称                                 |
| ignoreAnnotations | boolean |        | 是否忽略tree-shaking默认注解                                 |
| jsx               | string  |        | 编译jsx语法的能力                                            |



## 内置loader

已经内置的loader包括以下几种

- js 
- ts/tsx
- jsx
- json
- css
- text // 读取文本字符串
- binary // 二进制文件以Uint8Array引入
- base64 // base64形式
- dataurl // 图片文件以base64的形式插入到js中
- file // 文件
- copy // 复制



## 插件

社区插件生态

https://github.com/esbuild/community-plugins









## option案例




### analyze

esbuild 分析模式

```javascript

(async () => {
  let esbuild = require('esbuild')

  // 打包结果
  let result = await esbuild.build({
    entryPoints: ['example.jsx'],
    outfile: 'out.js',
    minify: true,
    metafile: true,
  })

  // 使用analyzeMetafile API进行分析
  let text = await esbuild.analyzeMetafile(result.metafile, {
    verbose: true,
  })
  console.log(text)
})()

```



### assetNames

静态资源的重新命名

```javascript
require('esbuild').buildSync({
  entryPoints: ['app.js'],
  assetNames: 'assets/[name]-[hash]',
  loader: { '.png': 'file' },
  bundle: true,
  outdir: 'out',
})
```



### banner

```javascript
require('esbuild').buildSync({
  entryPoints: ['app.js'],
  banner: {
    js: '//comment',
    css: '/*comment*/',
  },
  outfile: 'out.js',
})
```



### chunkNames

输出的chunk的重新命名

```javascript
require('esbuild').buildSync({
  entryPoints: ['app.js'],
  chunkNames: 'chunks/[name]-[hash]',
  bundle: true,
  outdir: 'out',
  splitting: true, // 必须设置
  format: 'esm',// 必须设置
})
```



### color

输出的日志是否带颜色标识

```javascript
require('esbuild').transformSync(js, {
  color: true,
})
```



### drop

```javascript
require('esbuild').buildSync({
  entryPoints: ['app.js'],
  drop: ['console', 'debugger'],
})
```



### globalName

```javascript
let js = 'module.exports = "test"'
require('esbuild').transformSync(js, {
  format: 'iife',
  globalName: 'xyz',
})
```



### ignoreAnnotations

忽略注解

默认情况下

- 行内的`/* @__PURE__ */`注释告诉esbuild，当代码中没有使用到该函数时，就可以被移除掉
- `package.json`中配置的`sideEffects`告诉编译器，当文件引入后没有被使用时，就不会被打包到bundle中去



当打开忽略注解后，esbuild编译器就会忽略上面的配置注解，自动分析打包



### jsx

告诉编译器编译jsx语法的能力

- transform
- preserve
- automatic

```javascript
require('esbuild').transformSync('<div/>', {
  jsx: 'preserve',
  loader: 'jsx',
})
```



### jsx factory

设置`jsx`编译后的方法名

默认`jsx`元素会被编译成`React.createElement`元素



```javascript
<div>Example text</div>

// ==
// 编译后结果
React.createElement("div", null, "Example text");
```



或者在transform的时候设置

```javascript
require("esbuild").transformSync("<div/>", {
  jsxFactory: "h",
  loader: "jsx"
})
```



如果是在使用typescript开发，可以设置`tsconfig.json`

```json
{
  "compilerOptions": {
    "jsxFactory": "h"
  }
}
```



或者在使用时添加注释 `// @jsx h`





### Pure

特殊注释`/* @__PURE__ */` 或者 `/* #__PURE__ */`是用来标注特殊函数，在打包时可以进行优化，如果没有使用到这个函数，就不会最终打包到bundle中



### Tree shaking

摇树优化

当项目中有相应的函数没有被使用到时，编译器在打包的时候会对函数进行搜集，如果没有使用到最终会被移除出bundle



esbuild的tree shaking依赖于es6的 import 和 export语法， CommonJS模块就不能支持Tree shaking

默认esbuild的tree shaking只有在format为iife的情况下才是打开的，其他模式下都是关闭的，可以手动设置为true

```javascript
require('esbuild').buildSync({
  entryPoints: ['app.js'],
  treeShaking: true,
  outfile: 'out.js',
})
```

