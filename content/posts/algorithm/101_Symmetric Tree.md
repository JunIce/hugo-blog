---
title: "101. Symmetric Tree"
date: 2022-10-23T17:20:00+08:00
draft: true
categories: ["algorithm"]
---



# 101. Symmetric Tree



## 题目

Given the `root` of a binary tree, *check whether it is a mirror of itself* (i.e., symmetric around its center).

 

**Example 1:**

![img](https://assets.leetcode.com/uploads/2021/02/19/symtree1.jpg)

```
Input: root = [1,2,2,3,4,4,3]
Output: true
```

**Example 2:**

![img](https://assets.leetcode.com/uploads/2021/02/19/symtree2.jpg)

```
Input: root = [1,2,2,null,3,null,3]
Output: false
```

 

### 解答



递归解法

```typescript

function diff(p: TreeNode|null, q: TreeNode|null) {
    if (p == null && q == null ) return true;
    if (!p || !q || p.val != q.val) return false
    
    return diff(p.left, q.right) && diff(p.right, q.left)
}

function isSymmetric(root: TreeNode | null): boolean {
    if(!root) return false
    
    
    return diff(root.left, root.right)
};
```


