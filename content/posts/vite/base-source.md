---
title: "源码解析"
date: 2022-05-24T20:10:09+08:00
tags: ["vite"]
categories: ["vite"]
draft: false
---





# vite



## resolveConfig



1. 找到vite对应的config文件，并且判断config文件类型，是否是ts文件还是mjs文件
2. 通过esbuild去解析config文件中对应的代码，并且生成对应的文件保存到磁盘上