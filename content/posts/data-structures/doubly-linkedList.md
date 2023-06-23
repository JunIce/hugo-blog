---
title: "双向链表"
date: 2023-06-22T08:39:16+08:00
draft: false
tags: ["js", "doubly linkedList"]
categories: ["数据结构"]
---


# 双向链表

```javascript
class Node {
  constructor(value) {
    this.prev = null;
    this.value = value;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  add(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
  }

  delete(value) {
    if (!this.head) return null;

    let current = this.head;
    let deleteNode = null;

    while (current) {
      if (current.value === value) {
        deleteNode = current;

        if (deleteNode === this.head) {
          this.head = deleteNode.next;
          if (this.head.prev) {
            this.head.prev = null;
          }
          if (node === this.tail) {
            this.tail = null;
          }
        } else if (deleteNode === this.tail) {
          this.tail = deleteNode.prev;
          this.tail.next = null;
        } else {
          let prev = deleteNode.prev;
          let next = deleteNode.next;
          prev.next = next.next;
          next.prev = prev;
        }
      }
      current = current.next;
    }
  }

  prepend(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
  }

  find(value) {
    if (!this.head) return null;

    let current = this.head;

    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }

    return null;
  }
}
```

