---
title: "小程序开发问题整理"
date: 2022-12-14T16:39:17+08:00
tags: ["小程序"]
categories: ["小程序"]
draft: false
---





#### 真机调试时： Error: accessSync:fail no such file or directory

错误信息

```perl
WAServiceMainContext.js:1 [wxapplib]] [LogManagerwx8dd7a55700341e77]] accessSync fail accessSync:fail no such file or directory, access '/storage/emulated/0/Android/data/com.tencent.mm/MicroMsg/wxanewfiles/da9ba93e6b42cc751892e59f5f751b15/miniprogramLog/log2'
Error: accessSync:fail no such file or directory, access '/storage/emulated/0/Android/data/com.tencent.mm/MicroMsg/wxanewfiles/da9ba93e6b42cc751892e59f5f751b15/miniprogramLog/log2'
```



切换到真机调试1.0进行调试，2.0好像还是有些bug





#### request请求fail-200:net::ERR_CERT_COMMON_NAME_INVAL

域名证书错误，检查一下证书是否有效

[request请求fail-200:net::ERR_CERT_COMMON_NAME_INVAL？ | 微信开放社区 (qq.com)](https://developers.weixin.qq.com/community/develop/doc/000ae2ebd3ca28c9a7eb1d5ab51400)


#### web-view中src打开一个pdf链接地址，调试模式下才能打开，非调试模式下点击没有反应的问题

通过点击发现`web-view`中直接打开pdf，内部还是调用的是`wx.openDocument`打开的本地下载文件，需要事先下载，所以开发配置那边`downloadFile合法域名`需要配置好`src`的域名