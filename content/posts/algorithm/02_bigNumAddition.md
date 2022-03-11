---
title: "两个大数相加"
date: 2022-03-04T08:49:56+08:00
draft: true
categories: ["algorithm"]
---


## 两个大数相加

### 题目
给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。


#### Typescript

```ts
// 两个大数相加
function twoBigNumberPlus(a: string, b: string):string {
    let maxLength = Math.max(a.length, b.length);
    let result = new Array(maxLength).fill(0)

    a = a.padStart(maxLength, '0')
    b = b.padStart(maxLength, '0')

    let reverseA = a.split('')
    let reverseB = b.split('')

    while(maxLength--) {
        let tempResult = result[maxLength] + Number(reverseA[maxLength]) + Number(reverseB[maxLength])

        if (tempResult >= 10) {
            result[maxLength - 1] = 1
            result[maxLength] = tempResult - 10
        } else {
            result[maxLength] = tempResult
        }
    }

    return result.join('')
}
```