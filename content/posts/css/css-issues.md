---
title: "css常见问题总结"
date: 2022-04-09T16:31:19+08:00
draft: true
categories: ["css"]
---





## 1. 如果父元素的 transform , perspective 或 filter 属性不为 none 时， fixed 元素就会相对于父元素来进行定位。



> ```text
> For elements whose layout is governed by the CSS box model, any value other than none for the transform property also causes the element to establish a containing block``for` `all descendants.
> Its padding box will be used to layout``for` `all of its absolute-position descendants, fixed-position descendants, and descendant fixed background attachments.
> ```


## 2. h5 ios端安全距离处理


```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover" />
```

```css
@supports (padding-bottom: constant(safe-area-inset-bottom)) or (padding-bottom: env(safe-area-inset-bottom)) {
  #selector {
    padding-bottom: 0px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```
