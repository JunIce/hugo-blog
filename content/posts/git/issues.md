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


### 3.npm publish 时出现私有错误

```bash
npm ERR! code E402
npm ERR! 402 Payment Required - PUT https://registry.npmjs.org/@rj_12%2fvue2 - You must sign up for private packages
```

**方案**
```bash
npm publish --access public
```

### git基于tag创建新分支进行修改

```bash
git checkout -b branch_name tag_name
```





### 4. warning: remote HEAD refers to nonexistent ref, unable to checkout(远程 HEAD 指向一个不存在的引用，无法检出。)



由于远程分支的默认分支上main，而本地分支的默认分支上master，在clone的时候会出现这个错误



- 方案1

```bash
git symbolic-ref HEAD refs/heads/main
```

-  方案2(切换分支的方法)

1. `git branch -a `
2. `git checkout remotes/origin/Zoro`
3. `git checkout -b remotes/origin/Zoro`
4. `git branch -m remotes/origin/Zoro master`