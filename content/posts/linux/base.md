---
title: "linux 下常用命令行"
date: 2022-07-17T16:39:17+08:00
tags: ["linux"]
categories: ["linux"]
draft: false
---

# linux 下常用命令行

- id 查看当前登陆用户的相关信息
- groups 当前用户的组
- who 当前登陆账户

```bash
[root@VM-0-6-centos node-api]# id
uid=0(root) gid=0(root) groups=0(root)
[root@VM-0-6-centos node-api]# groups
root
```



### 账户密码

```bash
[root@VM-0-6-centos node-api]# cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
```



```bash
[root@VM-0-6-centos node-api]# cat /etc/shadow
bin:*:17632:0:99999:7:::
daemon:*:17632:0:99999:7:::
adm:*:17632:0:99999:7:::
lp:*:17632:0:99999:7:::
sync:*:17632:0:99999:7:::
```



### useradd 用户操作

```perl
[root@VM-0-6-centos ~]# useradd john
[root@VM-0-6-centos ~]# cd /home/john/
[root@VM-0-6-centos john]# ls -la
total 20
drwx------  2 john john 4096 Jul 17 19:45 .
drwxr-xr-x. 3 root root 4096 Jul 17 19:45 ..
-rw-r--r--  1 john john   18 Apr 11  2018 .bash_logout
-rw-r--r--  1 john john  193 Apr 11  2018 .bash_profile
-rw-r--r--  1 john john  231 Apr 11  2018 .bashrc
```



- 删除用户

```perl
[root@VM-0-6-centos john]# userdel john
```



### passwd密码

```perl
[root@VM-0-6-centos john]# passwd john
Changing password for user john.
New password:
BAD PASSWORD: The password is shorter than 7 characters
Retype new password:
Sorry, passwords do not match.
New password:
BAD PASSWORD: The password is shorter than 7 characters
Retype new password:
passwd: all authentication tokens updated successfully.
```



### group 组

```perl
[root@VM-0-6-centos john]# groupadd g1
[root@VM-0-6-centos john]# groupdel g1
```



### 查看当前用户

```perl
[root@VM-0-6-centos john]# users
root
[root@VM-0-6-centos john]# who
root     pts/0        2022-07-17 19:45 (112.20.57.64)
[root@VM-0-6-centos john]# w
 19:50:19 up 322 days, 21:21,  1 user,  load average: 0.00, 0.01, 0.05
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    112.20.57.64     19:45    3.00s  0.05s  0.00s w
```



- 添加sudo权限

```perl
 [root@VM-0-6-centos john]# visudo
 ### .....
 91 ## Allow root to run any commands anywhere
 92 root    ALL=(ALL)       ALL
	  john    ALL=(ALL)       ALL
```



### at定时任务

设置延时任务

```perl
# 新增
[root@VM-0-6-centos john]# at now + 1 minutes
at> echo "123"<EOT>
job 2 at Sun Jul 17 20:03:00 2022
# 列表展示
[root@VM-0-6-centos john]# at -l
# 根据id查询
[root@VM-0-6-centos john]# at -c 2
Cannot find jobid 2

# 删除
[root@VM-0-6-centos john]# atrm 1
Cannot find jobid 1
[root@VM-0-6-centos john]# atrm 2
Cannot find jobid 2
```





### cron定时任务

```perl
# 查询当前用户的定时任务
[root@localhost ~]# crontab -u john -l
```



```perl
[root@VM-0-6-centos john]# cat /etc/crontab
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed
```



### head、tail 查看文件头

查看前10行

```perl
[root@VM-0-6-centos ~]# head clean-docker-log.sh
#!/bin/sh

echo "======== start clean docker containers logs ========"

logs=$(find /var/lib/docker/containers/ -name *-json.log)

for log in $logs
        do
                echo "clean logs : $log"
                cat /dev/null > $log
```



- tail 查看尾10行

```perl
[root@VM-0-6-centos ~]# tail clean-docker-log.sh

logs=$(find /var/lib/docker/containers/ -name *-json.log)

for log in $logs
        do
                echo "clean logs : $log"
                cat /dev/null > $log
        done

echo "======== end clean docker containers logs ========"
```



### 权限

```perl
[root@VM-0-6-centos ~]# ls -la
total 446424
dr-xr-x---. 15 root root      4096 Jun 21 08:57 .
dr-xr-xr-x. 19 root root      4096 Jul 17 20:15 ..
-rw-------   1 root root     71189 Jul 17 20:13 .bash_history
-rw-r--r--.  1 root root        18 Dec 29  2013 .bash_logout
```



第一列是文件类别和权限，这列由10个字符组成。 第1个字符表明该文件的类型。

接下来的属性中，每3个字符为一组。

 - 第2~4个字符代表该文件所有者（user）的权限

 - 第5~7个字符代表给文件所有组（group）的权限

 - 第8~10个字符代表其他用户（others）拥有的权限

   

   每组都是rwx的组合，如果拥有读权限，则该组的第一个字符显示r，否则显示一个小横线；

   如果拥有写权限，则该组的第二个字符显示w，否则显示一个小横线；

   如果拥有执行权限，则第三个字符显示x，否则显示一个小横线。





### chmod 改变权限

使用字母u、g、o来分别代表拥有者、拥有组、其他人

增加权限使用+号，删除权限使用-号，详细权限使用=号

```perl
[john@VM-0-6-centos ~]$ touch test.sh
[john@VM-0-6-centos ~]$ chmod u+w test.sh
[john@VM-0-6-centos ~]$ ll
total 0
-rw-rw-r-- 1 john john 0 Jul 17 20:21 test.sh
[john@VM-0-6-centos ~]$ chmod u+x test.sh
[john@VM-0-6-centos ~]$ ll
total 0
-rwxrw-r-- 1 john john 0 Jul 17 20:21 test.sh
```



通过`chmod u+操作符 file`



如果要想同时设置**所有人的权限**就需要使用数字表示法了，我们定义**r=4，w=2，x=1**，如果权限是rwx，则数字表示为7，如果权限是r-x，则数字表示为5。



### chown

更改文件拥有者

```perl
[john@VM-0-6-centos ~]$ chown root test.sh
chown: changing ownership of ‘test.sh’: Operation not permitted
```



### chgrp

```perl
[john@VM-0-6-centos ~]$ chgrp root test.sh
```



### file

查看文件类型

```perl
[root@VM-0-6-centos ~]# file hugo
hugo: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, stripped
[root@VM-0-6-centos ~]# file spider_job.sh
spider_job.sh: ASCII text
```



### find

查找文件

```perl
find PATH -name FILENAME
```



### locate

定位文件

```perl
[root@VM-0-6-centos ~]# updatedb
[root@VM-0-6-centos ~]# locate httpd.conf
/etc/httpd/conf/httpd.conf
/usr/lib/tmpfiles.d/httpd.conf
```



### whereis/which

查找可执行文件

```perl
[root@VM-0-6-centos ~]# whereis hugo
hugo: /usr/local/bin/hugo
[root@VM-0-6-centos ~]# which hugo
/usr/local/bin/hugo
```



### gzip/gunzip

压缩和解压单个文件

```perl
[root@VM-0-6-centos ~]# echo "hello world" > i.log
[root@VM-0-6-centos ~]# cat i.log
hello world
[root@VM-0-6-centos ~]# gzip i.log
[root@VM-0-6-centos ~]# gunzip i.log.gz
```



### mount

硬盘挂载

```perl
mount DEVICE MOUNT_POINT

# 直接输入mount会显示所有挂载
[root@VM-0-6-centos ~]# mount
sysfs on /sys type sysfs (rw,relatime)
proc on /proc type proc (rw,relatime)
```



### 查看启动自动挂载

```perl
[root@VM-0-6-centos ~]# cat /etc/fstab
UUID=21dbe030-aa71-4b3a-8610-3b942dd447fa            /                    ext4       noatime,acl,user_xattr 1 1
proc                 /proc                proc       defaults              0 0
sysfs                /sys                 sysfs      noauto                0 0
debugfs              /sys/kernel/debug    debugfs    noauto                0 0
devpts               /dev/pts             devpts     mode=0620,gid=5       0 0
```



### sort

管道排序

- -r: 反向排序
- -n: 采取数字排序
- -k: 指定第几列
- -t: 指定分割符

```perl
[root@VM-0-6-centos john]# cat test.txt
b:3
c:2
a:4
e:5
d:1
f:11
[root@VM-0-6-centos john]# cat test.txt | sort
a:4
b:3
c:2
d:1
e:5
f:11
[root@VM-0-6-centos john]# cat test.txt | sort -r
f:11
e:5
d:1
c:2
b:3
a:4
[root@VM-0-6-centos john]# cat test.txt | sort -t ":" -k 2
d:1
f:11
c:2
b:3
a:4
e:5
[root@VM-0-6-centos john]# cat test.txt | sort -t ":" -k 2 -n
d:1
c:2
b:3
a:4
e:5
f:11
```



### uniq

管道操作符uniq通常配合sort一起使用

```perl
uniq命令只会对比相邻的行，如果有连续相同的若干行则删除重复内容，仅输出一行。如果相同的行非连续，则uniq命令不具备删除效果。第二次则在使用sort排序后再使用uniq命令，这时就达到了预期的效果。
```



### cut

截取文本

```perl
[root@VM-0-6-centos john]# cat test.txt | cut -f 2 -d ":"
3
2
4
5
1
11
```



### paste

文本合并

- -d指定分割符

```perl
[root@VM-0-6-centos john]# cat a.txt
1
2
3
4
5
[root@VM-0-6-centos john]# cat b.txt
a
b
c
d
f
e
[root@VM-0-6-centos john]# paste -d ":" a.txt b.txt
1:a
2:b
3:c
4:d
5:f
:e
```



### split

文件分割，如果文件是字符，可以分割成多个指定行数的文件

如果文件是二进制文件，只能指定分割后文件的大小分割

```perl
[root@VM-0-6-centos john]# split -l 1 a.txt
split -b 64m big_bin small_bin_
```



### host

查询DNS记录，如果使用域名作为host的参数，则返回该域名的IP

```perl
[root@VM-0-6-centos john]# host www.baidu.com
www.baidu.com is an alias for www.a.shifen.com.
www.a.shifen.com has address 112.80.248.76
www.a.shifen.com has address 112.80.248.75
```



### 进程

进程表示程序的一次执行过程，它是应用程序的运行实例，是一个动态的过程。

进程包括动态执行的程序和数据两部分。

所有的进程都可能存在3种状态：运行态、就绪态、阻塞态。









