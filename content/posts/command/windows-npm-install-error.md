---
title: "Windows Npm Install Error"
date: 2021-11-24T22:45:39-08:00
draft: true
---

## windows中npm install -g xxx 后 找不到命令

### 1. 设置npm的安装cache位置

> npm config set prefix "D:/node/node_global" \
> npm config set cache "D:/node/node_npm"

### 2.设置环境变量

window中添加环境变量

![环境变量](/snapshots/uTools_1637827180511.png) 


环境变量中添加`NODE_PATH`

![环境变量](/snapshots/uTools_1637827200780.png) 

### 3. 重新打开终端命令框