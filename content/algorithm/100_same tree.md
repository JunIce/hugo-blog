---
title: "100. Same Tree"
date: 2022-10-23T17:10:00+08:00
draft: true
categories: ["algorithm"]
---



# 100. Same Tree



## 题目

Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

 

**Example 1:**

![img](https://assets.leetcode.com/uploads/2020/12/20/ex1.jpg)

```
Input: p = [1,2,3], q = [1,2,3]
Output: true
```

**Example 2:**

![img](https://assets.leetcode.com/uploads/2020/12/20/ex2.jpg)

```
Input: p = [1,2], q = [1,null,2]
Output: false
```

**Example 3:**

![img](https://assets.leetcode.com/uploads/2020/12/20/ex3.jpg)

```
Input: p = [1,2,1], q = [1,1,2]
Output: false
```

  

### 解答



递归解法

```typescript
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    if (p === q) return true
    
    if(!p || !q || p.val !== q.val) return false
    
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
};
```





```typescript
var isSameTree = function(p, q) {
    let stack = [[p,q]];
    
    while (stack.length){
        let [x,y] = stack.shift();
		
        // if both leaves
        if (x==null && y==null) continue; 
        if(!x || !y) return false;
        if(x.val == y.val){
            stack.push([x.left, y.left]);
            stack.push([x.right, y.right]);
        }
        else return false;
    }
    return true;
}
```

