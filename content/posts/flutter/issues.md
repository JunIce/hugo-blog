---
title: "flutter 问题整理"
date: 2022-10-16T20:54:21+08:00
tags:
categories: ["flutter"]
draft: false
---



### Undefined name 'OutlineButton'.



使用TextButton代替



#### Try adding either an explicit non-'null' default value or the 'required' modifier.



空安全报错，一旦sdk升级到2.12以上之后，那么就会执行空安全检查

1. 添加关键字 `required`
2. 添加默认值





### flutter 运行时 "Your session has expired. Please log in."

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4aeb3e3c2cc473796f3c7cada848938~tplv-k3u1fbpfcp-watermark.image?)



> Xcode ——>Preferences…——> accounts 重新登录 ——> fix