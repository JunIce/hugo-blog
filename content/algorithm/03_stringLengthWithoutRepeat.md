---
title: "03_无重复字符串的最长字串"
date: 2022-03-04T08:49:56+08:00
draft: true
categories: ["algorithm"]
---


## 无重复字符串的最长字串

### 题目

给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。


```ts
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

#### Typescript

```ts
// 无重复字符串的最长字串
function lengthOfLongestSubstring(s: string): number {
    // keeps track of the most recent index of each letter.
    const seen = new Map();
    // keeps track of the starting index of the current substring.
    let start = 0;
    // keeps track of the maximum substring length.
    let maxLen = 0;
    
    for(let i = 0; i < s.length; i++) {
        // if the current char was seen, move the start to (1 + the last index of this char)
        // max prevents moving backward, 'start' can only move forward
        if(seen.has(s[i])) start = Math.max(seen.get(s[i]) + 1, start)
        seen.set(s[i], i);
        // maximum of the current substring length and maxLen
        maxLen = Math.max(i - start + 1, maxLen);
    } 
    
    return maxLen;  
};
```