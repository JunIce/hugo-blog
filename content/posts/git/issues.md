---
title: "git 中常见问题及解决方案"
date: 2022-02-08T08:52:24+08:00
draft: true
---

## Git提示You have not concluded your merge. (MERGE_HEAD exists) 

### solution

- 保存本地代码
- 执行git fetch --all，检查有无冲突
- 执行git reset --hard origin/master ----> git reset 把HEAD指向刚刚下载的最新的版本
- commit代码
- psh代码
