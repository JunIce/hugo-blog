---
title: "26_remove-duplicates-from-sorted-arrays 移除数组中的重复元素"
date: 2022-05-03T15:46:37+08:00
draft: true
categories: ["algorithm"]
---





# 26. Remove Duplicates from Sorted Array

## question



## 问题

Given an integer array `nums` sorted in **non-decreasing order**, remove the duplicates [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm) such that each unique element appears only **once**. The **relative order** of the elements should be kept the **same**.

Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the **first part** of the array `nums`. More formally, if there are `k` elements after removing the duplicates, then the first `k` elements of `nums` should hold the final result. It does not matter what you leave beyond the first `k` elements.

Return `k` *after placing the final result in the first* `k` *slots of* `nums`.

Do **not** allocate extra space for another array. You must do this by **modifying the input array [in-place](https://en.wikipedia.org/wiki/In-place_algorithm)** with O(1) extra memory.



**Example 1:**

```
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

**Example 2:**

```
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

 

## 方案



默认从索引1开始

循环数组，拿当前的值和上一个值进行比对，如果值一样即忽略，如果不一样就向后赋值






```typescript
function removeDuplicates(nums: number[]): number {
   	let k = 1;
    let tmp = nums[0];

    for(let i = 1; i < nums.length; i++) {
        if(nums[i] != tmp) {
            tmp = nums[i];
            nums[k++] = nums[i];
        }
    }

    return k;   
};
```
