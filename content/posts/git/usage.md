---
title: "git 使用方法"
date: 2021-09-18T13:20:55+08:00
draft: false
tags: ["git"]
categories: ["git"]
---



# git使用手册



### track



`git branch --track master origin/main`



等价于



`git branch --set-upstream-to=origin/main master`



其中`--set-upstream-to` 和 `-u`等价

`git branch -u origin/main master`

跟踪本地master分支到远程的**main**分支
