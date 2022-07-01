---
title: "TCP/IP学习笔记"
date: 2022-07-01T08:15:06+08:00
tags: ["tcp","ip"]
categories:
draft: false
---



# TCP/IP



`TCP（传输控制协议）`和`IP（网际协议` 是最先定义的两个核心协议，所以才统称为`TCP/IP协议族`





### 应用层

- HTTP 万维网
- FTP 文件传输服务
- SMTP 电子邮件服务
- SSH 远程登陆服务
- DNS 名称<-> IP地址寻找,域名系统



### 传输层

- `TCP`：面向连接的`Transmisson Control Protocol`传输控制协议
- `UDP` : 无连接的包传输`User DataProtocol`用户数据报协议



### 网络层



- IP： 地址和路由



### 链路层

- 操作系统
- 硬件设备驱动
- NIC（Network interface Card 网络适配器：网卡 ）
- 光纤等物理可见部分



## 三次握手和四次挥手





### 三次握手

![TCP三次握手-9428b9683b45a763ce9f1a7407c7f779.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d809e4dddd14091871a3fd5a09ebf0f~tplv-k3u1fbpfcp-watermark.image?)

- 客户端A发送报文`SYN=1 seq=x`，请求与服务端B连接
- 服务端B收到后确认，发送报文`SYN=1 ACK=1 seq=y ack=x+1`
- 客户端A收到服务端B的确认后，给B发送确认报文`ACK=1 seq=x+1 ack=y+1`









### 四次挥手

![TCP四次挥手-22dedd749195620d1c6e87a2f47c80f1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/306ea14e045f4daea8d3e5920b46c08a~tplv-k3u1fbpfcp-watermark.image?)

- A向B发送主动关闭的报文`FIN=1 seq=u`
- B收到后向A发送确认报文 `ACK=1 seq=v ack=u+1`
- B已经确认没有数据要向A发送了，通知A即将关闭的报文`FIN=1 ACK=1 seq=w ack=u+1`
- A在收到B的连接释放报文段后，最后确认`ACK=1 seq=u+1 ack=w+1`



**名词解释**

**ACK** ：是TCP报头的控制位之一，对数据进行确认。确认由目的端发出， 用它来告诉发送端这个序列号之前的数据段都收到了。 比如确认号为X，则表示前X-1个数据段都收到了，只有当ACK=1时,确认号才有效，当ACK=0时，确认号无效，这时会要求重传数据，保证数据的完整性。

**SYN**： 同步序列号，TCP建立连接时将这个位置1。

**FIN**： 发送端完成发送任务位，当TCP完成数据传输需要断开时,，提出断开连接的一方将这位置1。

**SEQ**：初始序列号





### 保活计时器 keepalive timer



服务器向客户端发送，服务器每收到一次客户端数据就**重置保活计时器**。若**两小时**没有收到客户数据，服务器就发送一个**探测报文**，每隔**75s**发送一次，连续**10**个仍无响应就认为客户端出现故障，**关闭**这个TCP连接。