---
title: "ArcMap使用笔记1"
date: 2022-01-08T21:14:32+08:00
draft: true
---

# ArcMap使用笔记1

## 元数据

我们从数据库中导出需要展示的地图数据，其中数据肯定是要包含经纬度的

我们把数据导出为`csv`格式，方便ArcMap处理数据

## 设置图层坐标系

这一步很重要，直接决定最终展示的数据是否正确

右击图层，选中`坐标系`选项卡, 就可以选择需要展示的坐标系了

### 地理坐标系

地理坐标系以地轴为极轴，所有通过地球南北极的平面均称为子午面。地理坐标，就是用经纬度表示地面点位的球面坐标。
属于真实的地理坐标

地理坐标系以度为单位；

地理坐标系：为球面座标，参考平面地是椭球面，坐标单位：经纬度。

比如：北京54、西安80、WGS84

### 投影坐标系

使用基于X，Y值得坐标系统来描述地球上某个点所处的位置。这个坐标系是从地球的近似椭球体投影得到的，它对应于某个地理坐标系。

平面坐标系统地图单位通常为米，或者是平面直角坐标。

## 处理数据

![map1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d564573f93f4b2ca03907c55798debc~tplv-k3u1fbpfcp-watermark.image?)


![map2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd7a16ca5d0a4c2488dcb7efd019a37a~tplv-k3u1fbpfcp-watermark.image?)


1. 把右侧工具栏的csv文件直接拖到中间地图层

![map3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b20dd01d81f46a2b4fc76abaabeadfc~tplv-k3u1fbpfcp-watermark.image?)

2. 右击该数据，选中`显示XY数据`


![map4.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40479d42c8934987b5b1bed3c4cf40f9~tplv-k3u1fbpfcp-watermark.image?)

3. 选择需要展示的X、Y展示的字段，这里需要注意的是，地图的X字段其实是精度，Y是纬度，而我们数据库有时候储存的x是纬度，y是精度，这里有坑，不小心就很难排查


![map5.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c89ea2b44c64b10ba4937204685f9e4~tplv-k3u1fbpfcp-watermark.image?)

4. 这里我们就能看到需要展示的点就出现在我们的创建图层中了， 如果没有数据的话，右击选择缩放到图层，就能展示了


![map6.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10faac35409345f7b7b91ebbcad8b4cd~tplv-k3u1fbpfcp-watermark.image?)

![map7.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/387f1ff83a1e475098b0aaa648273892~tplv-k3u1fbpfcp-watermark.image?)


5. 现在数据还不能直接发布为服务，需要我们把数据转成`shapefile`的形式。


![map8.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e7c65af560a4f0cba49dc2cfd8e550e~tplv-k3u1fbpfcp-watermark.image?)


6. 右击导出数据，将图层的所有数据源导出，这里我们可以重命名，


![map9.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9ec27bdbc6747e89ceeb2bf0ce43a46~tplv-k3u1fbpfcp-watermark.image?)


7. 在导出数据之后，会把我们之前导出的数据直接导入到图层之中，我们会看到有两个数据源，这里我们可以把第二个csv的数据源从当前图层中删除掉


![map10.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2c06d0616b94ec09d98256a98cd7776~tplv-k3u1fbpfcp-watermark.image?)

8. 在菜单`文件`中找到`分析地图`按钮，查看当前地图还有什么错误


![map11.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68a9da3347da49f188faef78daf971d4~tplv-k3u1fbpfcp-watermark.image?)

9. 菜单`文件`，分享到服务


![map12.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4796be6a4964f5db8afe7b5050c38b8~tplv-k3u1fbpfcp-watermark.image?)



10. 选择发布到新服务，选择一个已经建立的远程arcgis server服务，如果没有，需要先建立，


![map13.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/932812c0df5449e0a29f66c90be44b1b~tplv-k3u1fbpfcp-watermark.image?)

11. 发布之前先点一下分析，如果有错需要先解决，不然不能发布成功，最后点击发布，会把当前的数据复制到远程服务器上



![map14.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6e34eb99e574af8b661e3bc60ebeede~tplv-k3u1fbpfcp-watermark.image?)

12. 登录远程arcgis server 服务， 我们可以看到之前发布的服务已经成功了，找到`REST URL`,即我们在前端可以调用的restful服务了


![map15.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6409aff8aab49f293506999015ca3e5~tplv-k3u1fbpfcp-watermark.image?)


![map16.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d74f46cc9bb84cd384d34ce2385d9de1~tplv-k3u1fbpfcp-watermark.image?)


![map17.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6833646a4e84a139bc93c5619cf40f5~tplv-k3u1fbpfcp-watermark.image?)


总结完毕


