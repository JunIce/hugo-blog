---
title: "linux基础知识"
date: 2022-07-17T16:39:17+08:00
tags:
categories:
draft: false
---



# linux基础知识

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









