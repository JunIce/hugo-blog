---
title: "Arcgis Js V3 常用API "
date: 2021-12-12T14:29:06+08:00
draft: true
tags: ["Javascript", "ArcGis", "ArcGis-V3"]
---

## ArcGISTiledMapServiceLayer

自定义切片地图图层，和`ArcGISDynamicMapServiceLayer`不同的是，这个切片图层读取的是自定义 gis 服务的缓存，相当于提前制作好的地图，而`ArcGISDynamicMapServiceLayer`相当于是动态实时生成的，一般环境下，动态的不太可能，对服务实时性要求太高了

```js
const map = new Map(...)

const layer = new ArcGISTiledMapServiceLayer(serviceUrl, options?)

map.addLayer(layer) // 即渲染自定义切片地图了
```

### url

即自定义切片地图的 restful 地址

### options

- id

图层的自定义 id，可在 map 中根据 id 获取到对应的图层

- className

自定义图层 dom 类名

- visible

图层是否可见

- displayLevels: `number[]`

可以渲染的地图层级

- tileServers: `string[]`

自定义图层的 server 列表

- opacity : `number`

图层透明度

- refreshInterval： `number`

定时刷新图层

### methods

- attr(name, value)

设置图层属性

- getAttributionData()

获取图层所有属性

- getMap()

获取主地图实例

- show()
- hide()
- refresh()

图层显示、隐藏、刷新

- suspend()
- resume()

图层的停止渲染和恢复渲染

### On Style Events

可以用`on`监听的事件

> error、load、opacity-change、update、update-start、update-change...

### 示例代码

```js
var layer = new ArcGISTiledMapServiceLayer(mapRestService, {
  ...options,
});

map.addLayer(layer);

// layer methods

layer.attr("name", "hello world")

layer.getMap() => map instance

layer.show()

layer.hide()

layer.refesh()

// layer on methods
//....
layer.on("error", function () {});
```
