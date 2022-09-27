---
title: "tsc 和 babel 编译typescript区别"
date: 2022-09-27T19:54:23+08:00
tags: ["typescript"]
categories: ["typescript"]
draft: false
---





## babel 和 tsc 编译typescript异同点



### 总结

- babel 和 tsc 的编译流程大同小异，都有把源码转换成 AST 的 Parser，都会做语义分析（作用域分析）和 AST 的 transform，最后都会用 Generator（或者 Emitter）把 AST 打印成目标代码并生成 sourcemap。
- 但是 babel 不做类型检查，也不会生成 d.ts 文件。





tsc 默认支持最新的 es 规范的语法和一些还在草案阶段的语法（比如 decorators），想支持新语法就要升级 tsc 的版本。

babel 是通过 @babel/preset-env 按照目标环境 targets 的配置自动引入需要用到的插件来支持标准语法，对于还在草案阶段的语法需要单独引入 @babel/proposal-xx 的插件来支持。

所以如果你只用标准语法，那用 tsc 或者 babel 都行，但是如果你想用一些草案阶段的语法，tsc 可能很多都不支持，而 babel 却可以引入 @babel/poposal-xx 的插件来支持。

从支持的语法特性上来说，babel 更多一些。



- tsc 生成的代码没有做 polyfill 的处理， 需要入口处引用`core-js`
- babel 的 @babel/preset-env 可以根据 targets 的配置来自动引入需要的插件，引入需要用到的 core-js 模块
  - 通过 useBuiltIns 来配置
  - babel 会注入一些 helper 代码，可以通过 @babel/plugin-transform-runtime 插件抽离出来，从 @babel/runtime 包引入
- **tsc 生成的代码没有做 polyfill 的处理，需要全量引入 core-js，而 babel 则可以用 @babel/preset-env 根据 targets 的配置来按需引入 core-js 的部分模块，所以生成的代码体积更小。**



### babel 不支持的 ts 语法

- const enum 不支持
-  不支持 namespace 的合并，不支持导出非 const 的值





可以用 tsc --noEmit 来做类型检查，加上 noEmit选项就不会生成代码了。

如果你要生成 d.ts，也要单独跑下 tsc 编译。