---
title: "vue3 -- @vue/compiler-core parse处理整体流程"
date: 2022-07-05T06:29:01+08:00
tags: ["vue3", "@vue/compiler-sfc"]
categories: ["vue"]
draft: false
---



# @vue/compiler-core



>   "version": "3.2.37"



> packages/compiler-core/src/parse.ts



## baseParse





### parseChildren



parseChildren采用了一种从前向后匹配的机制，不断的去改写`context.source`上的字符串

其中parseChildren是处理核心，最终parseElement也会走回到这里，逻辑有点像vue patch的处理逻辑



![parse (1).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c43c0f7e8be442cd9980c070d4eef931~tplv-k3u1fbpfcp-watermark.image?)





## parseInterpolation



解析插值操作



