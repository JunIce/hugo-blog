---
title: "dom api -- 相关问题解决方案"
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

### scrollIntoView 不能解决偏移问题


```js
const el = document.getElementById(‘myid’);

if (el) {
  const yOffset = -60;
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: 'smooth'});
}
```

