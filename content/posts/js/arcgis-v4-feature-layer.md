---
title: "Arcgis V4 Feature Layer"
date: 2022-01-18T16:44:35+08:00
draft: true
tags: ["Javascript", "ArcGIS", "ArcGIS-V4"]
categories: ["ArcGIS"]
---

# Feature Layer

特性图层， 是我们除了基础地图图层使用比较多的图层 API 了

```JS

var layer = new FeatureLayer({
    url: ''// 特性图层的请求api， 可以是官方的， 也可以是自己发布的图层地址
    objectIdField: "ObjectID", // 如果不是远程图层链接，而是自己定义的数据源，这个值必须定义
    geometryType: "point", // 地理属性
    spatialReference: { wkid: 4326 },
    source: // 地图数据源，当没有远程图层地址时，可以自己构造数据源,
    popupTemplate: // 自定义弹出窗的对象,
    renderer: // 自定义render函数
})
```

### 加入到地图中

```js
var layer = new FeatureLayer();

map.add(layer); // 添加到图层中
```

### url 请求中附带参数

```js
new FeatureLayer({
  url: "http://xxxxxxxxx",
  customParameters: {
    foo: "foo",
  },
});
```

最终请求会是

> http://xxxxxxxxx?foo=foo

### 控制图层中需要展示的字段


在`Graphic`中的`attributes`属性中的字段，可以暴露给图层使用

```js
{
    fields：[
        {
            name: "ObjectID",
            alias: "ObjectID",
            type: "oid"
        },
        {
            name: "description",
            alias: "Description",
            type: "string"
        },
        {
            name: "title",
            alias: "Title",
            type: "string"
        }
    ]
}
```

通过设置`outFields: [*]`属性，进一步可以暴露给


### 控制显示隐藏

```js
layer.visible = true / false; // 直接控制显示隐藏
```

### 异步请求接口添加、修改图层上的地图数据

```js
layer.applyEdits({
  addFeatures: [source], // => 添加数据
  updateFeatures: [source], // => 更新数据
  deleteFeatures: [source], // => 删除数据
}); // => 返回一个promise then函数
```

### 显示对应的文字

```js
layer.labelsVisible = true
```

- labelingInfo: [labelClassInstance]

通过控制`labelingInfo`可以进一步控制我们图层需要展示的字段，以及对应的文字大小、颜色等属性

```js
const statesLabelClass = new LabelClass({
  labelExpressionInfo: { expression: "$feature.NAME" },
  symbol: {
    type: "text", // 文本
    color: "black", // 字体颜色
    haloSize: 1, // 字体边框尺寸
    family: // 字体
    haloColor: "white" // 边框颜色
  }
});

featureLayer.labelingInfo = [ statesLabelClass ];
```

### 根据不同的字段值，展示不同的样式

通过自定义`renderer`来控制显示不同的`symbol`

```js
layer.renderer = {
    type: "unique-value",  // 唯一值
    field: "REGION", // 需要判断的字段值
    defaultSymbol: {} // 默认展示的symbol
    uniqueValueInfos: [
        {
            value: "North", // 不同的值显示不同的symbol
            symbol: {
                type: "simple-fill",  // 这里灵活度比较高了，可以是图片、点、线等。。。自定义的图标
                color: "blue"
            }
        }
    ],
    visualVariables: [ // 视觉变量
        // 定义不同的视觉变量
    ]
}
```


