---
title: "69_求sqrt值"
date: 2022-10-21T16:11:42+08:00
draft: true
categories: ["algorithm"]
---



# 69_求sqrt值



## 题目

Given a non-negative integer `x`, return *the square root of* `x` *rounded down to the nearest integer*. The returned integer should be **non-negative** as well.

You **must not use** any built-in exponent function or operator.

- For example, do not use `pow(x, 0.5)` in c++ or `x ** 0.5` in python.

 

**Example 1:**

```
Input: x = 4
Output: 2
Explanation: The square root of 4 is 2, so we return 2.
```

**Example 2:**

```
Input: x = 8
Output: 2
Explanation: The square root of 8 is 2.82842..., and since we round it down to the nearest integer, 2 is returned.
```



### 解答



思路

不断取中间值进行递归计算



```typescript
function mySqrt(x: number): number {
  let start = 0,
    end = x,
    temp = 0;

  if (x < 2) return x;

  while (start <= end) {
    let mid = Math.ceil((start + end) / 2);

    let res = mid * mid;

    if (res === x) {
      return mid;
    }

    if (x < res) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }

  return x < end * end ? end - 1 : end;
}
```



