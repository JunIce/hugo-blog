---
title: "HTML Element API 用法"
date: 2021-10-08T10:59:45+08:00
draft: false
tags: ["Element", "js"]
---

## Element.append

方法在 `Element`的最后一个子节点之后插入一组 `Node` 对象或 `DOMString` 对象。
被插入的 `DOMString` 对象等价为 `Text` 节点。

> Element.append((Node or DOMString)... nodes);

示例代码

```html
<div id="container">
  <h1>test</h1>

  <h2>test2</h2>
</div>

<script>
  var h1 = document.querySelector("h1");
  var container = document.querySelector("#container");

  let span2 = document.createElement("span");
  span2.textContent = "span2";

  container.append(span2);
  console.log(container.children);
</script>
```

## Element.before

方法可以在这个节点的父节点中插入一些列的 Node 或者 DOMString 对象

> Element.before((Node or DOMString)... nodes);

```html
<div id="container">
  <h1>test</h1>

  <h2>test2</h2>
</div>

<script>
  var h1 = document.querySelector("h1");
  var container = document.querySelector("#container");

  var span = document.createElement("span");
  span.textContent = "demo span";

  h1.after(span);

  var spanBefore = document.createElement("span");
  spanBefore.textContent = "spanBebore";

  span.before(spanBefore);
</script>
```

## Element.after

> Element.after(...nodes | Text)

参数为`html node` 或者直接是 html 文本, 也可以是多个参数同时插入

示例代码

```html
<div id="container">
  <h1>test</h1>

  <h2>test2</h2>
</div>

<script>
  var h1 = document.querySelector("h1");
  var container = document.querySelector("#container");

  var span = document.createElement("span");
  span.textContent = "demo span";

  h1.after(span);
</script>
```

## Element.insertBefore

```js
referenceParentNode.insertBefore(targetNode, referenceNode);
```

父节点操作下面子节点的方法，`referenceNode`之前插入一个拥有指定父节点的子节点

使用场景

```js
function swap(el1: HTMLElement, el2: HTMLElement) {
  // 临时节点,相当于锚点标记
  let temp: HTMLElement = document.createElement("div");
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

元素接口的 closest()方法用于遍历 HTML 文档树中的元素及其父元素，直到找到与提供的选择器字符串匹配的第一个节点。只搜索父级节点。

```js
targetElement.closest(selectors);
```

`参数` 此方法接受如上所述和以下描述的单个参数：

`selectors` 它是一个字符串，它指定将用于查找节点的 HTML 选择器。

`返回值` 如果找到匹配的祖先，则此方法返回最接近的元素；否则，如果找不到此类元素，则返回 null。

## Element.animate

元素的动画效果

示例代码

```html
<div>
  <h5>test paragraph</h5>
</div>
<script>
  var animate = document.getElementsByTagName("h5")[0].animate(
    [
      // keyframes
      { transform: "translateY(0px)" },
      { transform: "translateY(-300px)" },
    ],
    {
      // timing options
      duration: 1000,
      iterations: Infinity,
    }
  );
</script>
```

`h5`标签会一直在动画状态

```js
animate.pause(); // 暂停
animate.cancel(); // 取消暂停状态
animate.effect;
```


## Element.getAttribute

获取元素相关属性

## Element.getAttributeNames

获取元素所有属性Array



## Element.insertAdjacentElement

> element.insertAdjacentElement(position, element)

返回插入的元素， 插入失败则返回 null

### position 可选值

- `beforebegin`: 在该元素本身的前面.
- `afterbegin`:只在该元素当中, 在该元素第一个子孩子前面.
- `beforeend`:只在该元素当中, 在该元素最后一个子孩子后面.
- `afterend`: 在该元素本身的后面.

### element => dom 元素

### 插入结果位置

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


## Element.getAttributeNode

返回指定元素的指定属性节点

> var attrNode = element.getAttributeNode(attrName);


`attrNode`  获得的属性返回值，是Attr 节点， nodeType 为 2
`attrName` 是一个包含属性名称的 字符串


```html
<div id="app"></div>

<script>
    var el = document.querySelector('#app')
    var idAttr = el.getAttributeNode("id") 
</script>
```

## Element.getBoundingClientRect()

返回元素的大小及其相对于浏览器视窗的位置。

返回 top,lef,right,bottom,width,height 6个值

注意： 该API返回的 DOMRect 对象在现代浏览器中可以被修改。

