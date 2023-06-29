---
title: "83_删除排序队列中的重复值"
date: 2022-10-21T16:11:42+08:00
draft: true
categories: ["algorithm"]
---



# 83_删除排序队列中的重复值



## 题目

Given the `head` of a sorted linked list, *delete all duplicates such that each element appears only once*. Return *the linked list **sorted** as well*.

 

**Example 1:**

![img](https://assets.leetcode.com/uploads/2021/01/04/list1.jpg)

```
Input: head = [1,1,2]
Output: [1,2]
```

**Example 2:**

![img](https://assets.leetcode.com/uploads/2021/01/04/list2.jpg)

```
Input: head = [1,1,2,3,3]
Output: [1,2,3]
```

 

### 解答



思路

通过递归赋值到新队列上



```typescript
function deleteDuplicates(
  head: ListNode | null,
  memo = new Set()
): ListNode | null {
  const start = new ListNode(0);
  let tmp1 = start;

  let tmp = head;
  while (tmp) {
    if (!memo.has(tmp.val)) {
      memo.add(tmp.val);

      tmp1.next = new ListNode(tmp.val);
      tmp1 = tmp1.next;
    }

    tmp = tmp.next;
  }

  return start.next;
}
```



独立指针解法

```typescript
function deleteDuplicates(head: ListNode | null): ListNode | null {
    let p = head;
    while(p && p.next) {
        if(p.val === p.next.val) {
            p.next = p.next.next;
        } else {
            p = p.next;
        }
    } 
    return head;
};
```

