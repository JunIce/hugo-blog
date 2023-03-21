---
title: "git 使用方法"
date: 2021-09-18T13:20:55+08:00
draft: false
tags: ["git"]
categories: ["git"]
---



# git使用手册



### track



`git branch --track master origin/main`



等价于



`git branch --set-upstream-to=origin/main master`



其中`--set-upstream-to` 和 `-u`等价

`git branch -u origin/main master`

跟踪本地master分支到远程的**main**分支


### git init 默认main分支

`git config --global init.defaultBranch main`


### git 更改提交信息

git 更改已经提交过的信息，比如提交人之类的，需要强制替换的场景

```bash
git filter-branch -f --env-filter '
OLD_EMAIL="origin name"
CORRECT_NAME="JunIce"
CORRECT_EMAIL="current name"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches


// next
git push -f
```



### git rebase 之后的操作



rebase之前

```bash
A--B--C------F--G  (master)
       \    
        D--E  (feature)
```

rebase之后

```
A--B--C------F--G  (master)
                 \
                  D'--E'  (feature)
```

因为远程分支已经落后，需要使用`--force`命令强制更新远程分支



这里推荐使用`--force-with-lease`

[Git push rejected after feature branch rebase - Stack Overflow](https://stackoverflow.com/questions/8939977/git-push-rejected-after-feature-branch-rebase)
