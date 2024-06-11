---
title: "npm 私有仓库免登录配置指南"
date: 2024-06-11T08:52:24+08:00
draft: true
tags: ["npm private repo", "global install"]
categories: ["npm"]
---

# npm 私有仓库免登录配置指南

## 具体操作

- 删除您的`~/.npmrc`或重命名它。
- 请确保您的环境设置，如`$NPM_CONFIG_*` 未设置。
- 使用以下命令验证是否取消了电子邮件和其他设置：`npm config list`
- 使用以下命令登录npm：`npm login --registry=https：//nexus.whatever.registry/respository/npm-whatever-group/`
一旦你被记录-你被记录。npm应该在你的~/. npmrc中为它生成一个令牌。它看起来像：

```bash
//nexus.whatever.registry/respository/npm-whatever-group/:_authToken=NpmToken.YOUR-LOVELY-TOKEN-IN-HEX
```

最后，复制C盘`.npmrc`下面的数据到项目根目录下面

```bash
//nexus.whatever.registry/respository/npm-whatever-group/:_authToken=NpmToken.YOUR-LOVELY-TOKEN-IN-HEX
email = <EMAIL_USED_FOR_TOKEN_GENERATION>
always-auth = true 
registry = https://nexus.whatever.registry/respository/npm-whatever-group/ 
```

这样你的项目就可以在CI里面免登录运行了