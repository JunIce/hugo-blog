---
title: "原生跨页面通信方案"
date: 2022-05-016T16:42:07+08:00
tags: ["跨页面通信"]
categories:
draft: false
---





# 原生跨页面通信api



各API实现跨页面的优缺点：

- Broadcast Channel：实时通信，随时关闭频道，功能全面；浏览器支持效果不好（IE-都不支持，chrome-54）
- storageEvent：浏览器支持效果好、API直观。部分浏览器隐身模式下，无法设置localStorage（如safari）。可能因LocalStorage清理不及时而引起问题
- shareworker：异步处理，不占用主线程，不用 ie 浏览器的话，还是非常推荐的（IE-都不支持）
- serviceworker：浏览器支持度不高，开启service worker可能会导致浏览器的缓存数据大大增加（IE-都不支持）
- window.open + window.opener：实现方式不优雅，无法形成统一的解决方案，且在强制刷新页面后会失去关联导致无法通信；实现简单，浏览器兼容性好
- postMessage：点对点通信，局限性比较大，可扩展性比较差。
