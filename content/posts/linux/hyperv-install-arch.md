---
title: "hyper-V arch linux 网络配置"
date: 2024-03-22T16:39:17+08:00
tags: ["linux", "arch linux"]
categories: ["linux"]
draft: false
---


# Hyper-V虚拟机安装Arch Linux后，静态IP网络配置



## 1. 安装Arch Linux

虚拟机安装`Arch Linux`




## 2. 配置网络，固定静态IP


虚拟机关机状态下进行


## 2.1 新建虚拟交换机

在虚拟机中，点击`虚拟机`，选择`虚拟机管理器`，点击`虚拟交换机`，点击`新建虚拟交换机`


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/685cf337ca144ab09e6ad5945c08902a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1067&h=1012&s=124895&e=png&b=fdfdfd)


根据步骤创建交换机

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93d154b4aa194c0ea608808c244ae07c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=873&h=691&s=112658&e=png&b=f6f6f6)


交换机新建一个名字，选择`内部网络`，点击`确定`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e30f5ee816340d8aebc7dc9c280199b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=878&h=846&s=147673&e=png&b=f4f4f4)


## 2.2 虚拟机中新增网络适配器

1. 打开虚拟机，右键点击`虚拟机`，选择`设置`
2. 点击`添加硬件`
3. 选中`网络适配器`,
4. 点击 `添加`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3534759b6291477481b15ef3d1629e47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=833&h=758&s=66623&e=png&b=f5f5f5)

虚拟交换机这里选择刚刚新建的那个

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d621cfe14e864c1c8690670d2e2b8dcb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=813&s=200477&e=png&b=f3f2f2)


## 2.3 控制面板中进入网络连接

选中我们刚刚新建的那个网络

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad85beb5c34d47caa82f8ef58955513c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1117&h=632&s=56890&e=png&b=ffffff)


右键属性，找到`ipv4`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62e3e5d2cc944519a982dfc3e9d9cde0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=577&h=355&s=25693&e=png&b=fbfbfb)


设置一个你需要固定的网段，这里我设置的是`192.168.200.1`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2242e5bf28484f329aa2c0df4da93708~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=463&h=578&s=28259&e=png&b=fbfbfb)



## 2.4 配置ssh服务


###　安装ssh服务

```bash
sudo pacman -S openssh
```

登录虚拟机，执行`sudo systemctl enable sshd.service`

执行`sudo systemctl start sshd.service`


### 查看网卡

登录虚拟机，执行`ip a`

可以看到下面的输出

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89b06b3a7f6b4c97ae46b4e3be624fb4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1199&h=540&s=96173&e=png&b=0d0d0d)


其中`eth0`就是网卡名称，`eth1`就是我刚刚新建的网卡


### 新增网卡配置

```sh
sudo vim /etc/systemd/network/eth1.network
```

如果`vim`不存在,安装`vim`

```bash
sudo pacman -S vim
```


配置文件中输入以下内容

```conf
[Match]
Name=eth1

[Network]
Address=192.168.200.2/24
Gateway=192.168.200.1
DNS=8.8.8.8
```

其中`Name`填写刚刚新建的网卡名称，`Address`填写你需要的网段，`Gateway`填写网关，`DNS`填写你的dns服务器


### 重启网络

```bash
$ sudo systemctl enable systemd-networkd

$ sudo systemctl start systemd-networkd

```


### 测试网络

本机ping(arch linux 机器)
```bash
ping 192.168.200.2
```

宿主机ping(windows 机器)
```bash
ping 192.168.200.2
```
如果两边都能`ping`通，说明网络配置成功


