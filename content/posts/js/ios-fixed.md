---
title: "IOS端h5 fixed滚动问题"
date: 2023-05-11T10:18:32+08:00
tags: ["ios-fixed"]
categories: ["h5"]
draft: false
---


# IOS端h5 fixed滚动问题



```ts

visualViewport.addEventListener("resize", resizeHandler);

const resizeHandler = () => {
    // ...
}

```

```ts
// 需要针对 iOS 越界弹性滚动的情况进行边界检查
styles.left = Math.max(0, Math.min(
    document.documentElement.scrollWidth - visualViewport.width,
    visualViewport.offsetLeft
)) + 'px';

// 需要针对 iOS 越界弹性滚动的情况进行边界检查
styles.top = Math.max(0, Math.min(
    document.documentElement.scrollHeight - visualViewport.height,
    visualViewport.offsetTop
)) + 'px';

styles.width = visualViewport.width + 'px';
styles.height = visualViewport.height + 'px';

```



## Reference

[https://tkte.ch/articles/2019/09/23/iOS-VisualViewport.html](https://tkte.ch/articles/2019/09/23/iOS-VisualViewport.html)


[MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)

[http://www.alloyteam.com/2020/02/14265/](http://www.alloyteam.com/2020/02/14265/)