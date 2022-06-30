---
title: "webrtc 相关概念"
date: 2022-06-25T13:03:09+08:00
tags:
categories: ['webrtc']
draft: false
---





## webRTC传输技术



![040fd1c2f7955b86ce561e22ef9317ab.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/947447e4d9614692aa91b26ae0beebd6~tplv-k3u1fbpfcp-watermark.image?)



### RTP

RTP（Real-time Transport Protocol，实时传输协议）通过IP网络实时传输音频和视频。RTP常用于流媒体服务的通信系统，例如网络电话、WebRTC视频电话会议、电视服务等.



- 具有较低的延时。
- 数据包在网络传输的过程中可能会丢失，到达对等端的顺序也可能发生变化。对等端收到RTP数据包后，需要根据数据包的序列号和时间戳进行重新组合。
- 支持多播（multicast），尽管目前WebRTC还没有使用这个特性，但是在海量用户通话场景，这个特性就变得很重要。



RTP会为每个媒体流建立一个会话，即音频和视频流使用单独的RTP会话，这样接收端就能选择性地接收媒体流。RTP使用的端口号为偶数，每个关联的RTCP端口为下一个较高的奇数，端口号范围为1024～65535。



### RTCP

RTCP（RTP Control Protocol）是实时传输协议（RTP）的姊妹协议，其基本功能和数据包结构在RFC 3550中定义。RTCP为RTP会话提供带外统计信息和控制信息，与RTP协作提供多媒体数据的传输和打包功能，其本身不传输任何媒体数据。



RTP通常在偶数UDP端口上发送，而RTCP消息将在下一个更高的奇数端口发送。



WebRTC使用的是SRTP。SRTP是RTP的一个配置文件，旨在为单播和多播应用程序中的RTP数据提供加密、消息身份验证和完整性以及重放攻击保护等安全功能。



SRTP和SRTCP默认的加密算法是AES，攻击者虽然无法解密数据，但可以伪造或重放以前发送的数据。因此，SRTP标准还提供了确保数据完整性和安全性的方法。



### SDP

SDP（Session Description Protocol）是用于描述媒体信息的协议，以文本格式描述终端功能和首选项。

SDP广泛用于会话启动协议（SIP）、RTP和实时流协议（RSP）。

