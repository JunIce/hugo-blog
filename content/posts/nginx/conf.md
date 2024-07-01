---
title: "nginx使用配置"
date: 2024-07-01T09:56:39+08:00
draft: true
tags: ["nginx"]
categories: ["nginx"]
---

# nginx使用配置

```conf
server {
    listen       8033;

    location / {
        root   C:/Users/chourj/Downloads/更新/dist;
        index  index.html index.htm;

        try_files $uri $uri/ /index.html;
        add_header Cache-Control no-cache;
    }

    location ^~ /prod-api/ {
        proxy_pass http://localhost:8080/;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```
