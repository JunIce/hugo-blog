---
title: "Linux 常用命令"
date: 2021-09-30T09:24:30+08:00
draft: false
tags: ["linux"]
---

### 查看端口占用

> lsof -i tcp:80

### 所有端口

> netstat -ntlp

### 查看端口进程

> netstat -lnp|grep 端口号

> netstat -anp|grep 端口号

### Linux内核版本命令
> cat /proc/version

> uname -a

### 查看Linux系统版本的命令
> lsb_release -a

> cat /etc/redhat-release

> cat /etc/issue