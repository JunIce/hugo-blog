---
title: "vite 向entry html中注入代码"
date: 2023-04-19T07:40:43+08:00
tags: ["vite"]
categories: ["vite"]
draft: false
---

# vite 向html中注入代码



```js

{
    name: 'bundle-time', // 打包时添加打包时间
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: () => {
        return [
            {
                tag: 'script',
                children: `console.info("bundle time: %s", '${new Date().toLocaleString()}')`,
                injectTo: 'body'
            }
        ]
    }
}

```
