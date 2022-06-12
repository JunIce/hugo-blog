---
title: "vite -- 打开浏览器原理"
date: 2022-05-31T07:13:26+08:00
tags: ["vite", "open browser"]
categories: ["vite"]
draft: false
---





# vite  -- open browser



>   "version": "3.0.0-alpha.9"



## open



open是一个第三方开发的开源库，用于在命令行打开浏览器，本身已经对各个平台的的代码做了兼融，知识对外部暴露了api



### 使用方式

```javascript
const open = require('open');

// Opens the image in the default image viewer and waits for the opened app to quit.
await open('unicorn.png', {wait: true});
console.log('The image viewer app quit');

// Opens the URL in the default browser.
await open('https://sindresorhus.com');

// Opens the URL in a specified browser.
await open('https://sindresorhus.com', {app: {name: 'firefox'}});

// Specify app arguments.
await open('https://sindresorhus.com', {app: {name: 'google chrome', arguments: ['--incognito']}});

// Open an app
await open.openApp('xcode');

// Open an app with arguments
await open.openApp(open.apps.chrome, {arguments: ['--incognito']});
```

