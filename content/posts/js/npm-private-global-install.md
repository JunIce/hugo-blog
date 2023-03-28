---
title: "npm 私有仓库全局安装指南"
date: 2023-03-28T08:52:24+08:00
draft: true
tags: ["npm private repo", "global install"]
categories: ["npm"]
---

# npm 私有仓库全局安装指南

## Windows

`C:\Users\iprivate`目录下找到`.npmrc`文件，添加下面一行

> @private:registry=http://IP:8081/repository/npm-local/


## Mac

> echo "@private:registry=http://IP:8081/repository/npm-local/" > ~/.npmrc

mac下如果有权限问题，改一下npm global目录指向
https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

## 安装cli

> npm i -g @private/cli
