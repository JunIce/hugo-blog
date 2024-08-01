---
title: "GLSL笔记"
date: 2024-08-01T09:20:10+08:00
draft: true
tags: ["glsl"]
categories:["webgl"]
---



# GLSL笔记



### 内置函数

- radians 角度转弧度，degrees 弧度转角度
- sin, cos, tan, asin, acos, atan
- pow, exp, log, exp2, log2, sqrt, inversqrt
- abs,min,max,mod, sign, floor, ceil, clamp, mix, step, smotthstep, fract
- length, distance, dot, cross, normalize, reflect, faceforward
- matrixCmpMult
- lessThan, lessThanEqual, greraterThan, greaterThanEqual, equal, notEqual, any, all, not
- texture2D, textureCube, texture2DProj, texture2DLod, textureCubeLod, texture2dProjLod



### 变量

- const 常量
- attribute 只能声明在顶点着色器中，只能声明为全局变量，表示逐顶点的信息

- varying 必须是全局变量，从顶点着色器向片元传输数据。两种着色器中声明同名。

- uniform 声明在顶点着色器和片元着色器中，必须是全局变量。只读。被两种着色器共享。





### 精度

- highp 高精度
- mediump 中精度
- lowp 低精度



```glsl
precision mediump float;
```



### 预处理指令

- #if 如果
- #ifdef 如果定义某宏
- #ifndef 没有定义某宏
- #define 定义宏