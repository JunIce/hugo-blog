---
title: "Windows WSL 安装 Homebrew"
date: 2021-09-18T13:20:55+08:00
draft: false
tags: ["安装教程", "WSL"]
---

# wsl 安装Homebrew 进行包管理

## 1. 前提

> 操作系统 Windows10

- 安装wsl，可从微软商店安装，网上教程很多（前提打开主板虚拟化），以下教程不包括安装wsl步骤

## 2. 步骤
### 进入到`/home`目录，也就是家目录

### 下载清华homebrew git仓库，当然你也可以从github下载，但是太大国内下载速度感人
```bash
# 从本镜像下载安装脚本并安装 Homebrew / Linuxbrew
git clone --depth=1 https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/install.git brew-install
/bin/bash brew-install/install.sh
rm -rf brew-install
```
### 把命令路径加入到配置文件中
```bash
test -d ~/.linuxbrew && eval "$(~/.linuxbrew/bin/brew shellenv)"
test -d /home/linuxbrew/.linuxbrew && eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
test -r ~/.bash_profile && echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >> ~/.bash_profile
test -r ~/.profile && echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >> ~/.profile
test -r ~/.zprofile && echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >> ~/.zprofile
```

### 最后附上清华homebrew源地址
[https://mirror.tuna.tsinghua.edu.cn/help/homebrew/](https://mirror.tuna.tsinghua.edu.cn/help/homebrew/)