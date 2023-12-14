---
title: "Windows nginx重启bat脚本"
date: 2023-12-16T09:14:20+08:00
draft: false
tags: [ "bat", "nginx" ]
categories: [ "windows" ]
---


# Windows nginx重启bat脚本

```bat
@echo off

taskkill /IM nginx.exe /F /T

echo "The process nginx.exe has been terminated."

pause

start /d D:\soft\nginx-1.22.1\nginx-1.22.1 /b nginx.exe

echo "Start nginx success"
```