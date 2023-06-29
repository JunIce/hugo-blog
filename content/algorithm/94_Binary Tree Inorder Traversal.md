---
title: "94_Binary Tree Inorder Traversal"
date: 2022-10-23T16:11:42+08:00
draft: true
categories: ["algorithm"]
---



# 94_Binary Tree Inorder Traversal



## 题目

Given the `root` of a binary tree, return *the inorder traversal of its nodes' values*.

 

**Example 1:**

![img](https://assets.leetcode.com/uploads/2020/09/15/inorder_1.jpg)

```
Input: root = [1,null,2,3]
Output: [1,3,2]
```

**Example 2:**

```
Input: root = []
Output: []
```

**Example 3:**

```
Input: root = [1]
Output: [1]
```

 

### 解答



while循环，先储存所有的left，再迭代right

```typescript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */
function inorderTraversal(root: TreeNode | null): number[] {
  let stack: TreeNode[] = [];
  let res: number[] = [];

  while (root || stack.length) {
    if (root) {
      stack.push(root);
      root = root.left;
    } else {
      root = stack.pop()!;
      res.push(root?.val);
      root = root.right;
    }
  }

  return res;
}
```





递归调用

```typescript
function inorderTraversal(root: TreeNode | null): number[] {
    return root ? [...inorderTraversal(root.left), root.val, ...inorderTraversal(root.right)] : []
};
```



