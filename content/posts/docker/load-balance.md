---
title: "docker 容器负载均衡"
date: 2023-04-07T09:56:39+08:00
draft: true
categories: ["docker"]
---

# docker 容器负载均衡

```yaml
version: '3'
services:
  backend:
    build: ../server
    environment:
      - PORT=5050 
    deploy:
      replicas: 4
    networks:
      - loadbalancing

  nginx:
    build: ../nginx
    container_name: nginx
    ports:
      - "80:80"
    networks:
      - loadbalancing
    depends_on:
      - backend

networks:
  loadbalancing:

```

## 2 scale

```bash
docker-compose scale account=3
```


## References

[https://medium.com/@aedemirsen/load-balancing-with-docker-compose-and-nginx-b9077696f624](https://medium.com/@aedemirsen/load-balancing-with-docker-compose-and-nginx-b9077696f624)