---
title: "vite使用中相关问题整理"
date: 2022-05-05T06:13:23+08:00
tags: ["vite"]
categories: ["vite"]
draft: false
---



# 问题清单



- **vite中使用`optional chain` `?.` 失效问题**



引入`rollup-plugin-esbuild`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import esbuild from 'rollup-plugin-esbuild'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    
    {
      ...esbuild({
        target: 'chrome70', 
        // 如有需要可以在这里加 js ts 之类的其他后缀
        include: /\.vue$/,
        loaders: {
          '.vue': 'js',
        },
      }),
      enforce: 'post',
    }
  ],
})
```



