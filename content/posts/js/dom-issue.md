---
title: "Dom Issue"
date: 2022-01-28T14:52:32+08:00
draft: true
---


### \u200b不可见字符

`\u200b`为不可见字符，有字符长度，删除需要通过 `str.replace(/\u200B/g,'')`

`trim` 方法无法删除


```js
const span = document.createElement('span');
span.appendChild(document.createTextNode('\u200b'));
```