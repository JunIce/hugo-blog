---
title: "ArcMap 本地安装教程"
date: 2022-01-07T15:59:13+08:00
draft: true
---

## ArcMap 本地安装教程

本次操作演示的版本`v10.2`

### 1. 下载
本次需要的ArcMap10.2版本， 解压后如图所示
![version](/arcmap/arcmap_step1.png)

### 2. 安装 `donet3.5`

部分老机器上没有这个依赖，需要安装
![version](/arcmap/arcmap_step2.png)


### 2. 安装
安装主软件， 直接install， 可能需要等个15分钟，很慢！！
![version](/arcmap/arcmap_step3.png)

### 3. 安装LicenseManager

这一步安装license, 破解必须要安装
![version](/arcmap/arcmap_step4.png)

### 4. 破解

在菜单里找到`licenseManager`， 并打开 
![version](/arcmap/arcmap_step5.png)

点击`停止` 
![version](/arcmap/arcmap_step6.png)

在解压目录里找到破解包，修改其中的`services.txt`文件
修改其中的host为本地计算机名称
![version](/arcmap/arcmap_step7.png)
![version](/arcmap/arcmap_step8.png)

复制哥俩到`C:\Program Files (x86)\ArcGIS\License10.2\bin`license安装目录并替换， 有需要你可以先备份一下
![version](/arcmap/arcmap_step9.png)

重新回到`licenseManager`, 点击启动， 并且重新读取许可
![version](/arcmap/arcmap_step10.png)

打开菜单栏， 找到 `Administrator`, 记住不是 `LicenseManager`

选择`浮动版`, 修改其中的host名称为`localhost`
![version](/arcmap/arcmap_step11.png)
![version](/arcmap/arcmap_step12.png)

如果有需要，你可以安装中文包
![version](/arcmap/arcmap_step13.png)


## 完毕

