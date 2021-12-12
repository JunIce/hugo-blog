---
title: "Arcgis Js常用API整理 -- Map"
date: 2021-12-12T10:48:48+08:00
draft: true
tags: ["Javascript", "ArcGis", "ArcGis-V3"]
---

## Arcgis Js常用API整理

### Map

Map即`ArcGIS`中地图类，每个应用中一个地图即对应一个地图实例

> new Map(containerId, options?)

```html
    <div id="map"></div>
```

```js
    var map = new Map('#map', {

    })

    // 后续map的属性就可以通过map的实例获取，方法也是在实例对象上操作
```

#### options

- basemap : `string`

对应的基础地图
可选值

> "streets" , "satellite" , "hybrid", "topo", "gray", "dark-gray", "oceans", "national-geographic", "terrain", "osm", "dark-gray-vector", gray-vector", "streets-vector", "streets-night-vector", "streets-relief-vector", "streets-navigation-vector" and "topo-vector"

这些都是 arcgis 官方提供的地图，如果需要自定义地图，后续通过自定义的切片`layer`传入


- center: `array & new Point()`

地图定位中心

> [`longtitude`, `latitude`] 或者一个`Point`实例

- autoResize: `boolean`

当浏览器窗口发生变化时，地图自动重绘

- lods: `lod[]`

当使用切片地图的时候，自定义分辨率和比例

- logo: `true`

是否展示`ArcGIS` 的官方logo

- extent： `new Extent()`

地图边界，即自定义地图的边界大小，如果定义了，地图讲不能超出边界

- maxScale : `number`
- minScale

最大和最小可视比例，如果定义了就不能变焦超过这个值

- maxZoom: `number`
- minZoom

变焦值，如果定义了就不能变焦超过这个值，
没有定义就根据`scale`值进行计算

- nav: `boolean`

是否展示导航按钮，默认关闭

- scale： `number`

初始地图的缩放比例

- showAttribution: `boolean`

是否展示地图的属性，展示在logo的旁边， 默认关闭

- slider
- sliderLabels
- sliderOrientation
- sliderPosition
- sliderStyle

地图操作按钮的相关属性，即放大或缩小，位置，样式等自定义

- wrapAround180

用来设置是否180旋转，因为地球是圆形的，但是地图是平面的，所以当过日期线时，是否连接显示

以下情况下才支持

> WGS84 坐标系 或者 墨卡托坐标系时
> ArcGIS/Google Maps/ Bing 卡片地图
> 

#### methods

- addLayer
- addLayers: `layer[]`
addLayer(layer,index) 添加其他图层,当需要展示其他图层时需要使用

- attr
给地图添加其他属性

> map.attr(key, value)


- centerAndZoom

重新定义地图中心点和焦距值

> map.centerAndZoom(new Point([x, y]), number)

- centerAt

移动地图中心

> map.centerAt(new Point([x, y]) || [x, y])

- destroy

销毁地图实例

> map.destroy()

- disableDoubleClickZoom

禁止点击地图缩放

> map.disableDoubleClickZoom()

- disablePan

禁止鼠标操作上下左右

> map.disablePan()

- load

> map.on('load', function() { \
>  ...your code
> })