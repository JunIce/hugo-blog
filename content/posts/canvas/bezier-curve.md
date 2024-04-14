---
title: 贝塞尔曲线公式
date: 2024-04-06T13:41:27+08:00
draft: true
tags: ["canvas"]
categories: ["canvas"]
---


## 贝塞尔曲线公式


具有3个控制点的贝塞尔曲线被称为二次贝塞尔曲线，而具有4个控制点的贝塞尔曲线被称为三次贝塞尔曲线。


三次贝塞尔曲线：其中 两端都称之为控制点

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/777088a7e21543068c424029cd69ff46~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=701&h=361&s=24435&e=png&a=1&b=000000)[](https://miro.medium.com/v2/resize:fit:720/format:webp/1*9e_pl2L3VKFGMSokrBbA2w.png)


其中N阶贝塞尔曲线可理解为有N条相连的线段，有N+1个顶点：

（1）一阶贝塞尔曲线：有顶点A、B，组成线段AB，利用线性插值原理，可得轨迹公式为：Path = (1-t)A + tB.

（2）二阶贝塞尔曲线：有顶点A、B、C，组成线段AB、BC，则有：

        M = AB = (1-t)A + tB,

        N = BC = (1-t)B + tC,

        Path = (1-t)M + tN.

        将M和N带入Path，可得轨迹公式为：Path = (1-t)²A + 2t(1-t)B + t²C.

（3）三阶贝塞尔曲线：有顶点A、B、C、D，组成线段AB、BC、CD，则有：

        M = AB = (1-t)A + tB,

        N = BC = (1-t)B + tC,

        Q = CD = (1-t)C + tD,

        S = MN = (1-t)M + tN,

        T = NQ = (1-t)N + tQ,

        Path = (1-t)S + tT,

        将S和T带入Path，再将M、N和Q带入Path中的S和T，可得轨迹公式：Path = (1-t)³A + 3t(1-t)²B + 3t²(1-t)C + t³D.

（4）利用数学归纳法，可得N阶贝塞尔曲线公式：

## References

https://www.bilibili.com/read/cv11708338/