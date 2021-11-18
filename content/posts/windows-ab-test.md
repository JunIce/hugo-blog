---
title: "Windows ab 测试套件"
date: 2021-10-19T13:41:27+08:00
draft: true
tags: [ "安装教程" ]
---

## windows10上安装ab测试套件

默认win10上安装了`wsl`

1. wsl中安装`ab-tools`
> sudo apt-get install apache2-utils

2. 安装`netstat`相关命令

> sudo apt-get install net-tools

3. `linux`中`netstat` 相关命令
> netstat -an | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'

4. 测试命令

> ab -n 10000 -c 100 http://127.0.0.1:3000/status

> // -n 数量 -c 并发数量

5. win10中查看`tcp`状态

>  netstat -ano|findstr "3000"|find /C `"TIME_WAIT`"
