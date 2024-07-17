---
title: "SharedArrayBuffer is not defined"
date: 2024-07-17T08:35:32+08:00
tags: ["js"]
categories: ["js"]
draft: false
---





# SharedArrayBuffer is not defined 如何解决





SharedArrayBuffer 是一种 JavaScript 对象，用于在多线程环境中共享内存。然而，由于共享内存的特性，它可能导致安全漏洞。攻击者可以通过操纵共享内存来执行恶意代码，因此大部分浏览器对其进行了限制。

开通**https**支持



### vue.config.js

```js
  devServer: {
    headers: {
      // 如果需要用到ffmpeg合并视频，需要将COEP和COOP打开，来确保ShareArrayBuffer能够正常使用
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  }
```



### nginx

vue路由要使用mode: "hash"的方式；

```nginx
        location / {
            root   "../webs";
            index  index.html index.htm;
			add_header Cross-Origin-Opener-Policy same-origin;
			add_header Cross-Origin-Embedder-Policy require-corp;
        }
```

