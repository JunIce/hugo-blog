---
title: "HTML Element API 用法"
date: 2021-10-08T10:59:45+08:00
draft: false
tags: ["Element", "js"]
---

## Element.insertBefore


```js
referenceParentNode.insertBefore(targetNode, referenceNode)
```

父节点操作下面子节点的方法，`referenceNode`之前插入一个拥有指定父节点的子节点


使用场景

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

## Element.closest

元素接口的closest()方法用于遍历HTML文档树中的元素及其父元素，直到找到与提供的选择器字符串匹配的第一个节点。只搜索父级节点。
```js
targetElement.closest( selectors )
```
`参数` 此方法接受如上所述和以下描述的单个参数：

`selectors` 它是一个字符串，它指定将用于查找节点的HTML选择器。

`返回值` 如果找到匹配的祖先，则此方法返回最接近的元素；否则，如果找不到此类元素，则返回null。


## Element.animate

元素的动画效果

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div>
        <h5>test paragraph</h5>
    </div>
    <script>
        var animate = document.getElementsByTagName("h5")[0].animate([
            // keyframes
            { transform: 'translateY(0px)' },
            { transform: 'translateY(-300px)' }
        ], {
            // timing options
            duration: 1000,
            iterations: Infinity
        });
    </script>
</body>
</html>
```

`h5`标签会一直在动画状态

```js
animate.pause() // 暂停
animate.cancel() // 取消暂停状态
animate.effect
```

## Element.insertAdjacentElement

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

![insertAdjacentElement](/insertAdjacentElement.png)
