---
title: "ArcGIS V4 之 PopupTemplate使用手册"
date: 2022-01-09T17:01:02+08:00
draft: true
tags: ["Javascript", "ArcGIS", "ArcGIS-V4"]
categories: ["ArcGIS"]
---

## PopupTemplate

`PopupTemplate` 即 地理要素的显示弹窗

这个在我们地图应用中是经常使用的，所以这里我们把它研究透了

正常使用呢我们都是配合`Layer`或者`Graphic`去使用，Layer中有个popupTemplate属性，就是我们这里的实例

```js

let popupTemplate = {
    title: // 弹窗标题，
    content: // ... 内容
}

let layer = new FeatureLayer({
    // ...,
    popupTemplate,
})

```

## 属性

- actions

返回弹窗模版上的操作按钮，默认上面有两个，一个是定位到当前点，另一个是缩放到右上角

- content

这里`content`的值，可以是`文本`，可以是一个`function`， 可以是`dom element`， 也可以是`fields`字段组成的数组，它会自动渲染成一个字段组成的表格

文本中使用`{fieldName}`来包裹字段值, 会自动渲染成字段属性

```js
popupTemplate = {
    title: string, //
    content: {
        type: string // "text"|"fields"|"media"|"attachments"|"custom"|"expression" 可选值
    }
}
```

### CustomContent 自定义渲染`content`

这里就单独研究一下这个，其他像`media`, `attachments`什么的灵活度没这个高，只不过再次做了封装，如果要做自定义弹窗，大概率那些模版你也是用不着了，不符合需求了。

```js

let customContent = new CustomContent({
    outFields: [*],
    creator: function() {
        // return  ....
    }
})

```

`creator` 这里可以返回一个promise， 可以返回文本， 可以返回html string， 所以这里可以做的操作就比较多了，可以查询接口后返回数据

- outFields 可以暴露给模版使用的字段

- overwriteActions 是否可以覆盖操作按钮

- fieldInfos
