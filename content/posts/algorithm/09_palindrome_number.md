---
title: "09_palindrome_number"
date: 2022-03-22T15:46:37+08:00
draft: true
---



## question



## 问题



给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。

回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

例如，121 是回文，而 123 不是。





## 方案



### 1

```typescript
function isPalindrome(x: number): boolean {
  if (typeof x !== "number" || Number.isNaN(x)) return false;
  if (Math.abs(x) > 2 ** 31 - 1) return false;
  
  let xStr = x+''

  let xStrArr = xStr.split('').reverse()

  return xStrArr.join('') === xStr
}
```

