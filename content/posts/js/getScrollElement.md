---
title: "js 获取滚动元素"
date: 2023-06-03T20:25:49+08:00
draft: false
tags: ["JS"]
---


# js 获取滚动父元素


```javascript
const isScrollable = function (ele) {
    const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

    const overflowYStyle = window.getComputedStyle(ele).overflowY;
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

    return hasScrollableContent && !isOverflowHidden;
};

const getScrollableParent = function (ele) {
    return !ele || ele === document.body
        ? document.body
        : isScrollable(ele)
        ? ele
        : getScrollableParent(ele.parentNode);
};
```