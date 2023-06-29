---
title: "34. Find First and Last Position of Element in Sorted Array"
date: 2023-06-23T16:11:42+08:00
draft: true
categories: ["algorithm"]
---

# 34. Find First and Last Position of Element in Sorted Array

Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.

If target is not found in the array, return [-1, -1].

You must write an algorithm with O(log n) runtime complexity.

Example 1:

Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
Example 2:

Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
Example 3:

Input: nums = [], target = 0
Output: [-1,-1]

## Resolution

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
  let l = 0,
    r = nums.length - 1;

  while (l < r) {
    let mid = Math.floor((l + r) / 2);
    if (nums[mid] < target) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }

  if (nums[l] != target) return [-1, -1];

  let start = l;

  r = nums.length - 1;
  while (l < r) {
    let mid = Math.floor((l + r) / 2);
    nums[mid] <= target ? (l = mid + 1) : (r = mid);
  }

  let end = nums[l] === target ? l : l - 1;

  return [start, end];
};
```

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
  function findIndex(bool = true) {
    let start = 0;
    let end = nums.length - 1;

    let idx = -1;

    while (start <= end) {
      let mid = Math.floor((start + end) / 2);

      if (nums[mid] < target) {
        start = mid + 1;
      }

      if (nums[mid] > target) {
        end = mid - 1;
      }

      if (nums[mid] === target) {
        idx = mid;
        if (bool) {
          end = mid - 1;
        } else {
          start = mid + 1;
        }
      }
    }
    return idx;
  }

  return [findIndex(), findIndex(false)];
};
```
