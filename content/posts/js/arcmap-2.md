---
title: "ArcMap使用 -- csv数据转换成 线段 图层制作"
date: 2022-01-20T09:10:13+08:00
draft: true
tags: ["ArcGIS Map"]
categories: ["ArcGIS"]
---

# 线段图层制作

### 1. 查看源数据是否符合要求

数据源中一定要包括开始点的经纬度和结束点的经纬度，只有开始点或者只有结束点，最后的图会有错误

### 2. 设置图层空间参考系

按要求设置即可，不同的地图由不同的要求

![p1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70cf9119eb0c42edbe324be0ddf152c9~tplv-k3u1fbpfcp-watermark.image?)

### 3. 源数据拖入到地图中

第一步先显示 XY 数据，即开始点的数据

![p2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c8c17ff699949b69afa3f3f0963badd~tplv-k3u1fbpfcp-watermark.image?)

![p3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cd139e3945f43d687802f19320c26e9~tplv-k3u1fbpfcp-watermark.image?)

![p4.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/265af4edfa2b471681fd328e48f5ce2e~tplv-k3u1fbpfcp-watermark.image?)

### 4. csv 数据导出为 shapefile 文件

这一步一定要转成 shapefile, 不然后期转出的数据有问题

![p5.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a642888e4b94a8ba2278570a47fd3fb~tplv-k3u1fbpfcp-watermark.image?)

![p6.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b4606ff45fa4bdb983f6589fcc8a70e~tplv-k3u1fbpfcp-watermark.image?)

![p7.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a45c468c533b4cadbccc7fdcdc376a7b~tplv-k3u1fbpfcp-watermark.image?)

### 4. XY 转线

菜单栏中`地图处理`->`ArcToolbox` 找到 `要素` -> `XY转线`

![p7-1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/937e1caa3b0a4e47945c6e6fdeb772dc~tplv-k3u1fbpfcp-watermark.image?)

![p8.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80311eef25ad49929625f3ff3b56605f~tplv-k3u1fbpfcp-watermark.image?)

![p9.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/965870b650a7451ab1ec6f9e497da2f6~tplv-k3u1fbpfcp-watermark.image?)

这里选中我们需要转换的数据，包括起点的经纬度、终点的经纬度等

![p10.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e0b8ad296fb4ab8843fd215eaf445d8~tplv-k3u1fbpfcp-watermark.image?)

### 5. 转换完成后即可以缩放到图层去查看是否已完成

![p11.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/227d488b460f4aa7a92b09af286cd419~tplv-k3u1fbpfcp-watermark.image?)

