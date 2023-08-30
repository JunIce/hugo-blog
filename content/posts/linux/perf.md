---
title: "linux 优化脚本"
date: 2023-08-30T09:28:46+08:00
tags:
categories: ['linux']
draft: false
---


# linux 优化脚本


## 删除所有node_nodules

```bash
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
```