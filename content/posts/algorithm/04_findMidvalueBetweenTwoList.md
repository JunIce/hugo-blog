---
title: "04_寻找两个正序数组的中位数"
date: 2022-03-12T11:41:23+08:00
draft: true
---

# 寻找两个正序数组的中位数


## 题目描述

给定两个大小分别为 `m` 和 `n` 的正序（从小到大）数组 `nums1` 和 `nums2`。请你找出并返回这两个正序数组的 **中位数** 。

算法的时间复杂度应该为 `O(log (m+n))` 。



**示例 1：**

```bash
输入：nums1 = [1,3], nums2 = [2]
输出：2.00000
解释：合并数组 = [1,2,3] ，中位数 2
```



### Typescript

```typescript
function findMidValueBetweenTwoList(list1: number[], list2: number[]): number {
    let len1 = list1.length,
        len2 = list2.length;

    let m1 = (len1 + len2 + 1) / 2,
        m2 = (len1 + len2 + 1) / 2;

    const findKth = (i: number, j: number, k: number): number => {
        if (i >= len1) {
            return list2[j + k - 1];
        }

        if (j >= len2) {
            return list1[i + k - 1];
        }

        if (k == 1) {
            return Math.min(list1[i], list2[j]);
        }

        let midVal1 = Number.POSITIVE_INFINITY,
            midVal2 = Number.POSITIVE_INFINITY;

        if (i + k / 2 - 1 < len1) {
            midVal1 = list2[i + k / 2 - 1];
        }

        if (j + k / 2 - 1 < len2) {
            midVal2 = list2[i + k / 2 - 1];
        }

        if (midVal1 < midVal2) {
            return findKth(i + k / 2, j, k - k / 2);
        }

        return findKth(i, j + k / 2, k - k / 2);
    };

    return (findKth(0, 0, m1) + findKth(0, 0, m2)) / 2;
}

```

