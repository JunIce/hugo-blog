---
title: "Windows npm 全局安装问题"
date: 2022-02-22T13:58:07+08:00
draft: true
---

### windows npm -g 全局安装的命令找不到

1. 设置npm全局安装目录

```bash
npm config set prefix "your path"
npm config set global "your path"
```

2. 设置系统环境变量


window中添加环境变量

![环境变量](/snapshots/uTools_1637827180511.png) 


系统变量下面`PATH` 增加 `C:\Program Files\nodejs\node_global`

3. 增加环境变量


环境变量中添加`NODE_PATH`

![环境变量](/snapshots/uTools_1637827200780.png) 

`NODE_PATH`: `C:\Program Files\nodejs\node_global\node_modules`


### yarn : 无法加载文件 C:\Program Files\nodejs\node_global\yarn.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。

1. 点击电脑右下角的开始，菜单出来后，直接按键盘输入powerShell搜索，会出现下图，然后右键以管理员身份运行
2. set-ExecutionPolicy RemoteSigned // Y


### node_sass 安装失败

进入 `C:\Users\{用户}` 目录

创建 `.npmrc`文件，并复制一下内容


```sh

registry=https://registry.npm.taobao.org/
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

```

## windows中npm install -g xxx 后 找不到命令

### 1. 设置npm的安装cache位置

> npm config set prefix "D:/node/node_global" \
> npm config set cache "D:/node/node_npm"

### 2.设置环境变量


### 3. 重新打开终端命令框