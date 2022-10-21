---
title: "05_最长回文字符"
date: 2022-10-19T11:41:23+08:00
draft: true
categories: ["algorithm"]
---



# 05最长回文字符



## 题目



Given a string `s`, return *the longest palindromic substring* in `s`.

A string is called a palindrome string if the reverse of that string is the same as the original string.

 

**Example 1:**

```
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.
```

**Example 2:**

```
Input: s = "cbbd"
Output: "bb"
```

 



## 代码



```typescript
function longestPalindrome(str: string): string {
  let results = "";

  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    let left = i;
    let right = i;

    while (left > 0 && str[left - 1] === char) {
      left--;
    }

    while (right < str.length && str[right + 1] === char) {
      right++;
      i++;
    }

    while (
      left >= 0 &&
      right < str.length - 1 &&
      str[left - 1] === str[right + 1]
    ) {
      right++;
      left--;
    }

    if (results.length < right - left + 1) {
      results = str.slice(left, right + 1);
    }
  }
  return results;
}
```