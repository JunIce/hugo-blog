---
title: "58 _ 最后一个单词的长度"
date: 2022-10-12T16:11:42+08:00
draft: true
categories: ["algorithm"]
---



# 58 _ 最后一个单词的长度



## 题目

Given a string `s` consisting of words and spaces, return *the length of the **last** word in the string.*

A **word** is a maximal substring consisting of non-space characters only.

 

**Example 1:**

```
Input: s = "Hello World"
Output: 5
Explanation: The last word is "World" with length 5.
```

**Example 2:**

```
Input: s = "   fly me   to   the moon  "
Output: 4
Explanation: The last word is "moon" with length 4.
```

**Example 3:**

```
Input: s = "luffy is still joyboy"
Output: 6
Explanation: The last word is "joyboy" with length 6.
```

 

**Constraints:**

- `1 <= s.length <= 104`
- `s` consists of only English letters and spaces `' '`.
- There will be at least one word in `s`.



### 解答



思路

从后向前遍历，主要时退出的时机，以减少递归复杂度



```typescript
function lengthOfLastWord(s: string): number {
    let len = s.length - 1;
    let length = 0;
    while(len >= 0) {
        if(s.charAt(len) !== " ") {
            length++
        } else {
            if(length > 0) {
                return length;
            }
        }
        len--
    }

    return length;
};
```



思路二，从后向前查询，只要索引对应的字符串不是空串就可以

```javascript
function lengthOfLastWord(s: string): number {
    s = s.trim();
    let tail = s.length - 1;
    let length = 0;
    while(tail >= 0 && s[tail] !== " ") {
        tail--
        length++
    }

    return length;
};
```



思路三，正则匹配

```typescript
function lengthOfLastWord(s: string): number {
    let result = s.match(/(\S+)/g)

    if (!result) return 0
    return result[result?.length-1].length;
};
```

