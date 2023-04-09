---
title: "github coding同步action"
date: 2023-04-09T13:20:55+08:00
draft: false
tags: ["github action"]
---


```yaml
name: Sync Repo to CODING
on:
  push:
  schedule:
    # 每天北京时间0点同步
    - cron: "0 16 * * *"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Sync Repo to CODING
        uses: serverlesslife-cn/sync-repo-to-coding@master
        env:
          SSH_PRIVATE_KEY: ${{ secrets.CODING_PRIVATE_KEY }}
        with:
          # 注意替换为你的 GitHub 源仓库地址
          github-repo: "git@github.com:JunIce/hugo-blog.git"
          # 注意替换为你的 CODING 目标仓库地址
          coding-repo: "git@e.coding.net:volcan0/node-api/blog.git"

```