---
title: "git 中常见问题及解决方案"
date: 2022-02-08T08:52:24+08:00
draft: true
tags: ["git"]
---



### 1.Git提示You have not concluded your merge. (MERGE_HEAD exists) 

### 

- 保存本地代码
- 执行git fetch --all，检查有无冲突
- 执行git reset --hard origin/master ----> git reset 把HEAD指向刚刚下载的最新的版本
- commit代码
- psh代码





### 2.版本跟踪里出现`git submodule commit xxxxx`错误



> git submodule update


-Subproject commit 工程针对子模块上次提交的改动ID
+Subproject commit 工程针对子模块最近提交的改动ID

```bash
$ rm -rf 子模块名称
$ git submodule deinit -f 子模块名称
$ rm -rf .git/modules/子模块名称
$ git rm -f 子模块名称
$ git submodule add 子模块存储网址
$ git commit -m '备注'
$ git push
```