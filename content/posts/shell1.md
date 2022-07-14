---
title: "shell教程"
date: 2022-07-12T09:29:26+08:00
tags: ["shell"]
categories: ["shell"]
draft: false

---



# shell笔记



- 单引号变量，不识别特殊语法
- 双引号变量，可以识别特殊语法



1. 每次调用bash/sh解释器执行脚本，都会开启一个子shell，因此不会保留当前的shell变量
2. 通过source命令或者./方式执行脚本，会在当前shell环境加载脚本，因此会保留变量



```bash
name=`ls`  // 反引号会保留当前命令执行的结果
```



环境变量可以在命令行中临时创建，但是用户退出shell终端，变量即将丢失，要永久生效，就必须修改环境变量配置文件



先执行.bash_profile, 再执行.bashrc



- set命令，可以查找所有的变量
- env命令，可以查找全局变量
- declare, 输出所有的变量
- export  显示和设置环境变量



unset 删除环境变量赋值



```bash
$0   获取脚本文件名，以及脚本的文件路径
$n   传给脚本的参数位置，表示
$#   获取参数的总个数
$*   获取所有参数
$@   获取所有参数
```



`$*`和`$@`的区别

不加双引号时，大家输出时一样的

加上双引号后

- "$*" ： 会将所有参数从整体上看做一份数据，而不是把每个参数都看做一份数据
- "$@":   将每个参数看做一个独立的数据



```bash
$?  上一次命令执行状态返回值， 0是执行成功， 非0就是执行失败
$$  当前shell脚本的进程号
$!  上一次后台进程的PID
$_  取上一次执行脚本的最后一个参数
```



![image-20220712211005313](http://cdn.storycn.cn/blog/image-20220712211005313.png)



### echo

```bash
-e 解析字符串中的特殊字符
-n 不换行输出
```



### eval

```bash
同时执行多个命令
```



### exec

```bash
不创建子进程，执行后续命令，且执行完毕后，自动exit
```



## shell子串



```bash
#!/bin/bash

name="hello world"

echo ${name}
echo ${#name}
echo ${name:3}   # 裁剪下标3之后的所有字符
echo ${name:3:4} # 提取3之后4个字符
echo ${name#wor} # 从前向后删除最短匹配字符串
echo ${name##rld}# 从前向后删除最长匹配字符串
echo ${name%ell} # 从后向前删除最短匹配字符串
echo ${name%%rld}# 从后向前删除最长匹配字符串
# 替换 1个斜杠只替换1个，2个斜杠替换所有的
echo ${name/world/jack}
echo ${name//o/e}


#hello world
#11
#lo world
#lo w
#ld
#hello world
#hello world
#hello wo
#hello jack
#helle werld

```



```bash
wc -l  # 统计字符长度
wc -L  # 找到文件中最长的一行，并且输出这一行的字符数量

expr length "${name}" # 统计变量字符长度

# 利用awk统计长度
echo "${name}" | awk '{printf length($0)}'
```





```bash
➜  ~ time for n in {1..10000}; do char=`seq -s ":" 100`; echo ${char}&>/dev/null;done

real 0m12s # 实际执行时间
user       # 用户态执行时间
sys 			 # 内核执行时间
```





```perl
# 如果parameter为空，返回word字符串，赋值给result变量
result=${parameter:-word}

# 如果parameter为空，word赋值给parameter，并且赋值给result变量
result=${parameter:=word}

# 如果parameter为空，word当作stderr输出，否则输出变量值
${parameter:?word}

# 如果parameter为空，什么都不做，否则返回word
${parameter:+word}
```



```perl
1. source和点执行脚本，在当前shell环境执行生效
2. bash sh解释器执行脚本，开启subshell，开启子shell运行脚本
3. ./script 都会指定shebang,通过解释器运行，开启子shell运行脚本
```





### 检测是否在子shell环境中

```perl
# 如果是0，则是在当前shell环境中执行的，否则就是开辟子shell执行的
BASH_SUBSHELL
```



### 子shell嵌套运行

一个括号（）开启一个子shell

```perl
(pwd;(pwd;(echo $BASH_SUBSHELL)))
```



### 内置命令、外置命令



- 内置命令：系统启动时加载入内存，常驻内存，执行效率更高，占用资源
- 外置命令：用户需要从硬盘中读取程序，加载到内存中



### read接收命令行参数

```perl
read -t 15 -p "名字，年龄："
```



### 条件测试

- test 测试表达式
- [测试表达式]
- [[测试表达式]]
- ((测试表达式))



### test

```perl
test -e test.sh # 判断文件是否存在， 存在就是真，否则为假， 使用$?输出值
```



**在条件测试中使用变量必须使用双引号**

```perl
[ -f "${filename}" ] && echo yes || echo no
```



| 在[]和test中 | 在[[]]和(())中 | 说明  |
| ------------ | -------------- | ----- |
| -a           | &&             | and和 |
| -o           | \|\|           | or或  |
| !            | !              | not非 |





