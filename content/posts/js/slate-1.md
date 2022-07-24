---
title: "slate.js API整理"
date: 2022-07-25T08:35:32+08:00
tags: ["editor", "slate"]
categories: ["slate"]
draft: false

---



# slate.js



> version : v0.47



## Nodes



nodes是整个最重要的类型

- Editor根节点包含了整个文档树的内容
- Element节点包含当前区域的语义化含义
- 文本Text节点包含文本的内容



### Editor

顶层的Slate文档就是Editor自身。它包含了整个文档的所有内容。

```typescript
interface Editor {
  children: Node[]
  ...
}
```



### Element

Element组成了富文本文档的中间层数据。所有的Node都可以进行自定义。

```typescript
interface Element {
  children: Node[]
}
```



节点通过不同的type进行区分，最重要的就是要有children属性



### Blocks vs. Inlines

块状元素和行内元素

默认所有Element都是块状元素

通过覆盖`editor.isInline`函数的默认行为来自定义元素是否是行内元素，默认都是返回的false。

元素可以包含块元素，也可以包含作为子元素与文本节点混合在一起的内联元素。但元素不能包含一些是块的子级和一些内联的子级。



### Voids

对于一些不能被编辑的元素块，通过覆盖`editor.isVoid`（默认返回的是false）方法来进行控制



### Text

文本节点是整个文档树中最低等级的节点，包含文档的内容以及相对应的格式化



## Locations





