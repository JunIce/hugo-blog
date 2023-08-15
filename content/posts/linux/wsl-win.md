---
title: " WSL2问题解决WslRegisterDistribution failed with error: 0x800701bc"
date: 2023-08-14T16:39:17+08:00
tags: ["wsl"]
categories: ["windows wsl"]
draft: false
---


# WSL2问题解决WslRegisterDistribution failed with error: 0x800701bc

- 开启

```bash
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```


- 安装最新的wsl2 linux 内核

[https://learn.microsoft.com/zh-cn/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)
