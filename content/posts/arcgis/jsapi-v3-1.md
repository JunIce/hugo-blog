---
title: "ArcGIS Js API -- 本地安装部署"
date: 2021-12-01T10:40:11+08:00
draft: true
tags: ["Javascript", "ArcGIS", "ArcGIS-V3"]
categories: ["ArcGIS"]
---

## ArcGIS 学习笔记

本篇教程都是基于`ArcGIS version 3.19`

![version](/snapshots/gis-1.png)

> `GIS` 地理信息系统（Geographic Information System 或 Geo－Information system，GIS）有时又称为“地学信息系统”。它是一种特定的十分重要的空间信息系统。

> `ArcGIS` 产品线为用户提供一个可伸缩的，全面的 GIS 平台.

### 下载

常规我们在使用相关 api 的时候可以引用 cdn 上的相关 js，这里我们需求是部署在自己的服务器上，所以我们要把相关包下载下来

![version](/snapshots/gis-2.png)
![version](/snapshots/gis-3.png)

api 下载链接，这里直接提供出来，找到相应版本，最新版本已经是`V4`了，后续我们在学习新

[http://links.esri.com/javascript-api/latest-download](http://links.esri.com/javascript-api/latest-download)

其中有一个`sdk`， 一个`api`相关的压缩包

![version](/snapshots/gis-4.png)

建议 sdk 也下载下来，不然墙太高，你访问太慢了

### 部署

这里需要我们先修改一下文件中的参数

`arcgis_js_api\library\3.19\3.19\init.js` 和 `arcgis_js_api\library\3.19\3.19\dojo\dojo.js`

找到上面 2 个 js 文件，替换中间的`[HOSTNAME_AND_PATH_TO_JSAPI]`变量， 替换成你部署服务的相对地址

我的服务在8080上，这里替换成`localhost:8080/arcgis_js_api/library/3.19/3.19`

这里其实`js api`中提供了一个安装教程`/arcgis_js_api/library/3.19/install_linux.html`,不会可以打开看一下

### 使用

这里给一个可运行的最小 demo

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Custom Map</title>

    <!-- 引入的相关静态资源 -->
    <link
      rel="stylesheet"
      type="text/css"
      href="/arcgis_js_api/library/3.19/3.19/dijit/themes/tundra/tundra.css"
    />
    <link
      rel="stylesheet"
      type="text/css"
      href="/arcgis_js_api/library/3.19/3.19/esri/css/esri.css"
    />
    <script
      type="text/javascript"
      src="/arcgis_js_api/library/3.19/3.19/init.js"
    ></script>
    <style>
      html,
      body,
      #map {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map;
        // amd 资源的加载方式， 这里我们需要注意的是，如果需要使用第三方的库，比如jquery，需要在 init.js 之前引入，不然会报错
      require(["esri/map", "esri/layers/ArcGISTiledMapServiceLayer"], function (
        Map,
        ArcGISTiledMapServiceLayer
      ) {
        map = new Map("map", {
          center: [116.3, 39.9]
        });

        // 加载切片地图服务，这里我们使用的是一个网上提供的地图服务
        var mapService = new ArcGISTiledMapServiceLayer(
          "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer"
        );
        map.addLayer(mapService);
      });
    </script>
  </body>
</html>
```
- amd 资源的加载方式， 这里我们需要注意的是，如果需要使用第三方的库，比如jquery，需要在 init.js 之前引入，不然会报错

### 运行

如果没有安装`http-server`, 先安装一下

> npm i -g http-server

next

> http-server

打开 `localhost:8080`



