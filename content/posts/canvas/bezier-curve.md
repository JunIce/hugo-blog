---
title: 贝塞尔曲线公式
date: 2024-04-06T13:41:27+08:00
draft: true
tags: ["canvas"]
categories: ["canvas"]
---

## 贝塞尔曲线公式

具有 3 个控制点的贝塞尔曲线被称为二次贝塞尔曲线，而具有 4 个控制点的贝塞尔曲线被称为三次贝塞尔曲线。

三次贝塞尔曲线：其中 两端都称之为控制点

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/777088a7e21543068c424029cd69ff46~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=701&h=361&s=24435&e=png&a=1&b=000000)[](https://miro.medium.com/v2/resize:fit:720/format:webp/1*9e_pl2L3VKFGMSokrBbA2w.png)

其中 N 阶贝塞尔曲线可理解为有 N 条相连的线段，有 N+1 个顶点：

（1）一阶贝塞尔曲线：有顶点 A、B，组成线段 AB，利用线性插值原理，可得轨迹公式为：Path = (1-t)A + tB.

（2）二阶贝塞尔曲线：有顶点 A、B、C，组成线段 AB、BC，则有：

M = AB = (1-t)A + tB,

N = BC = (1-t)B + tC,

Path = (1-t)M + tN.

将 M 和 N 带入 Path，可得轨迹公式为：Path = (1-t)²A + 2t(1-t)B + t²C.

（3）三阶贝塞尔曲线：有顶点 A、B、C、D，组成线段 AB、BC、CD，则有：

M = AB = (1-t)A + tB,

N = BC = (1-t)B + tC,

Q = CD = (1-t)C + tD,

S = MN = (1-t)M + tN,

T = NQ = (1-t)N + tQ,

Path = (1-t)S + tT,

将 S 和 T 带入 Path，再将 M、N 和 Q 带入 Path 中的 S 和 T，可得轨迹公式：Path = (1-t)³A + 3t(1-t)²B + 3t²(1-t)C + t³D.

（4）利用数学归纳法，可得 N 阶贝塞尔曲线公式：

## References

https://www.bilibili.com/read/cv11708338/

### 二次贝塞尔曲线公式

二次贝塞尔曲线由 

- 起点P0
- 控制点P1
- 终点P2
​
曲线上的点坐标公式为：

$$
B(t) = (1-t)^2P_0 + 2(1-t)tP_1 + t^2P_2, \quad t \in [0, 1]
$$

代码

```js
function getQuadraticBezierPoint(t, p0, p1, p2) {
  const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
  const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
  return { x, y };
}
```



### 三次贝塞尔曲线公式


$$
B(t) = (1-t)^2P_0 + 2(1-t)tP_1 + t^2P_2, \quad t \in [0, 1]
$$

- 起点P0
- 控制点P1
- 控制点P2
- 终点P3

```js
function getCubicBezierPoint(t, p0, p1, p2, p3) {
  const x =
    (1 - t) ** 3 * p0.x +
    3 * (1 - t) ** 2 * t * p1.x +
    3 * (1 - t) * t ** 2 * p2.x +
    t ** 3 * p3.x;
  const y =
    (1 - t) ** 3 * p0.y +
    3 * (1 - t) ** 2 * t * p1.y +
    3 * (1 - t) * t ** 2 * p2.y +
    t ** 3 * p3.y;
  return { x, y };
}
```
