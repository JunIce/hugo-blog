---
title: "python issues"
date: 2024-03-14T21:32:35+08:00
tags: ["python issues"]
categories: ["python"]
draft: false
---

# python 使用笔记


## 国内源

```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --upgrade pip
```

## windows初始化虚拟环境

```bash
python -m venv venv
```

## Could not install packages due to an EnvironmentError: [WinError 5] Access is denied:

pip安装包没有权限

```bash
pip install -r requirements.txt --upgrade --force-reinstall --user
```

## Can not perform a '--user' install. User site-packages are not visible in this virtualenv.

```python
1. Go to the `pyvenv.cfg` file in the Virtual environment folder
编辑pyvenv.cfg文件

2. Set the `include-system-site-packages` to `true` and save the change
`include-system-site-packages`设置为true

3. Reactivate the virtual environment.
   This should work!
```
