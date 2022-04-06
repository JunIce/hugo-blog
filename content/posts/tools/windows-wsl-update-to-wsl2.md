---
title: "windows10 升级ws1到wsl2"
date: 2021-11-30T09:49:42+08:00
draft: true
tags: ["wsl"]
categories: ["WSL"]
---





# `windows Terminal` 中设置

>  Dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart





![img](/snapshots/uTools_1638237072245.png)



### 下载windows内核更新包

> https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi



### 查看ubuntu在线版本



>  wsl --list --online



### 设置版本号

> wsl --set-version Ubuntu-20.04 2





### 查看已有的版本号
> wsl --list -v



## ISSUES

### wsl 运行时出现: 安装其中一个文件系统时出现错误。有关详细信息，请运行'dmesg'。



**问题**

> C:\Users\ihaiking> wsl
> 安装其中一个文件系统时出现错误。有关详细信息，请运行'dmesg'。



**方案**

> wsl --update // 更新
>
> wsl --shutdown // 重启
