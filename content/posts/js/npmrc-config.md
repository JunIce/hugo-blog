---
title: "npmrc配置文件"
date: 2022-06-21T21:34:19+08:00
draft: true
tags: ["npmrc"]
---









# npmrc配置文件



模版配置文件

原淘宝镜像即将下线

- [http://npm.taobao.org](https://link.zhihu.com/?target=http%3A//npm.taobao.org) => [http://npmmirror.com](https://link.zhihu.com/?target=http%3A//npmmirror.com)
- [http://registry.npm.taobao.org](https://link.zhihu.com/?target=http%3A//registry.npm.taobao.org) => [http://registry.npmmirror.com](https://link.zhihu.com/?target=http%3A//registry.npmmirror.com)



```bash
// 注册源
registry=https://registry.npmmirror.com
// 私有包
@test:registry=https://xxxxx
// 全局安装目录, 即使用npm -g 安装的包
prefix=/usr/local/npm

// 自定义缓存目录
cache=~/.cache/npm_cache

// 认证信息
always-auth=true
_auth="用户名:密码"的base64编码


// 一些比较难装的
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=https://npmmirror.com/mirrors/phantomjs/
chromedriver_cdnurl=https://npmmirror.com/mirrors/chromedriver/
operadriver_cdnurl=https://npmmirror.com/mirrors/operadriver/

// 
_authToken=xxxxx-xxxxx-xxxx


// 是否ssl密钥验证
strict-ssl=false


```

