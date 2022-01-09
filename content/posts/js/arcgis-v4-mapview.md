---
title: "Arcgis V4 MapView使用手册"
date: 2022-01-09T15:12:03+08:00
draft: true
---

## MapView

继承于`View`

v4版本中使用`MapView`来展示2D面地图，所以了解`MapView`的相关特性是有必要的

3D使用`ScenceView`来展示

```js
let myMap = new Map({
    // ...
})

let view = new MapView({
    container: htmlElementContainer, // domElement
    map: myMap
})
```

### 属性

- `allLayerViews`  获取所有`LayerViews`集合

- `animation` 定位动画

- `background` 背景颜色

- `basemapView` 

- `breakpoints` 监听长宽的变化阀值， 类似`bootstrap`的响应式，代替监听`resize`, `size`方式

```js
// 代替监听
view.watch(size)
view.watch(resizing)

// Set up a watch handle for breakpoint
view.watch("widthBreakpoint",function(breakpoint){
  switch (breakpoint) {
    case "xsmall":
    // do something
      break;
    case "small":
    case "medium":
    case "large":
    case "xlarge":
    // do something else
      break;
    default:
  }
});
```

- `center` 定义地图中心， 传入一个经纬度数组

```js
view.center = [-112, 38]

```

- `constraints` 定义地图限制，包括 `scale`、 `zoom`、等属性

- `declaredClass` 定义地图mapview的dom类名，方便做样式覆盖

- `extent` 定义地图的可视部分

- `fatalError` 用于监听渲染中的错误

```js

view.watch("fatalError", function(err){
    // error
})

```

- `focused` 用于定义浏览器是否聚焦地图

- `graphics` 用于增加或删除地图上增加的地理标记

- `interacting` 视图是否在交互过程中

- `layerViews` 一个`layerview`组成的集合

- `magnifier` 

- `map` 地图实例

- `navigating` 视图是否可以被导航

- `navigation` 配置化定义导航的一些操作

- `orientation` 定义展示方向

- `padding` 定义视图的边距值

- `popup` 定义视图的弹窗， 你可以自定义弹窗的样式、位置、内容

- `ready` 视图是否加载完毕

- `resizeAlign` 当浏览器窗口大小发生改变时，锚点位置

- `rotation` 旋转角度

- `scale` 视图比例尺

- `size` 返回当前视窗的长宽 [width, height]

- `spatialReference` 定义视窗的空间参考， 定义地理坐标系统

- `stationary` 是否是固定的，当视窗发生变化，这个值为false

- `suspended` 是否停止渲染 ， 为true时不渲染

- `timeExtent` 时间范围，定义数据的时间范围

- `updating` 当前视图是否在更新

- `viewpoint` 改变当前视图的视点

- `zoom` 当前视图的变焦值

### 事件

- `on` 视图的注册事件， 返回一个事件解除函数

- `emit` 触发注册事件

- `focus` 聚焦视图

- `destroy` 销毁视图

- `goTo` 跳转到指定的地理位置，返回一个Promise

- `hasEventListener` 是否有注册事件

- `takeScreenshot` 获取视图截图

- `toMap`
- `toScreen`

把指定点的数据转换成地图数据/屏幕数据

- `when`

当视图实例被创建的时候只会触发一次







