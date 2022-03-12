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
function stringLenghtWithoutRepeat(str: string):number {
    let result = []
    let temp = ''

    for(let i = 0; i < str.length; i++) {
        let c = str.charAt(i)

        if (temp.indexOf(c) == -1) {
            temp += c
        } else {
            result.push(temp.length)
            temp = c
        }

    }

    return Math.max(...result)
}
```