---
title: "堆和栈"
date: 2023-06-22T08:39:16+08:00
draft: false
tags: ["js", "queue & stack"]
categories: ["数据结构"]
---

# 堆和栈

## Queue

```javascript
import LinkedList from "./LinkedList";

class Queue {
  constructor() {
    this.linkedList = new LinkedList();
  }

  isEmpty() {
    return !this.linkedList.head;
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.linkedList.head.value;
  }

  enqueue(value) {
    this.linkedList.prepend(value);
  }

  dequeue() {
    return this.linkedList.deleteHead();
  }
}
```

## Stack

```javascript
import LinkedList from "./LinkedList";

class Stack {
  constructor() {
    this.linkedList = new LinkedList();
  }

  isEmpty() {
    return !this.linkedList.head;
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.linkedList.head.value;
  }

  push(value) {
    this.linkedList.prepend(value);
  }

  pop() {
    return this.linkedList.deleteHead();
  }
}
```
