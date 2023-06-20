---
title: "单向链表"
date: 2023-06-20T08:39:16+08:00
draft: false
tags: ["js", "linkedList"]
categories: ["数据结构"]
---









# 链表



链表是一种物理储存上非联系，数据元素的逻辑顺序通过链表中的指针链接次序，实现的一种线性储存结构。



```typescript
class LinkNode {
  value: string;
  next: LinkNode;
  constructor(value: string) {
    this.value = value;
  }
}

class LinkedList {
  head: LinkNode;
  tail: LinkNode;
  constructor() {}

  prepend(value: string) {
    const node = new LinkNode(value);
    node.next = this.head;
    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }

    return this;
  }

  append(value: string) {
    const node = new LinkNode(value);

    if (!this.head && !this.tail) {
      this.head = node;
      this.tail = node;
      return this;
    }

    this.tail.next = node;
    this.tail = node;
    return this;
  }

  insert(value: string, index: number) {
    if (index === 0) {
      return this.prepend(value);
    } else {
      let count = 1;
      let current = this.head;
      const node = new LinkNode(value);

      while (current) {
        if (count === index) break;
        current = current.next;
        count++;
      }

      if (current) {
        node.next = current.next;
        current.next = node;
      } else {
        this.tail.next = node;
        this.tail = node;
      }
    }
    return this;
  }

  delete(value: string, compare: Function) {
    if (!this.head) return null;

    let deleteNode: LinkNode | null = null;

    let current = this.head;

    while (current) {
      if (compare(current.value, value)) {
        deleteNode = current;
        current.next = current.next.next;

        if (current === this.head) {
          this.head = current.next;
        }
      } else {
        current = current.next;
      }
    }

    return deleteNode;
  }

  find(value: string, compare: Function) {
    if (!this.head) return null;

    let current = this.head;

    while (current) {
      if (compare(current.value, value)) {
        return current;
      } else {
        current = current.next;
      }
    }
    return null;
  }

  fromArray(array: string[]) {
    array.forEach((value) => this.append(value));
    return this;
  }

  toArray() {
    const nodes: any = [];
    let current = this.head;
    while (current) {
      nodes.push(current);
      current = current.next;
    }
    return nodes;
  }
}

```

