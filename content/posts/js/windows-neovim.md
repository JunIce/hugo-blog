---
title: "Windows Neovim"
date: 2022-04-05T12:18:24+08:00
draft: true
tags: ["tools"]
categories: ["tools"]
---





# windows 10 安装neovim



neovim是全新版本的vim，继承了vim所有的功能



### 安装指导

[Installing Neovim · neovim/neovim Wiki (github.com)](https://github.com/neovim/neovim/wiki/Installing-Neovim)



### 下载

[Release NVIM v0.6.1 · neovim/neovim (github.com)](https://github.com/neovim/neovim/releases/tag/v0.6.1)



### 安装步骤

1. 下载 nvim 并解压到 C:\Program Files\
2. 在系统`PATH`中添加环境变量。 `C:\Program Files\Neovim\bin\` 
3. 在 ~/ 中创建 .config 文件夹

​		`~` 在windows中对应`C:\Users\{User}\AppData\Local`目录

1. 在 ~/.config/ 中创建 nvim 文件夹

2. 在 ~/.config/nvim/ 中创建 init.vim 文件 

3. 在 ~/.config/nvim/ 中创建自动加载文件夹 

4. 将 plug.vim 下载到 `~/.config/nvim/autoload/`

5. 安装 python >= 2.7 或 py3 

6. 通过python安装`neovim`包

   > pip install neovim 

7. 将插件添加到 ~/.config/nvim/init.vim 

8. 打开 nvim 运行：`PlugInstall`
