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



### 解题思路

直接构建倒序数

- x ＜ 0时，全为false；
- x ＜ 10时，个数全为true；
- 其它情况，两位数的倒数 = （x%10）10 + x / 10，三位数的倒数 = （（x%10）10 + （x%10）% 10） 10 + x/10(后两位数的倒数10 + x%10)....既可



## 方案



### 1: 数字转字符串


```typescript
function isPalindrome(x: number): boolean {
  if (typeof x !== "number" || Number.isNaN(x)) return false;
  if (Math.abs(x) > 2 ** 31 - 1) return false;
  
  let xStr = x+''

  let xStrArr = xStr.split('').reverse()

  return xStrArr.join('') === xStr
}
```

### 2: 数字转字符串， 前后指针

```typescript
function isPalindrome(x: number): boolean {
  if(x < 0) return false

  if(x >= 0 && x < 10) return true

  let s = x+''
  let startPi = 0
  let endPi = 0
  let bool = true

  while(startPi < s.length) {
    if(startPi + endPi > s.length) break
    if(s.charAt(startPi) !== s.charAt(s.length - 1 - endPi)) {
        bool = false
        break
    } else {
        startPi++
        endPi++
    }
  }

  return bool
}
```


### 3: 半数循环

```typescript
function isPalindrome(x: number): boolean {
  if(x < 0) return false

  if(x >= 0 && x < 10) return true

  let s = x+''

  let half = Math.floor(s.length / 2)

  for (let i = 0; i < half; i++) {
    if(s[i] !== s[s.length - 1 - i]) {
        return false
    }
  }

  return true
}
```