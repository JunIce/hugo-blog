---
title: "Windows Wsl 升级到 Wsl2"
date: 2021-11-30T09:49:42+08:00
draft: true
---

### `windows Terminal` 中设置

>  Dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

![img](/snapshots/uTools_1638237072245.png)



### 下载windows内核更新包

> https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

完毕。安装。没有难度。

### 设置版本号

> wsl --set-version Ubuntu-20.04 2

#### 查看已有的版本号
> wsl --list -v
