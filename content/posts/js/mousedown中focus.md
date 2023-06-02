---
title: "mousedown event中保持input的focus状态"
date: 2023-06-01T20:31:50+08:00
tags: ["js"]
categories: ["js"]
draft: false
---


# mousedown event中保持input的focus状态

一定要使用`e.preventDefault`去除默认失去焦点行为

```html
  <input>

  <button>CLICK</button> <button>MOUSEUP</button> <button>MOUSEDOWN</button> <button>MOUSEDOWN 2</button>
```

```javascript
document.querySelector('button').addEventListener('click', function () {
  document.querySelector('input').focus();
}, false);

document.querySelectorAll('button')[1].addEventListener('mouseup', function () {
  document.querySelector('input').focus();
}, false);

document.querySelectorAll('button')[2].addEventListener('mousedown', function (e) {
  document.querySelector('input').focus();
}, false);

document.querySelectorAll('button')[3].addEventListener('mousedown', function (e) {
  document.querySelector('input').focus();
  e.preventDefault();
}, false);
```



## reference

[https://codepen.io/impressivewebs/pen/qBNLqWN?editors=1000](https://codepen.io/impressivewebs/pen/qBNLqWN?editors=1000)