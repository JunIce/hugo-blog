---
title: "Window Selection 选区相关操作"
date: 2022-01-27T10:16:09+08:00
draft: true
---


# Selection

用户获取用户选择的文本范围和节点

`anchor` 表示鼠标按下的位置

`focus` 表示光标最终的位置

`isCollapsed` 起始点和终点是否在同一个位置

`rangeCount` 选区数量

`type` 当前选择的类型

- None: 当前没有选择。

- Caret: 选区已折叠（即 光标在字符之间，并未处于选中状态）。

- Range: 选择的是一个范围。

anchor 指向的位置可能在 focus 指向的位置的前面，也可能在 focus 指向位置的后面，这取决于你选择文本时鼠标移动的方向（也就是按下鼠标键和松开鼠标键的位置）。

## Methods

### getRangeAt

获取选区范围

```js
let range = selection.getRangeAt(0)
```

### collapse

方法可以收起当前选区到一个点。文档不会发生改变。如果选区的内容是可编辑的并且焦点落在上面，则光标会在该处闪烁。
```js
sel.collapse(parentNode, offset);
```

### collapseToEnd

光标定位在原选区的最末尾处

### collapseToStart

光标定位在原选区的最开始处

### containsNode


```js
sel.containsNode(aNode,aPartlyContained)
```

- aNode 需要判断的节点

- aPartlyContained  
    
    - 1) true 部分包含时返回true 

    - 2) false 完全包含时返回true

### deleteFromDocument 

从文档中删除

### extend

移动选中区的焦点到指定的点。选中区的锚点不会移动。选中区将从锚点开始到新的焦点，不管方向。

```js
sel.extend(node, offset)
```

### removeAllRanges

会从当前selection对象中移除所有的range对象,取消所有的选择只 留下anchorNode 和focusNode属性并将其设置为null。

```js
sel.removeAllRanges();
```

### removeRange

将从选区当中移除

```js
sel.removeRange(range);
```

### selectAllChildren

所有parentNode元素的子元素会被设为选中区域，parentNode本身除外

```js
sel.selectAllChildren(parentNode)
```


### setBaseAndExtent

选中并设置在两个特定的DOM节点中文本选中的范围, 并且选中的任何内容都位于两个节点之间.

```js
sel.setBaseAndExtent(anchorNode,anchorOffset,focusNode,focusOffset)
```

### toString

返回代表当前selection对象的字符串,例如当前选择的文本文字.

```js
str = sel.toString()
```