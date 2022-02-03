---
title: "Window Range 选区范围相关操作"
date: 2022-01-27T16:14:04+08:00
draft: true
---

# Range

## Prototype

### collapsed

表示是否起始点和结束点是同一个位置。 如果返回 true 表示Range 的起始位置和结束位置重合, false 表示不重合。

### commonAncestorContainer

`Range.startContainer` 和 `Range.endContainer` 相同的节点是目标节点的 共有祖先节点。

### startContainer & startOffset
### endContainer & endOffset

选区范围的开始和结束节点、偏移量


## Methods

### cloneRange

整体复制一个range，非引用

```js
newRange = range.cloneRange()
```

### cloneContents

它是 Range 中所有的 Node 对象的副本

```js
newRange = range.cloneContents()
```

### collapse

方法向边界点折叠该 Range 

```js
newRange = range.collapse(toStart)
```

- toStart: true 开头， false结尾

### deleteContents

删除内容

```js
newRange = range.deleteContents()
```

### extractContents

Range.extractContents() 方法移动了Range 中的内容从文档树到DocumentFragment（文档片段对象）。

```js
newRange = range.extractContents()
```

### selectNode

将 Range 设置为包含整个 Node 及其内容。Range 的起始和结束节点的<b>父节点</b>与 referenceNode 的<b>父节点</b>相同。
这里需要注意的时选中的是传入节点的 <b>父节点</b>

```js
newRange = range.selectNode(referenceNode)
```

### selectNodeContents

将 Range 设置为包含整个 Node 及其内容。 startOffset 为 0,  endOffset 则是引用节点包含的字符数或子节点个数。

```js
newRange = range.selectNodeContents(referenceNode)
```

### setStart(startNode, startNode)
### setStartBefore(referenceNode)
### setStartAfter(referenceNode)
### setEnd(endNode, endNode)
### setEndBefore(referenceNode)
### setEndAfter(referenceNode)

设置range范围的开始和结束节点、偏移量

### surroundContents(targetNode)

将 Range 的内容移动到新节点中，将新节点放置在指定范围的开头。
如果有部分选择的节点，它们将不会被克隆，而是操作将失败。






