---
title: "66 _ PlusOne数字加1"
date: 2022-10-10T16:11:42+08:00
draft: true
categories: ["algorithm"]
---



# 66 _ PlusOne加一



## 题目



ou are given a **large integer** represented as an integer array `digits`, where each `digits[i]` is the `ith` digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading `0`'s.

Increment the large integer by one and return *the resulting array of digits*.

 

**Example 1:**

```
Input: digits = [1,2,3]
Output: [1,2,4]
Explanation: The array represents the integer 123.
Incrementing by one gives 123 + 1 = 124.
Thus, the result should be [1,2,4].
```

**Example 2:**

```
Input: digits = [4,3,2,1]
Output: [4,3,2,2]
Explanation: The array represents the integer 4321.
Incrementing by one gives 4321 + 1 = 4322.
Thus, the result should be [4,3,2,2].
```

**Example 3:**

```
Input: digits = [9]
Output: [1,0]
Explanation: The array represents the integer 9.
Incrementing by one gives 9 + 1 = 10.
Thus, the result should be [1,0].
```

 

**Constraints:**

- `1 <= digits.length <= 100`
- `0 <= digits[i] <= 9`
- `digits` does not contain any leading `0`'s.





### 解答



思路

数组从后往前遍历，如果数字+1大于10，则前一位需要进1
重点在于提前退出的时机



```typescript
function plusOne(digits: number[]) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] != 9) {
      digits[i]++;
      break;
    } else {
      digits[i] = 0;
    }
  }
  if (digits[0] == 0) {
    const res = new Array(digits.length + 1).fill(0);
    res[0] = 1;
    return res;
  }
  return digits;
}
```



