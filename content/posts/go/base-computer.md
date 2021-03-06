---
title: "golang -- 计算机基础"
date: 2022-01-23T14:34:26+08:00
draft: true
tags: ["go"]
categories: ["go"]
---


# 计算机基础


## 原码、反码、补码

- 1. 二进制最高位表示符号位， 0 表示正数、1 表示负数

原码

```c
1 => [0000 0001]
-1 => [1000 0001]
```

- 2. 正数的原码、反码、补码都一样

- 3. 负数的反码 = 原码的符号位不变，其他位取反 (0 => 1, 1 => 0)


以3和-3为例

```c

3 => 
    原码 [0000 0011]
    反码 [0000 0011]
    补码 [0000 0011]

-3 => 
    原码 [1000 0011]
    反码 [1111 1100]
    补码 [1111 1101]
```

- 4. 负数的补码 = 它的反码 + 1

- 5. 0 的反码补码都是 0 

- 6. 计算机运算时，都是以补码的方式运算的


```sh

2 & 3
    2 的反码 [0000 0010]
    3 的反码 [0000 0011]
        -   [0000 0010] => 2


2 | 3
    2 的反码 [0000 0010]
    3 的反码 [0000 0011]
        -   [0000 0011] => 3

2 ^ 3
    2 的反码 [0000 0010]
    3 的反码 [0000 0011]
        -   [0000 0001] => 1

-2 ^ 2

    -2 的原码 [1000 0010] => 反码 [1111 1101] => 补码[1111 1110]
    2 的补码 [0000 0010]

    result => 补码[1111 1100] => 反码[1111 1011] => 原码[1000 0100] // -4
```



