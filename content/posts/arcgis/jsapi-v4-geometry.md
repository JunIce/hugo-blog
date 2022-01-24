---
title: "ArcGIS V4 -- Geometry 之 Point、Polyline、Circle"
date: 2022-01-19T22:06:46+08:00
draft: true
tags: ["Javascript", "ArcGIS", "ArcGIS-V4"]
categories: ["ArcGIS"]
---


# Geometry

地理属性

## Point

点位，当我们需要在地图上标出点位时，即需要使用这样的API

```js

var point = new Point({
    latitude: ,// 纬度
    longititude:, // 经度
    spatialReference: {wkid: } // 空间参考坐标系
})

```

另一种写法

```js
var point = {
    type: 'point',
    longitude: -49.97,
    latitude: 41.73
}
```

这种`json`会自动转换成`Point`对象实例


## Polyline

线段

```js

var line = new Polyline({
    paths: [
        [longititude, latitude],// 起点
        [longititude, latitude],// 终点
    ],
    spatialReference: {wkid: } // 空间参考坐标系
})

// 自动转换
var line = {
    type: "polyline", // autocasts as new Polyline()
    paths: [[-111.3, 52.68], [-98, 49.5], [-93.94, 29.89]]
}

```
由于线段至少需要2个点才能确定，即一个起点一个终点， 所以`paths`中元素数量必须大于2


## Circle

圆圈

```js

var line = new Circle({
    center: [ -113, 36 ], // 中心
    geodesic: true, // 
    numberOfPoints: 100, // 圆的弧线由多少个点组成
    radius: 100, // 半径
    radiusUnit: "kilometers" // 半径单位 "feet"|"kilometers"|"meters"|"miles"|"nautical-miles"|"yards"
    spatialReference: {wkid: } // 空间参考坐标系
})

// 自动转换
var line = {
    type: "circle", // autocasts as new Polyline()
    center: [ -113, 36 ], // 中心
    geodesic: true, // 
    numberOfPoints: 100, // 圆的弧线由多少个点组成
    radius: 100, // 半径
    radiusUnit: "kilometers" // 半径单位 "feet"|"kilometers"|"meters"|"miles"|"nautical-miles"|"yards"
    spatialReference: {wkid: } // 空间参考坐标系
}

```

