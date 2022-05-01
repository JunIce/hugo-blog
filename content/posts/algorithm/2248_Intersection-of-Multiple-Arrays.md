---
title: "2248_Intersection of Multiple Arrays 数组交集元素"
date: 2022-05-01T18:46:37+08:00
draft: true
categories: ["algorithm"]
---

















# 数组元素公共子集



## question



## 问题

给定数组的元素，每个数组元素都是数组，其子元素都是数字，现求出数组的公共子集，并且正序排列



Given a 2D integer array `nums` where `nums[i]` is a non-empty array of **distinct** positive integers, return *the list of integers that are present in **each array** of* `nums` *sorted in **ascending order***.

 

**Example 1:**

```
Input: nums = [[3,1,2,4,5],[1,2,3,4],[3,4,5,6]]
Output: [3,4]
Explanation: 
The only integers present in each of nums[0] = [3,1,2,4,5], nums[1] = [1,2,3,4], and nums[2] = [3,4,5,6] are 3 and 4, so we return [3,4].
```

**Example 2:**

```
Input: nums = [[1,2,3],[4,5,6]]
Output: []
Explanation: 
There does not exist any integer present both in nums[0] and nums[1], so we return an empty list [].
```

 

## 方案




```typescript
function intersection(nums: number[][]): number[] {
  if (!nums) return [];

  let map = {};

  let result: number[] = [];

  if (nums.length === 1) {
    result = nums[0];
  }

  if (nums.length > 1) {
    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums[i].length; j++) {
        if (!map[nums[i][j]]) {
          map[nums[i][j]] = 1;
        } else {
          map[nums[i][j]] = map[nums[i][j]] + 1;
        }

        if (i == nums.length - 1) {
          if (map[nums[i][j]] === nums.length) {
            result.push(nums[i][j]);
          }
        }
      }
    }
  }

  result.sort((a, b) => a - b);

  return result;
}
```


### 
