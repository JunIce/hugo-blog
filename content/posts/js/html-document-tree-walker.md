---
title: "HTML Dom -- document.createTreeWalker"
date: 2022-01-15T10:23:19+08:00
draft: true
---

# [document.createTreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker)

常规我们获取dom下所有的子元素都是通过遍历的形式， 类似`for`循环判断`nodeType`的形式获取到真实的dom

今天发现MDN文档中还有一个api就是 `createTreeWalker`, 可以获取到元素下所有的子元素


> document.createTreeWalker(root[, whatToShow[, filter[, expandEntityReferences]]]);


## Attributes

- root 需要获取的根节点

- whatToShow 配置项， 可以根据配置是获取所有的元素、属性、等。。。 具体的写法就是`NodeFilter`
 
    具体的配置就是[NodeFilter](https://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-NodeFilter)

- filter

    filter是一个对象, 其中`acceptNode`是一个必传的参数， 值是一个函数，可以通过函数进行业务类型的过滤

    ```js
    {
        acceptNode: function(Node) {
            // 业务代码
        }
    }
    ``` 


### 可以根据 `treeWalker.currentNode` 获取当前指针指向的节点

## Methods

- firstChild

获取`treeWalker`实例的第一个子元素

- lastChild

获取`treeWalker`实例的最后一个子元素

- nextNode

移动`currentNode` 指针到下一个可见元素

- nextSibling

获取`currentNode`的之后的兄弟节点

- parentNode

获取`currentNode`的父节点

- previousNode

获取`currentNode`的前一个节点

- previousSibling

获取`currentNode`的之前的兄弟节点





## example code


```html

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>createTreeWalker</title>
</head>

<body>

    <div class="container">
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
        </ul>
    </div>


    <script>

        function log (data) {
            console.log('data :',data)
        }

        var container = document.querySelector(".container")

        var tree = document.createTreeWalker(container, 1)

        let currentNode = tree.currentNode; // 获取当前节点指针

        log(currentNode) // body > div

        tree.nextNode() // 移动指针

        log(tree.firstChild()) // <li>1</li>

        tree.parentNode() // 切换到父节点

        log(tree.lastChild()) // <li>6</li>

        log(tree.previousSibling()) // <li>5</li>
        log(tree.previousNode()) // <li>4</li>
    </script>

</body>

</html>

```



