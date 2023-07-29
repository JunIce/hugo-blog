---
title: "SSH connection failed: connect ECONNREFUSED"
date: 2023-07-29T16:39:17+08:00
tags: ["linux"]
categories: ["linux"]
draft: false
---





# Shell登录报 SSH connection failed: connect ECONNREFUSED





## 通过VNC登录云服务器实例



找到登录入口

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a91eaeb913b44ce95fa285b9b3a63f0~tplv-k3u1fbpfcp-watermark.image?)



找到**vnc**登录入口

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad0f74cb74d24f6e8e774cb0ebebce47~tplv-k3u1fbpfcp-watermark.image?)



## 查看sshd服务状态

```shell
netstat -tnlp | grep sshd
```



如果服务未启动

```shell
systemctl start sshd
```



查看sshd状态

```shell
systemctl status sshd
```





看到有这么一个错误

```shell
bad configuration option: CASignatureAlgorithms
```



找到`/etc/ssh/sshd_config`



编译这个文件

```bash
vim /etc/ssh/sshd_config
```



找到`CASignatureAlgorithms`对应字符注释



重启sshd服务

```bash
systemctl restart sshd
```







