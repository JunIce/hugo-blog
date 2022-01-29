---
title: "Dom -- 交换两个dom元素"
date: 2022-01-28T11:22:09+08:00
draft: true
---


## insertBefore

```js
referenceParentNode.insertBefore(targetNode, referenceNode)

```

父节点操作下面子节点的方法，`referenceNode`之前插入一个拥有指定父节点的子节点


```js

function swap(el1: HTMLElement, el2: HTMLElement) {
    // 临时节点,相当于锚点标记
    let temp: HTMLElement = document.createElement("div")
    // 获取父节点
    let parent = el1.parentNode;
    // temp插入到el1前面
    parent.insertBefore(temp, el1);
    // el1插入到el2前面
    parent.insertBefore(el1, el2);
    // el2插入到temp前面
    parent.insertBefore(el2, temp);
    // 删除锚点
    parent.removeChild(temp);
}
```