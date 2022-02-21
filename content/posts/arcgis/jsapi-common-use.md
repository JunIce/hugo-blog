---
title: "ArcGIS Js API -- 常用方法搜集"
date: 2022-02-12T11:59:53+08:00
draft: true
tags: ["Javascript", "ArcGIS", "ArcGIS-V4"]
categories: ["ArcGIS"]
---


## 禁用FeatureLayer的弹窗

```js
new FeatureLayer({
    popupEnabled: false // 
})
```

## 图层点击元素高亮

[https://stackoverflow.com/questions/60385619/arcgis-highlight-a-graphic](https://stackoverflow.com/questions/60385619/arcgis-highlight-a-graphic)

```js
let highlight
view.on("click", function(event){
  view.hitTest(event).then(function(response){
    if (response.results.length) {
      // 获取图层上点击元素
        let graphic = response.results[0].graphic; // new Graphic({})

        if(highlight) highlight.remove() // 存在先删除

        view.whenLayerView(graphic.layer).then(function(layerView){
            highlight = layerView.highlight(graphic); // 高亮
        });
    }
  });
});
```

