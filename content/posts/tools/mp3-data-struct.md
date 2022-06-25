---
title: "mp3 数据结构"
date: 2022-06-01T08:46:48+08:00
tags: ["mp3"]
categories: ["tools"]
draft: false
---







# mp3数据结构

MP3文件大体上分为三个部分：ID3V2 + 音频数据 + ID3V1



![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ff26f57f2f94881b507208200010004~tplv-k3u1fbpfcp-watermark.image?)



### id3v1

id3v1固定128个byte，以tag字符开头



### id3v2



```markdown
B[0:2]	标识头，必须为“ID3”
B[3]	版本号，ID3V2.3 就记录3
B[4]	副版本号，此版本记录为0
B[5]	标志字节，一般为0，只使用高三位，其它位为0
			a：表示是否使用Unsynchronisation；
			b：表示是否有扩展头部，一般没有，所以一般也不设置；
			c：表示是否为测试标签，99.99%的标签都不是测试标签，不设置
B[6:9]	标签大小，共四个字节，每个字节只使用低7位，最高位不使用恒为0，计算时将最高位去掉，得到28bit的数据，计算公式如下：Size=(Size[0]&0x7F)*0x200000+(Size[1]&0x7F)*0x400+(Size[2]&0x7F)*0x80+(Size[3]&0x7F)
```





## mp3 frame



数据帧结构



| 4字节帧头 | 2字节可选CRC,取决于帧头的第16位 | 32字节通道信息 | 声音数据 |
| --------- | ------------------------------- | -------------- | -------- |
|           |                                 |                |          |





### 4个字节帧头

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/085b2968057b46b9b09e9e25401eff4c~tplv-k3u1fbpfcp-watermark.image?)