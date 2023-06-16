---
title: "fork的仓库更新分支"
date: 2023-06-15T13:20:55+08:00
draft: false
tags: ["github branch"]
categories: ["git"]
---

# fork 的仓库在源仓库新增分支后更新 fork 仓库的分支

## 1. 本地新增源仓库的远程地址

```bash
git remote add up xxxxxxx
```

## 2. 更新本地分支

```bash
git fetch up 分支名:分支名
```

## 3. 更新 fork repo 远程分支

```bash
git push origin 分支名
```

## 4.本地和 fork 的远程

```bash
git branch --set-upstream-to=origin/分支名 本地分支名
```
