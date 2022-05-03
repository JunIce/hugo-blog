---
title: "angular commit 提交标准格式"
date: 2022-02-18T14:12:38+08:00
draft: true
tags: ["git"]
---


## Git提交标准格式

现在代码管理都是通过git来做版本控制的，所以git提交记录就变得非常重要，如果`comments`写的不规范，可读性非常差，一定程度上也会影响代码开发的速度和质量

目前使用的规范都是Google Angularjs的那一套

可读性强的提交格式，可以快速生成`CHANGELOG`

- 允许通过脚本生成 CHANGELOG.md
- 可以通过范围的关键词，快速的搜索到指定版本

[https://github.com/feflow/git-commit-style-guide](https://github.com/feflow/git-commit-style-guide)

![version](/git-commit-message-mindmap.png)


### 规范主体

```sh
 <type>: <subject> \
 // 空一行 \
 <body> \
 // 空一行  \
 <footer> \
```

- 消息只占用一行，任何行都不能超过 100 个字符
- 允许使用 GitHub 以及各种 Git 工具阅读消息
- 提交消息由页眉、正文和页脚组成，由空行分隔

### type类型

- feat: 新功能、新特性
- fix: 修改 bug
- perf: 更改代码，以提高性能（在不影响代码内部行为的前提下，对程序性能进行优化）
- refactor: 代码重构（重构，在不影响代码内部行为、功能下的代码修改）
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改（例如分号修改）
- test: 测试用例新增、修改
- build: 影响项目构建或依赖项修改
- revert: 恢复上一次提交
- ci: 持续集成相关文件修改
- chore: 其他修改（不在上述类型中的修改）
- release: 发布新版本
- workflow: 工作流相关文件修改 