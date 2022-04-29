---
title: "Window Range 选区范围相关操作"
date: 2022-01-27T16:14:04+08:00
draft: true
---



# Range



## 获取



1. `new Range()`
2. `document.createRange()`
3. 

```javascript
let selection = document.getSelection()

selection.getRangeAt(0)
```





## Q & A



1. difference-between-document-createrange-and-new-range

其实没有区别

[javascript - What's the difference between document.createRange() and new Range()? - Stack Overflow](https://stackoverflow.com/questions/46996162/whats-the-difference-between-document-createrange-and-new-range)







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

```javascript
newRange = range.cloneRange()
```



### cloneContents

它是 Range 中所有的 Node 对象的副本

```javascript
newRange = range.cloneContents()
```



### collapse

方法向边界点折叠该 Range 

```javascript
newRange = range.collapse(toStart)
```

- toStart: true 开头， false结尾



### deleteContents

删除内容

```javascript
newRange = range.deleteContents()
```



### extractContents

Range.extractContents() 方法移动了Range 中的内容从文档树到DocumentFragment（文档片段对象）。

这个方法会移动原dom，所以不需要删除操作

```javascript
fragment = range.extractContents()
```



#### 包裹一个tag



```javascript
let selection = window.getSelection()
let range = selection?.getRangeAt(0)

let content = range?.extractContents()

let wrapper = document.createElement("span")
wrapper.style.color = 'red'
wrapper.appendChild(content!)
range?.insertNode(wrapper)
```





### selectNode

将 Range 设置为包含整个 Node 及其内容。Range 的起始和结束节点的<b>父节点</b>与 referenceNode 的<b>父节点</b>相同。
这里需要注意的时选中的是传入节点的 <b>父节点</b>

```javascript
newRange = range.selectNode(referenceNode)
```



### selectNodeContents

将 Range 设置为包含整个 Node 及其内容。 startOffset 为 0,  endOffset 则是引用节点包含的字符数或子节点个数。

```javascript
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



#### 一段文本节点包裹一个标签



如果内部含有非文本节点并且只选中了其中一个边界，也就是没有完全覆盖非文本节点，会抛出错误



```javascript
let selection = window.getSelection()
let range = selection?.getRangeAt(0)

let wrapper = document.createElement("span")
wrapper.style.color = 'green'

try {
    range?.surroundContents(wrapper)

} catch (error) {
    console.log(error);
}
```







