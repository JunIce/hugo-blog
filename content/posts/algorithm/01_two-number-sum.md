---
title: "01_两个数字之和求下标"
date: 2022-03-10T16:11:42+08:00
draft: true
categories: ["algorithm"]
---
### 题目

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** *`target`* 的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

**示例 1：**

```txt
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```



#### Typescript

```typescript
/**
 * @param arr 
 * @param target 
 * @returns 
 */
function getTwoNumberIndex(arr: number[], target: number): number[] {
    let result: number[] = [];

    let map = {};

    for (let i = 0, len = arr.length; i < len; i++) {
        let v = target - arr[i];
        if (map[v] !== undefined) {
            return [map[v], i];
        }

        map[arr[i]] = i;
    }

    return result;
}
```

