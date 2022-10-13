---
title: "35_查找到插入位置"
date: 2022-10-13T16:11:42+08:00
draft: true
categories: ["algorithm"]
---



# 35_查找到插入位置



## 题目

- Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

  You must write an algorithm with `O(log n)` runtime complexity.

   

  **Example 1:**

  ```
  Input: nums = [1,3,5,6], target = 5
  Output: 2
  ```

  **Example 2:**

  ```
  Input: nums = [1,3,5,6], target = 2
  Output: 1
  ```

  **Example 3:**

  ```
  Input: nums = [1,3,5,6], target = 7
  Output: 4
  ```

   

  **Constraints:**

  - `1 <= nums.length <= 104`
  - `-104 <= nums[i] <= 104`
  - `nums` contains **distinct** values sorted in **ascending** order.
  - `-104 <= target <= 104`



### 解答



思路

原始方法，就是从前向后遍历找到对应位置



```typescript
function searchInsert(nums: number[], target: number): number {
    let last = nums.length - 1
    if (target <= nums[0]) return 0
    if (target > nums[last]) return last+1

    for (let i = 0; i < last; i++) {
        if(target <= nums[i] && target > nums[i-1]) {
            return i
        }
    }
};
```


