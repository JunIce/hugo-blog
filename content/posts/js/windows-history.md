---
title: "window.history 对应api整理"
date: 2022-04-24T15:24:30+08:00
draft: true
categories: ["js"]
---



# window.history





表示历史回话记录



## props



### length

表示历史长度



### scrollRestoration

允许Web应用程序在历史导航上显式地设置默认滚动恢复行为

- auto
- manual



### state

表示历史堆栈顶部的状态的值



## events



### back

返回上一页



### forward

前进1页



### go

通过当前页面的相对位置从浏览器历史记录( 会话记录 )加载页面

是一个相对值



### pushState

按指定的名称和URL（如果提供该参数）将数据push进会话历史栈，数据被DOM进行不透明处理；



### replaceState

按指定的数据，名称和URL(如果提供该参数)，更新历史栈上最新的入口。
