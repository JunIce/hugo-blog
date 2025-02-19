---
title: "Anaconda安装"
date: 2025-02-18T21:32:35+08:00
tags: ["python", "anaconda"]
categories: ["python"]
draft: false
---



# Anaconda安装



## 1. 清华源下载

https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/



找到对应的版本并下载，新版在最下面



## 2添加环境变量

安装过程中有添加到环境变量，需要勾上

如果没有勾上，需要手动增加到系统环境变量



例如是已经安装到

`D:\anaconda`



全局系统变量添加

`D:\anaconda`  `D:\anaconda\Scripts`



### 验证：

```bash
conda --version 

conda info 
```





### 国内下载源： 

```bash
conda config --set show_channel_urls yes 

conda config --add channels http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/ 

conda config --add channels http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/ 

conda config --add channels http://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/ 

conda config --set show_channel_urls yes 

conda config --remove channels defaults 

conda config --show channels
```