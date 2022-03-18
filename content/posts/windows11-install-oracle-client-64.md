---
title: "windows11 -- install oracle client 64位"
date: 2021-10-19T13:41:27+08:00
draft: true
tags: [ "安装教程" ]
---



# window -- 安装oracle client 64位客户端



**根据需要软件的不同选择客户端，32位软件配合32位客户端，64位配合64位客户端**



### 1. 下载oracle client 11gr2 64位， 并解压



到下载目录下`D:\BaiduNetdiskDownload\win64_11gR2_client\client\stage\cvu`修改这两个文件

添加一下代码， 电脑是什么版本的就修改成什么版本的，不然安装的时候会提示系统版本不满足条件

```xml
<OPERATING_SYSTEM RELEASE="6.2">
   <VERSION VALUE="3"/>
   <ARCHITECTURE VALUE="64-bit"/>
   <NAME VALUE="Windows 11"/>
   <ENV_VAR_LIST>
       <ENV_VAR NAME="PATH" MAX_LENGTH="1023" />
   </ENV_VAR_LIST>
</OPERATING_SYSTEM>
```



![微信截图_20220318104818.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3a5d4240795410bbe67664ac285d7b3~tplv-k3u1fbpfcp-watermark.image?)



![微信截图_20220318104945.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91594b44d048417394da96a7e383d5bc~tplv-k3u1fbpfcp-watermark.image?)



### 2. 以管理员身份运行`setup.exe`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74e178e94b6b4acfa34f856c7d6d4432~tplv-k3u1fbpfcp-watermark.image?)



### 3. 选择`installClient`

![微信截图_20220318104636.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e81f49688104c0da3ec575f47f9b0d1~tplv-k3u1fbpfcp-watermark.image?)



### 4. 安装到指定位置

![微信截图_20220318104654.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e041ed9cb1a64762b922356b5df2abe6~tplv-k3u1fbpfcp-watermark.image?)



### 5. 完成

![微信截图_20220318104745.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56220742e1c44b0ea8adb06307025c9e~tplv-k3u1fbpfcp-watermark.image?)