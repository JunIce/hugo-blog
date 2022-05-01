---
title: "20_Valid Parentheses "
date: 2022-04-30T15:46:37+08:00
draft: true
categories: ["algorithm"]
---











# 数组最长公共子序列



## question



## 问题



Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

 

**Example 1:**

```
Input: s = "()"
Output: true
```

**Example 2:**

```
Input: s = "()[]{}"
Output: true
```

**Example 3:**

```
Input: s = "(]"
Output: false
```

 

## 方案

思路就是通过栈的形式处理，左括号进行储存，匹配到右括号的时候再去看是否是对应的左括号






```typescript
function isValid(s: string): boolean {
  if (s.length % 2 === 1) return false;

  let temp: string[] = [];
  let map = {
      ')': '(',
      ']': '[',
      '}': '{',
  }

  for (let i = 0, l = s.length; i < l; i++) {
    let char = s[i];

    if (char === "(" || char === "[" || char === "{") {
      temp.push(char);
    } else {
      if (temp.length === 0) return false;
      if (temp.pop() !== map[char]) {
        return false;
      }
    }
  }

  return temp.length === 0;
}
```
