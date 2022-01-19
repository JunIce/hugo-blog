---
title: "Event - MouseEvent"
date: 2022-01-01T10:58:05+08:00
draft: true
---

## MouseEvent 相关属性详解

- `clientX`
- `clientY`
- `x`
- `y`

    鼠标坐标到浏览器可视区域的坐标


- `layerX`
- `layerY`

    鼠标相对最近的有定位的父元素的坐标，突出有定位， 如果自身有定位，就是相对自身， 类似`offset*`

- `movementX`
- `movementY`

    相对于上一个`mousemove`事件的触发的鼠标移动距离

- `offsetX`
- `offsetY`

    鼠标坐标相对 触发事件的父元素的坐标

- `pageX`
- `pageY`

    相对于整个文档的坐标，如果坐标发生滚动，即要算上滚动的距离

- `screenX`
- `screenY`

    相对于屏幕的坐标

- `altKey` boolean

    确定是否按下了`Alt`键

-  `ctrlKey`

    判断是否按下了`ctrl`键

-  `shiftKey`

    判断是否按下了`shift`键

-  `bubbles` boolean

    是否冒泡  默认为true

- `button`  0、1、2、3、4

    代表用户按下并触发了事件的鼠标按键

    > 0 主按键，通常指鼠标左键或默认值 \
    > 1 辅助按键，通常指鼠标滚轮中键 \
    > 2 次按键，通常指鼠标右键 \
    > 3 第四个按钮，通常指浏览器后退按钮 \
    > 4 第五个按钮，通常指浏览器的前进按钮 \

    <b>对于配置为左手使用的鼠标，按键操作将正好相反。此种情况下，从右至左读取值。</b>

- `cancelBubble`

    `stoppropagation`和`cancelBubble`的作用是一样的,阻止浏览器默认的事件冒泡行为
    `stoppropagation` 属于W3C标准
    `cancelBubble` 属于IE标准

- `cancelable`

    判断是否可以用`preventDefault`取消事件，如果可以则为true

-  `composed`

    继承于`Event`, 用于判断事件是否可以从`Shadow Dom` 传递到真实`Dom`,
    可以调用`composedPath` 查看事件传播路径

-  `currentTarget`

    事件沿着dom触发时的当前目标

-  `target`

    事件触发的目标

-  `detail`

    鼠标点击的次数

- `returnValue`

- `isTrusted`

    是否可信。 Chrome, Firefox and Opera中 用户触发的为可信，脚本触发的为不可信。 IE中， 所有的事件都是可信的，出了通过`createEvent`创建的事件

-  `sourceCapabilities`

    事件来源， 属于`UI.Event`. 当`firesTouchEvents`为true时，表示属于touch事件。

- `which`

    触发事件时，按下的键的`keyCode`值。


![mouseevent](/snapshots/mouseevent.png)




