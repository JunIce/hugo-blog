---
title: "数字加减问题解决精度问题"
date: 2021-11-01T10:40:43+08:00
draft: false
tags: ["js"]
---

```js

function plus(num1, num2) {
    const num1Digits = (num1.toString().split('.')[1] || '').length;
    const num2Digits = (num2.toString().split('.')[1] || '').length;
    const baseNumber = Math.pow(10, Math.max(num1Digits, num2Digits));
    return (num1 * baseNumber + num2 * baseNumber) / baseNumber;
}

function minus(num1, num2) {
    return plus(num1, -1 * num2);
}
```
