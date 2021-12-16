---
title: "Arcgis Js V3 常用API Point、Multipoint、Polyline、Polygon、Circle"
date: 2021-12-12T15:54:27+08:00
draft: true
tags: ["Javascript", "ArcGis", "ArcGis-V3"]
---

## Point

ArcGIS 中点位的确定，常用于定位某个具体的经纬度

> new Point(x, y, spatialReference?) \
> new Point([x, y], spatialReference) \
> new Point({"x": -122.65, "y": 45.53, "spatialReference": {"wkid": 4326 } })

### methods

- getLatitude()
- getLongitude()

获取墨卡托坐标系下的经度/纬度信息

- offset(dx, dy)

点位偏移

- setX(x)
- setY(y)

单独设置点位的 x/y

- update(x, y)

更新当前点位

## Multipoint

字面意思就是多个点

初始化方式

- json

```js
var multipoint = new Multipoint({
  points: [
    [-122.63, 45.51],
    [-122.56, 45.51],
    [-122.56, 45.55],
  ],
  spatialReference: { wkid: 4326 },
});
```

- addPoint(point) / setPoint(index, point)

通过实例方法添加点位

## Polyline

ArcGIS 中需要画线的部分, 方法和`Multipoint`有重合

```js
var polylineJson = {
  paths: [
    [
      [-122.68, 45.53],
      [-122.58, 45.55],
      [-122.57, 45.58],
      [-122.53, 45.6],
    ],
  ],
  spatialReference: { wkid: 4326 },
};

var polyline = new Polyline(polylineJson);
```

## Polygon

多边形，注意的是，第一个点和最后一个点必须相同

```js
var polygonJson = {
  rings: [
    [
      [-122.63, 45.52],
      [-122.57, 45.53],
      [-122.52, 45.5],
      [-122.49, 45.48],
      [-122.64, 45.49],
      [-122.63, 45.52],
      [-122.63, 45.52],
    ],
  ],
  spatialReference: { wkid: 4326 },
};
var polygon = new Polygon(polygonJson);
```

- addRing(ring)

可以添加 point 或者 point[]

## Circle

画圆，需要确定的中心和半径， 默认半径为1000

```js
var circleGeometry = new Circle([-117.15, 32.71], {
  radius: 2000,
});
```

- radiusUnit

> esri.Units.METERS // 米
> esri.Units.MILES // 海里

