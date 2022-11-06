---
title: "7. Reverse Integer"
date: 2022-11-05T11:41:23+08:00
draft: true
categories: ["algorithm"]
---



# 7. Reverse Integer



## 题目



Given a signed 32-bit integer `x`, return `x` *with its digits reversed*. If reversing `x` causes the value to go outside the signed 32-bit integer range `[-231, 231 - 1]`, then return `0`.

**Assume the environment does not allow you to store 64-bit integers (signed or unsigned).**

 

**Example 1:**

```
Input: x = 123
Output: 321
```

**Example 2:**

```
Input: x = -123
Output: -321
```

**Example 3:**

```
Input: x = 120
Output: 21
```

  



## 代码



```typescript
function reverse(x: number): number {
    if(x == 0) return 0
    let base = x> 0 ? 1 : -1

    let nToStr = String(Math.abs(x))

    let result = ''

    for(let i = nToStr.length - 1; i>= 0; i--) {
        result += nToStr[i]
    }

    if (base && Number(result) > Math.pow(2, 31)) return 0
    if (!base && Number(result) > Math.pow(2, 31)-1) return 0

    return base * Number(result)
};
```