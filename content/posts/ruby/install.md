---
title: "ruby 安装和升级"
date: 2023-10-24T08:46:48+08:00
tags: ["ruby"]
categories: ["ruby"]
draft: false
---

# ruby 安装和升级


```bash

brew install ruby

```


由于macos本身自带了`ruby`但是版本比较低
这里我们不删除自带版本，重新安装一个新的


```bash
vim .bash_profile
```

```perl
export PATH="/usr/local/opt/ruby/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/ruby/lib"
export CPPFLAGS="-I/usr/local/opt/ruby/include"
export PKG_CONFIG_PATH="/usr/local/opt/ruby/lib/pkgconfig"
```



