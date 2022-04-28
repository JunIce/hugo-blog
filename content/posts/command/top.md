---
title: "top 命令详解"
date: 2022-04-28T21:47:18+08:00
draft: true
tags: ["linux"]
---



# linux top命令各参数详解



```sh
top - 21:49:37 up 242 days, 23:20,  1 user,  load average: 0.06, 0.12, 0.13
Tasks: 120 total,   1 running, 118 sleeping,   0 stopped,   1 zombie
%Cpu(s):  2.3 us,  0.7 sy,  0.0 ni, 96.6 id,  0.3 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  1882764 total,    79916 free,   925176 used,   877672 buff/cache
KiB Swap:        0 total,        0 free,        0 used.   755872 avail Mem
```



- load average: 1分钟、5分钟、15分钟的系统负载
- Cpu(s): 2.3% us  **用户空间占用CPU百分比**
- 0.7 sy： **内核空间占用CPU百分比**
- 0.0 ni： 用户进程空间内改变过优先级的进程占用CPU百分比。ni是nice的缩写，**可以通过nice值调整进程用户态的优先级**，这里显示的ni表示调整过nice值的进程消耗掉的CPU时间。如果系统中没有进程被调整过nice值，那么ni就显示为0
- 96.6 id： **空闲CPU百分比**
- 0.3 wa,   等待输入输出的CPU时间百分比
- 0.0 hi,  硬中断占用百分比
- 0.0 si,  软中断占用百分比
- 0.0 st



- Mem :  1882764 total **物理内存总量**
- 925176 used**使用的物理内存总量**
- 79916 free **空闲的内存总量**
- 877672 buff/cache 用作**内核缓存**的内存量
- Swap: 4192924k total 交换区内存总量
- 0k used 使用的交换区总量
- 4192924k free 空闲的交换区总量
- 894080k cached 缓冲的交换区总量



## 字段含义



```
序号  列名    含义
a    PID     进程id
b    PPID    父进程id
c    RUSER   Real user name
d    UID     进程所有者的用户id
e    USER    进程所有者的用户名
f    GROUP   进程所有者的组名
g    TTY     启动进程的终端名。不是从终端启动的进程则显示为 ?
h    PR      优先级
i    NI      nice值。负值表示高优先级，正值表示低优先级
j    P       最后使用的CPU，仅在多CPU环境下有意义
k    %CPU    进程使用的CPU的百分比
l    TIME    进程使用的CPU时间总计，单位秒
m    TIME+   进程使用的CPU时间总计，单位1/100秒
n    %MEM    进程使用的物理内存百分比
o    VIRT    进程使用的虚拟内存总量，单位kb。VIRT=SWAP+RES
p    SWAP    进程使用的虚拟内存中，被换出的大小，单位kb。
q    RES     进程使用的、未被换出的物理内存大小，单位kb。RES=CODE+DATA
r    CODE    可执行代码占用的物理内存大小，单位kb
s    DATA    可执行代码以外的部分(数据段+栈)占用的物理内存大小，单位kb
t    SHR     共享内存大小，单位kb
u    nFLT    页面错误次数
v    nDRT    最后一次写入到现在，被修改过的页面数。
w    S       进程状态(D=不可中断的睡眠状态,R=运行,S=睡眠,T=跟踪/停止,Z=僵尸进程)
x    COMMAND 执行的命令
y    WCHAN   若该进程在睡眠，则显示睡眠中的系统函数名
z    Flags   任务标志，参考 sched.h
```

