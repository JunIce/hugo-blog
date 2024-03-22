---
title: "docker 运行配置"
date: 2024-03-17T09:56:39+08:00
draft: true
tags: ["docker"]
categories: ["docker"]
---






- 查看最新日志调试

```bash
docker logs --since 30s -f <container_name_or_id>
```


- 查看最近日志条数

```bash
docker logs --tail 20 -f <container_name_or_id>
```

- 限制日志文件大小

```json
{
  "log-driver": "json-file",
  "log-opts": {"max-size": "10m", "max-file": "3"}
}
```