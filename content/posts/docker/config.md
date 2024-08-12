---
title: "docker 运行配置"
date: 2024-03-17T09:56:39+08:00
draft: true
tags: ["docker"]
categories: ["docker"]
---




### 清空所有容器日志

```sh
sudo sh -c 'truncate -s 0 /var/lib/docker/containers/*/*-json.log'
```

### 查看最新日志调试

```bash
docker logs --since 30s -f <container_name_or_id>
```


### 查看最近日志条数

```bash
docker logs --tail 20 -f <container_name_or_id>
```

### 限制日志文件大小

```json
{
  "log-driver": "json-file",
  "log-opts": {"max-size": "10m", "max-file": "3"}
}
```

### container限制文件大小

```shell
docker run --name some-container \
    --log-driver=json-file \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    some-image
```

- --log-driver=json-file 指定了使用json-file日志驱动。
- --log-opt max-size=10m 表示每个日志文件的最大大小为10MB。
- --log-opt max-file=3 表示最多保留3个日志文件（包括当前正在写入的日志文件）。一旦超过3个文件，最旧的日志文件将被删除。