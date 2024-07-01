---
title: "docker 中 nginx使用环境变量"
date: 2024-06-03T09:56:39+08:00
draft: true
tags: ["nginx"]
categories: ["docker", "nginx"]
---

# docker 中 nginx使用环境变量

先创建dockerfile， 用于build 镜像

```dockerfile
FROM nginx:alpine
COPY ./default.conf.template /etc/nginx/conf.d/default.conf.template
RUN apk add --no-cache gettext && rm -rf /var/cache/apk/*
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

```

创建nginx模版文件， 这里要填写你需要替换的变量名，我这里是`$HOSTNAME`


```nginx
server {
    listen       80;
    server_name  $HOSTNAME;
 
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $URI $URI/ =404;
    }
}
```


运行时传入变量值

```bash
docker build -t my-nginx-image .
docker run -e HOSTNAME=my.hostname.com my-nginx-image
```