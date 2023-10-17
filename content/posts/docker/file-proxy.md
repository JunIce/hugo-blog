---
title: "Dockerfile 国内代理替换笔记"
date: 2023-10-17T09:56:39+08:00
draft: true
tags: ["Dockerfile"]
categories: ["docker"]
---





# Dockerfile 国内代理替换笔记



国内docker安装速度慢的问题



## apt install地址替换中国科技大学源



```bash
RUN sed -i s@/deb.debian.org/@/mirrors.ustc.edu.cn/@g /etc/apt/sources.list.d/debian.sources && apt-get update && apt-get install -y --no-install-recommends xxxxx
```



## pip install地址替换清华源



```bash
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --trusted-host pypi.tuna.tsinghua.edu.cn
```

