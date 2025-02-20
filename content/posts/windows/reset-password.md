---
title: "Windows 命令行密码重置"
date: 2025-02-20T09:14:20+08:00
draft: false
tags: [ "密码重置" ]
categories: [ "windows" ]
---

# window11登录密码重置

## 重启
登录界面按住`ctrl`键，并点击重启按钮

重启后进入工程模式，找到`命令行`选项


## 复制命令行

命令行中输入以下2个命令

```bash
copy c:\windows\system32\Utilman.exe c:\windows\system32\Utilman.exebak

copy c:\windows\system32\cmd.exe c:\windows\system32\Utilman.exe
```

![Snipaste_2025-02-20_08-08-55.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b7e84119bef34e42840da5d7724a866f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVuSWNl:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjcxNzY0ODQ3MzMxOTQxNSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740100294&x-orig-sign=tdtdYiuY47jabdnR3aP29Gtt9f4%3D)

![Snipaste_2025-02-20_08-10-17.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/7ddc59d8e892456ebc31facb74c76182~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVuSWNl:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjcxNzY0ODQ3MzMxOTQxNSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740100306&x-orig-sign=uGz0%2FI6ThRiRVdbkglPPvFLp15E%3D)

## 重启

关闭命令行后，点击进入系统

登录界面右下角有个小图标点一下
跳出命令行

输入以下命令

```cmd
net localgroup administrators
```

![Snipaste_2025-02-20_08-10-44.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/2dd72828816745b4bf3277691b6a7f29~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVuSWNl:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjcxNzY0ODQ3MzMxOTQxNSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740100441&x-orig-sign=6rOHJgjIDVStIwBnZMqXxPM3qCk%3D)


## 重置用户密码

命令行输入

```bash
net user xxxxx *
```

后回提示输入2次密码重置

![Snipaste_2025-02-20_08-12-04.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/79075fe04f9b46bda92e32f13f6387a3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgSnVuSWNl:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjcxNzY0ODQ3MzMxOTQxNSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740100483&x-orig-sign=9fWoe5av0RdR5CDY%2BW8FTWBecXk%3D)