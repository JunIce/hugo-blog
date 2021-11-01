---
title: "Classname Operation"
date: 2021-11-01T10:03:49+08:00
draft: false
---

操作相关classname工具函数

```js

// 增加目标class
function addClass(target = '', srcCls = '') {
    const clss = target.split(/\s+/)
    return [...clss.filter(cls => !clss.includes(cls)), srcCls]
}

function removeClass(target = '', srcCls = '') {
    const clss = target.split(/\s+/)
    return [...clss.filter(cls => !clss.includes(srcCls))]
}
```




