---
title: "docker 常见问题搜集"
date: 2023-04-06T09:56:39+08:00
draft: true
categories: ["docker"]
---



### docker-overlay2-size-too-big



`df -ah`发现占用空间较大

```perl
/dev/vda1        50G   46G  701M  99% /
systemd-1          -     -     -    - /proc/sys/fs/binfmt_misc
debugfs            0     0     0    - /sys/kernel/debug
mqueue             0     0     0    - /dev/mqueue
hugetlbfs          0     0     0    - /dev/hugepages
tmpfs           184M     0  184M   0% /run/user/0
overlay          50G   46G  701M  99% /var/lib/docker/overlay2/34c5b96ac2c65999eacb82297930a4db5421b56e4399baab59c3eccf6169a6cc/merged
overlay          50G   46G  701M  99% /var/lib/docker/overlay2/9b0da97e870d44a06fe6bebdbc6249625ad3d3ac9b93c25311fb148ea011eee9/merged
overlay          50G   46G  701M  99% /var/lib/docker/overlay2/bbd2f97ec21b50b4a39d000e6f28e802757e8f302f21250094be6ad88c168505/merged
overlay          50G   46G  701M  99% /var/lib/docker/overlay2/78ec8372e3130e97eff7a71ef6c629921846e8e04fc6b1eea872ab432a1e276b/merged
binfmt_misc        0     0     0    - /proc/sys/fs/binfmt_misc
```





`du -shc /var/lib/docker/*`

```bash
[root@VM-0-6-centos ~]# du -shc /var/lib/docker/*
20K	/var/lib/docker/builder
72K	/var/lib/docker/buildkit
19M	/var/lib/docker/containers
4.7M	/var/lib/docker/image
88K	/var/lib/docker/network
2.0G	/var/lib/docker/overlay2
20K	/var/lib/docker/plugins
4.0K	/var/lib/docker/runtimes
4.0K	/var/lib/docker/swarm
4.0K	/var/lib/docker/tmp
4.0K	/var/lib/docker/trust
68K	/var/lib/docker/volumes
2.0G	total
```





查看是redis的log文件竟然21个g

果断删了



### '/var/lib/mysql/mysql.sock': No such file or directory

docker中跑mysql一段时间后重启不了

修改docker中设置

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92871281491645eb9fe39d079014caae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2106&h=1058&s=287606&e=png&a=1&b=171d23)

