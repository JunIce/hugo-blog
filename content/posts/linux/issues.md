---
title: "linux 问题整理"
date: 2022-08-20T09:28:46+08:00
tags:
categories:
draft: false
---





### rpmdb open failed

```perl
[root@VM-0-6-centos ~]# yum -y remove git
error: rpmdb: BDB0113 Thread/process 423/140056922314816 failed: BDB1507 Thread died in Berkeley DB library
error: db5 error(-30973) from dbenv->failchk: BDB0087 DB_RUNRECOVERY: Fatal error, run database recovery
error: cannot open Packages index using db5 -  (-30973)
error: cannot open Packages database in /var/lib/rpm
CRITICAL:yum.main:

Error: rpmdb open failed
```



**方案**

```perl
[root@VM-0-6-centos ~]# rm -f /var/lib/rpm/__db*
[root@VM-0-6-centos ~]# rmp --rebuilddb
```



### wget下载失败



```perl
[root@VM-0-6-centos local]# wget https://mirrors.edge.kernel.org/pub/software/scm/git/git-2.9.0.tar.gz && tar -xzvf git-
2.9.0.tar.gz
--2022-08-20 09:34:58--  https://mirrors.edge.kernel.org/pub/software/scm/git/git-2.9.0.tar.gz
Resolving mirrors.edge.kernel.org (mirrors.edge.kernel.org)... 147.75.80.249, 2604:1380:4601:e00::3
Connecting to mirrors.edge.kernel.org (mirrors.edge.kernel.org)|147.75.80.249|:443... connected.
ERROR: cannot verify mirrors.edge.kernel.org's certificate, issued by ‘/C=US/O=Let's Encrypt/CN=R3’:
  Issued certificate has expired.
To connect to mirrors.edge.kernel.org insecurely, use `--no-check-certificate'.
```



**方案**

```perl
wget --no-check-certificate https://mirrors.edge.kernel.org/pub/software/scm/git/git-2.9.0.tar.gz
```

