---
title: "js -- dom之EventTarget、Node、Element"
date: 2022-04-12T09:08:16+08:00
draft: true
tags: ["js"]
categories: ["js"]
---



## EventTarget、Node、Element之间的关系



> EventTarget -> Node -> Element



## EventTarget

`EventTarget` 是一个 DOM 接口，由可以接收事件、并且可以创建侦听器的对象实现。



### addEventListener

添加监听函数

### removeEventListener

移除监听函数

### dispatchEvent

触发监听函数



### 实现

```typescript

class MyEventTarget implements EventTarget {
    public listenters: any = {};

    addEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        this.listenters[type] = this.listenters[type] || []
        this.listenters[type].push(callback)
    }

    removeEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        let listenters = this.listenters[type] || [];

        for(let i = 0; i < listenters.length; i++) {
            if(callback === listenters[i]) {
                listenters.splice(i, 1)
            }
        }
    }

    dispatchEvent(event: Event): boolean{
        let listenters = this.listenters[event.type] || []

        let i = 0
        while(i < listenters.length) {
            listenters[i].call(this, event)
            i++
        }
        return true
    }
}

```



## Node



**`Node`** 是一个接口，各种类型的 DOM API 对象会从这个接口继承。它允许我们使用相似的方式对待这些不同类型的对象；

比如, 继承同一组方法，或者用同样的方式测试。



### appendChild

增加一个子节点

```js
element.appendChild(aChild)
```



### cloneNode

克隆节点

```js
var dupNode = node.cloneNode(deep);
```

`deep` 是否采用深度克隆, 如果为`true`, 则该节点的所有后代节点也都会被克隆, 如果为`false`,则只克隆该节点本身.

克隆包括事件，但没有父节点



### compareDocumentPosition

比较节点的位置

```js
compareMask = node.compareDocumentPosition( otherNode )
```

返回一个位掩码



| 常量名                                    | 十进制值 | 含义                |
| ----------------------------------------- | -------- | ------------------- |
| DOCUMENT_POSITION_DISCONNECTED            | 1        | 不在同一文档中      |
| DOCUMENT_POSITION_PRECEDING               | 2        | otherNode在node之前 |
| DOCUMENT_POSITION_FOLLOWING               | 4        | otherNode在node之后 |
| DOCUMENT_POSITION_CONTAINS                | 8        | otherNode包含node   |
| DOCUMENT_POSITION_CONTAINED_BY            | 16       | otherNode被node包含 |
| DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC | 32       | 待定                |



### contains

是否包含

```js
node.contains( otherNode )
```

返回`true`和`false`



### getRootNode

获取根节点

```js
var root = node.getRootNode(options);
```

返回一个`HTMLDocument`对象



### hasChildNodes

是否包含子节点



### insertBefore

`Node.insertBefore()` 方法在参考节点之前插入一个拥有指定父节点的子节点。



```
var insertedNode = parentNode.insertBefore(newNode, referenceNode);
```



1. 如果给定的子节点是对文档中现有节点的引用，`insertBefore()` 会将其从当前位置移动到新位置（在将节点附加到其他节点之前，不需要从其父节点删除该节点）

2. 如果referenceNode为null，则插入到子节点列表的末尾





### isDefaultNamespace

### isEqualNode

判断2个节点是否相等， 包括节点类型，定义特征(defining characteristics)相同（对元素来说，即 id，孩子节点的数量等等），属性一致等，这两个节点就是相等的。



```
var isEqualNode = node.isEqualNode(otherNode);
```



返回一个`boolean`



### isSameNode

判断是否是同一个对象引用

判断两个节点是否是相同的节点,即指向同一个对象.



### lookupPrefix

获取指定前缀

返回一个和指定命名空间URI绑定的命名空间前缀.如果没有,返回`null`. 如果有多个绑定的前缀, 返回的结果根据浏览器实现而定.

```js
node.lookupPrefix()
```



### lookupNamespaceURI

返回当前节点上与指定命名空间前缀绑定的命名空间URI,如果没有,返回`null`,如果参数为`null`,返回默认的命名空间.



### normalize

节点格式化

```js
element.normalize();
```

`Node.normalize()` 方法将当前节点和它的后代节点”规范化“（normalized）。在一个"规范化"后的DOM树中，不存在一个空的文本节点，或者两个相邻的文本节点。



注1：“空的文本节点”并不包括空白字符(空格，换行等)构成的文本节点。

注2：两个以上相邻文本节点的产生原因包括：

1. 通过脚本调用有关的DOM接口进行了文本节点的插入和分割等。
2. HTML中超长的文本节点会被浏览器自动分割为多个相邻文本节点。



### removeChild

移除节点

```js
let oldChild = node.removeChild(child);
```

被移除的这个子节点仍然存在于内存中,只是没有添加到当前文档的DOM树中,因此,你还可以把这个节点重新添加回文档中,当然,实现要用另外一个变量比如`上例中的oldChild`来保存这个节点的引用.



### replaceChild

替换指定节点

```js
parentNode.replaceChild(newChild, oldChild);
```



- **newChild**

用来替换 `oldChild` 的新节点。如果该节点已经存在于 DOM 树中，则它首先会被从原始位置删除。

- **oldChild**

被替换掉的原始节点。















