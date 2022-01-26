---
title: "Dom Api InsertAdjacentElement"
date: 2022-01-26T13:44:00+08:00
draft: true
---

# insertAdjacentElement

> element.insertAdjacentElement(position, element)

返回插入的元素， 插入失败则返回null

## position可选值

- `beforebegin`: 在该元素本身的前面.
- `afterbegin`:只在该元素当中, 在该元素第一个子孩子前面.
- `beforeend`:只在该元素当中, 在该元素最后一个子孩子后面.
- `afterend`: 在该元素本身的后面.

## element => dom 元素


## 插入结果位置

```HTML
<!-- beforebegin -->
<p>
<!-- afterbegin -->
foo
<!-- beforeend -->
</p>
<!-- afterend -->
```

