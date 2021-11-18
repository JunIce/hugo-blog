---
title: "HTML DOM closest()用法及代码示例"
date: 2021-10-08T10:32:27+08:00
draft: false
tags: ["js", "dom"]
---

元素接口的closest()方法用于遍历HTML文档树中的元素及其父元素，直到找到与提供的选择器字符串匹配的第一个节点。只搜索父级节点。
```js
targetElement.closest( selectors )
```
`参数` 此方法接受如上所述和以下描述的单个参数：

`selectors` 它是一个字符串，它指定将用于查找节点的HTML选择器。

`返回值` 如果找到匹配的祖先，则此方法返回最接近的元素；否则，如果找不到此类元素，则返回null。