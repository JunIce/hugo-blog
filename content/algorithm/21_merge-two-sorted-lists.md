---
title: "21_merge-two-sorted-lists 合并两个排序链表"
date: 2022-05-02T15:46:37+08:00
draft: true
categories: ["algorithm"]
---








# merge two sorted lists合并两个数组链表

## question



## 问题



You are given the heads of two sorted linked lists `list1` and `list2`.

Merge the two lists in a one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return *the head of the merged linked list*.

**Example 1:**

![](https://assets.leetcode.com/uploads/2020/10/03/merge_ex1.jpg)

```
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

**Example 2:**

```
Input: list1 = [], list2 = []
Output: []
```

**Example 3:**

```
Input: list1 = [], list2 = [0]
Output: [0]
```

 

## 方案



1. 新建一个临时节点，并且创建副本
2. 递归list1和list2，比较当前节点值的大小
3. 把当前节点的next指向一个新的节点实例，赋值为小的那个值
4. 修改list1和list2的索引，不断指向下一个，这样就能保证指针向后移动
5. 修改当前的指针，指向当前节点的next
6. 把list1或者list2的剩余节点赋值到当前节点的next上
7. 返回临时节点的next，即排序后的节点链表，因为节点是引用，所以能返回完整的节点






```typescript
function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
    if(list1 === null && list2 === null) return null
    if(!list1 || !list2) return list1 || list2
    
    let temp = new ListNode(-1)

    let currentNode = temp;

    while(list1 && list2) {
        if(list1.val < list2.val) {
            currentNode.next = new ListNode(list1.val)
            list1 = list1.next
        } else {
            currentNode.next = new ListNode(list2.val)
            list2 = list2.next
        }
        currentNode = currentNode.next
    }

    currentNode.next = list1 || list2

    return temp.next
}
```
