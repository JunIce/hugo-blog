---
title: "ArcGIS Js V3 常用API "
date: 2021-12-12T14:22:05+08:00
draft: true
tags: ["Javascript", "ArcGIS", "ArcGIS-V3"]
categories: ["ArcGIS"]
---

## Extent

边界信息

- xmin

左下 x 坐标

- ymin

左下 y 坐标

- xmax

右上 x 坐标

- ymax

右上 y 坐标

- spatialReference

坐标参考系

- type

`point` | `multipoint` | `polyline` | `polygon` | `extent` //点、多点、线、面

### methods

- contains

判断一个坐标是否在这个边界内

> extent.contains(graphic.geometry)

- expand

扩大边界 

> map.setExtent(points.getExtent().expand(1.5)) \
> // 即原来的范围下扩大50%

- getCenter

> extent.getCenter() => Point 

- getWidth
- getHeight

x之间和y之间的距离

- union

两个边界实例进行合并

> extent1.union(extent2) => Extent

- update

更新当前的边界实例

> update(xmin, ymin, xmax, ymax, spatialReference)

```js
const extent = new Extent(xmin, ymin, xmax, ymax, spatialReference);
// your code
```

## Credential

创建一个凭据用于验证服务是否可用

- expires

过期时间

- isAdmin

是否为管理员授权

- server

验证权限的 url

- userId

授权相关的用户 id

- token

对应的 token

- oAuthState

如果设置这个对象，讲会在想对应的 cookie 中包含一个`state`对象

```js
... // 对应map实现
const credential = new Credential({
    expires: +new Date(),
    userId: xxx,
    isAdmin: boolean,
    server: url
    // ...
})

const layer = new ArcGISTiledMapServiceLayer({
    credential: credential
})

map.addLayer(layer)
```

## domUtils

看名字就知道是操作 dom 的，其实用 jquery 也没啥不好 😁

### methods

- getNode

> domUtils.getNode(HTMLElement) => HTMLElement

- show

- hide

- toggle

操作 dom 元素的现实隐藏，类似 jq 中的同名 api

> domUtils.show(HTMLElement)
> domUtils.hide(HTMLElement)
> domUtils.toggle(HTMLElement)

```html
<div class="target_node"></div>
```

```js
$("#toggle-button").click(() => {
  domUtils.toggle(document.querySelector(".target_node"));
});
```
