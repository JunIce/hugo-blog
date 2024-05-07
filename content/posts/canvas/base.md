---
title: canvas基础知识
date: 2024-05-06T13:41:27+08:00
draft: true
tags: ["canvas"]
categories: ["canvas"]
---

# canvas 基础知识

## transform 矩形变换之后的坐标计算

```js
ctx.transform(scaleX, skewX, skewY, scaleY, transX, transY);
ctx.transform(a, b, c, d, e, f);
```

```text
[ a  c  e ]
[ b  d  f ]
[ 0  0  1 ]
```

- transform旋转指定角度

```js
ctx.transform(cos(弧度),sin(弧度),-sin(弧度),cos(弧度),0,0);
```

- 倾斜

```js
matrix(1,tan(θy),tan(θx),1,0,0)
```

- 计算变换之后的坐标

```js
function transformPoint(x, y, a, b, c, d, e, f) {
  return {
    x: a * x + c * y + e,
    y: b * x + d * y + f,
  };
}
```

重置矩阵

```js
context.setTransform(1, 0, 0, 1, 0, 0);
```



## References

[css3 transforms](https://www.zhangxinxu.com/wordpress/2012/06/css3-transform-matrix-%E7%9F%A9%E9%98%B5/)