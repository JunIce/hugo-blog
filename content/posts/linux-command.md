---
title: "Linux 常用命令"
date: 2021-09-30T09:24:30+08:00
draft: false
tags: ["linux"]
---





## 查看端口占用

> lsof -i tcp:80





## 所有端口

> netstat -ntlp





## 查看端口进程

> netstat -lnp|grep 端口号

> netstat -anp|grep 端口号





## Linux内核版本命令
> cat /proc/version

> uname -a





## 查看Linux系统版本的命令
> lsb_release -a

> cat /etc/redhat-release

> cat /etc/issue





## ldd



ldd 用来打印或者查看程序运行所需的共享库,常用来解决程序因缺少某个库文件而不能运行的一些问题。ldd不是一个可执行程序，而只是一个shell脚本。





```bash
bash-5.1# ldd ./node
	/lib64/ld-linux-x86-64.so.2 (0x7f42c6fe6000)
	libdl.so.2 => /lib64/ld-linux-x86-64.so.2 (0x7f42c6fe6000)
Error loading shared library libstdc++.so.6: No such file or directory (needed by ./node)
	libm.so.6 => /lib64/ld-linux-x86-64.so.2 (0x7f42c6fe6000)
Error loading shared library libgcc_s.so.1: No such file or directory (needed by ./node)
	libpthread.so.0 => /lib64/ld-linux-x86-64.so.2 (0x7f42c6fe6000)
	libc.so.6 => /lib64/ld-linux-x86-64.so.2 (0x7f42c6fe6000)
Error loading shared library ld-linux-x86-64.so.2: No such file or directory (needed by ./node)
```



