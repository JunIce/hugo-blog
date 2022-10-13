---
title: "67_二进制数相加"
date: 2022-10-10T16:11:42+08:00
draft: true
categories: ["algorithm"]
---



# 67_二进制数相加



## 题目

Given two binary strings `a` and `b`, return *their sum as a binary string*.

 

**Example 1:**

```
Input: a = "11", b = "1"
Output: "100"
```

**Example 2:**

```
Input: a = "1010", b = "1011"
Output: "10101"
```

 



### 解答



思路

数组从后往前遍历，如果数字+1大于10，则前一位需要进1
重点在于提前退出的时机



```typescript
var addBinary = function(a, b) {
  const aBin = `0b${a}`
  const bBin = `0b${b}`
  const sum = BigInt(aBin) + BigInt(bBin)
  return sum.toString(2)
};
```



