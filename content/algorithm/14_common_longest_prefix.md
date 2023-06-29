---
title: "14_common_longest_prefix最长公共子序列"
date: 2022-04-30T15:46:37+08:00
draft: true
categories: ["algorithm"]
---











# 数组最长公共子序列



## question



## 问题



数组元素都是字符串，求取字符串的最长公共子序列



**Example 1:**

```
Input: strs = ["flower","flow","flight"]
Output: "fl"
```

**Example 2:**

```bash
Input: strs = ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.
```



## 方案




```typescript
function longestCommonPrefix(strs: string[]): string {
    let result = ''

    if(strs.length == 0) return result
    if(strs.length == 1) return strs[0]


    result = strs[0]

    for(let i = 1; i < strs.length; i++) {
        if(!strs[i].startsWith(result)) {
            result = result.substring(0, result.length - 1)
            i --
        }
    }

    
    return result
};
```


### 
