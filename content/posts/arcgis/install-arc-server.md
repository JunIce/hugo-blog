---
title: "ArcGIS Server安装及常见问题"
date: 2022-01-08T21:05:54+08:00
draft: true
tags: ["ArcGIS Server"]
categories: ["ArcGIS"]
---

# 安装详细步骤

文章以 ArcGIS Server `v10.2` 为例

- 1.解压后的目录

![server0.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa0671f75bc84698b0f93f437f16638e~tplv-k3u1fbpfcp-watermark.image?)

- 2. 运行安装

如果你原来本地有其他低版本的， 建议先卸载了， 运行第一个`uninstall Utility`


![server1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/195bd22000af4cca98810832a8a70ad8~tplv-k3u1fbpfcp-watermark.image?)

点击ArcGIS Server  `setup`

- 3. 设置Account 

![server2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3cb79fa1e9b46f6828c5b6458139cbe~tplv-k3u1fbpfcp-watermark.image?)

这里会在你windows上创建一个用户账户， 如果是window10 ，建议就使用当前登录用户的账户密码，如果是win7 或者 windows server ，就重新建一个账户 类似

```c
 account : arcgis
 password: arcgis
```
网上其他文章都是建议使用arcgis作为用户名

但是我实际在win10上安装，有问题，不能登录


- 4.选择不要配置文件
![server3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c58f1b3fe163474aaaaf76de3379329b~tplv-k3u1fbpfcp-watermark.image?)

- 5. 选择ecp授权文件

![server5.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a10d4ae4dfbe4678bbe9e8ac2622a15f~tplv-k3u1fbpfcp-watermark.image?)

![server6.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9496673509104014982cd7186d473ccf~tplv-k3u1fbpfcp-watermark.image?)

- 6. 打开

`http://localhost:6080/arcgis/manager`

创建一个新站点

## 最后到这里会安装完毕

# 问题

## 1. 安装完毕后不能创建新站点

问题描述： 进入`http://localhost:6080/arcgis/manager`后一直在loading

方案： 
![q4.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce1ddb1a36644d0cb611df78942bc9ba~tplv-k3u1fbpfcp-watermark.image?)

如果你可以打开 `http://localhost:6080/arcgis`
进入 `http://localhost:6080/arcgis/admin` 后创建一个账户，这个过程可能会很长，直到出现


![q2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9ed22fe261e47bda14b9fc73045dacd~tplv-k3u1fbpfcp-watermark.image?)

再次打开 `http://localhost:6080/arcgis/manager` 就可以用刚刚的账户登录了

## 2. Server machine is not a local server machine

创建站点时报错 `Server machine is not a local server machine`

找到`ArcGIS Server`安装目录文件 `C:\Program Files\ArcGIS\Server\geronimo\var\config\config-substitutions.properties`

编辑其中的文件 `config-substitutions.properties`


![server1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c14e4aeea3342f3b1a6ed46e510212e~tplv-k3u1fbpfcp-watermark.image?)

重启服务

重新创建站点

## 3. The setup cannot proceed because ArcGIS Server is not supported on machines that indude an underscore (_) in the machine name.


The setup cannot proceed because ArcGIS Server is not supported on machines that indude an underscore (_) in the machine name.

![ab557e2702220fdd9d54bbcd3adb75c.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3013ebb6faee47fe8c662d9e2921db52~tplv-k3u1fbpfcp-watermark.image?)

计算机名称中不能含有下划线，重命名后重启电脑


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e19244f4076b47228b6cffcf74a35de5~tplv-k3u1fbpfcp-watermark.image?)




