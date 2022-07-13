---
title: "HTML -- Element元素滚动"
date: 2022-07-13T15:19:56+08:00
tags: ["元素滚动"]
categories: ["js"]
draft: false
---









## 判断元素是否可以滚动



### 通过设置元素的scrollTop后再查看是否变化



```js
function eleCanScroll(ele) {
  if (!ele instanceof HTMLElement) {
    console.log("fuck off");
    return;
  }
  if (ele.scrollTop > 0) {
    return true;
  } else {
    ele.scrollTop++;
    // 元素不能滚动的话，scrollTop 设置不会生效，还会置为 0
    const top = ele.scrollTop;
    // 重置滚动位置
    top && (ele.scrollTop = 0);
    return top > 0;
  }
}
```



### 元素通过scrollHeight判断



```js
const isScrollable = function (ele) {
    // Compare the height to see if the element has scrollable content
    const hasScrollableContent = ele.scrollHeight > ele.clientHeight;
 
    // It's not enough because the element's `overflow-y` style can be set as
    // * `hidden`
    // * `hidden !important`
    // In those cases, the scrollbar isn't shown
    const overflowYStyle = window.getComputedStyle(ele).overflowY;
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;
 
    return hasScrollableContent && !isOverflowHidden;
};

```

