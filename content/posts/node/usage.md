---
title: "typescript -- 问题笔记"
date: 2023-03-23T08:57:39+08:00
draft: true
tags: ["typescript"]
categories: ["Typescript"]
---





## Alternative for __dirname in Node.js when using ES6 modules


```sh
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
```



[ecmascript 6 - Alternative for __dirname in Node.js when using ES6 modules - Stack Overflow](https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules)
