---
title: "02_2个队列数相加"
date: 2022-10-18T08:49:56+08:00
draft: true
categories: ["algorithm"]
---


## 02_2个队列数相加

### 题目
You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

 

**Example 1:**

![img](https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg)

```
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

**Example 2:**

```
Input: l1 = [0], l2 = [0]
Output: [0]
```

**Example 3:**

```
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

 



## solution



**思路1**

自定义一个开始节点，不断在开始节点后进行添加，最后返回从开始节点后的节点



```typescript
function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const start = new ListNode(0)
  let temp = start;
  let c = 0
  while(l1 != null || l2 != null || c != 0) {

    let sum = (l1?.val || 0) + (l2?.val || 0) + c

    c = sum >= 10 ? 1 : 0

    temp.next = new ListNode(sum % 10)
    temp = temp.next
    l1 = l1?.next || null
    l2 = l2?.next || null
  }

  return start.next
}
```



**思路2**

```typescript
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null, carry = 0): ListNode | null {
  if (l1 || l2) {
    const next1 = getNextNode(l1)
    const next2 = getNextNode(l2)
    const sum = getNodeValue(l1) + getNodeValue(l2) + carry
    const nextCarry = sum >= 10 ? 1 : 0
    
    return new ListNode(sum % 10, addTwoNumbers(next1, next2, nextCarry))
  } else if (carry) { return new ListNode(1) }
    
  return null
}

function getNodeValue(node: ListNode | null): number {
  return node && node.val ? node.val : 0
}

function getNextNode(node: ListNode | null): ListNode | null {
  return node && node.next ? node.next : null
}
```

